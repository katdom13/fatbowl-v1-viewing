import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.http import require_POST
from rest_framework import viewsets

# from rest_framework.decorators import action
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import CustomUser
from account.permissions import IsOwnerOrAdmin
from account.serializers import UserSerializer

from .tokens import account_activation_token


def get_csrf(request):
    response = JsonResponse({
        'info': 'Success - Set CSRF token'
    })
    response['X-CSRFToken'] = get_token(request)

    return response


@require_POST
def login_view(request):
    print(request.headers['X-CsrfToken'])
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return JsonResponse(
            {'info': 'Username and password are needed'},
            status=400
        )

    user = User.objects.filter(username=username).first()

    if user:
        if not user.is_active:
            return JsonResponse({'info': 'Account is inactive'}, status=400)
        else:
            user = authenticate(username=username, password=password)

            if not user:
                return JsonResponse({'info': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'info': 'User does not exist'}, status=400)

    login(request, user)
    return JsonResponse({'info': 'User logged in successfully'})


def logout_view(request):
    logout(request)
    return JsonResponse({'info': 'User logged out'})


class WhoAmIView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        print('COOKIES', request.COOKIES)
        return JsonResponse({'username': request.user.username})


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides 'list', 'retrieve',
    'create', 'update', and 'destroy' actions
    """
    serializer_class = UserSerializer
    lookup_field = 'user__username'

    def get_queryset(self):
        return CustomUser.objects.filter(user__is_active=True).all()

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        elif self.action == 'update' or self.action == 'destroy':
            permission_classes = [IsOwnerOrAdmin]
        elif self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]

        return [permission() for permission in permission_classes]

    # Set partial update to true for ignoring
    # required updates on fields that are not in the PUT request
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        print('[USERVIEWSET OBJECT]', instance)

        # Prune items in request data without values
        data = {key: value for key, value in request.data.items() if value}

        # handle changing password
        if data.get('old_password') and data.get('new_password'):
            old = data.pop('old_password')
            new = data.pop('new_password')

            if instance.user.check_password(old):
                data['password'] = new

            else:
                return Response({'password': 'Invalid password'}, 403)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        print('[SERIALIZER ERRORS]', serializer.errors)

        return Response(serializer.data)


class UserActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token, format=None):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            print('[USER ERROR]')
            user = None

        if user and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            # login(request, user)
            return Response({'info': 'User account is activated'})
        else:
            return Response({'error': 'User account activation failed'}, 400)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    email_template_name = 'account/user/password_reset_email.html'

    def post(self, request, format=None):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if user:
            user.email_user(
                subject='FatOwl - Password reset request for {username}'.format(
                        username=user.username
                ),
                message=render_to_string(
                    self.email_template_name,
                    {
                        'user': user,
                        'base_url': 'http://localhost:3001',
                        'path': 'password-reset/{uidb64}/{token}'.format(
                            uidb64=urlsafe_base64_encode(force_bytes(user.pk)),
                            token=default_token_generator.make_token(user)
                        )
                    }
                )
            )
            return Response({'success': 'Email sent'})
        else:
            return Response({'error': 'There is no user with that email'}, 404)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, format=None):
        password = request.data.get('password')

        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

        if user and default_token_generator.check_token(user, token):
            user.password = make_password(password)
            user.save()
            return Response({'success': 'Password has been set'})
        else:
            return Response({'error': 'Password reset failed. Please try again'}, 400)
