from core.apps.account.models import CustomUser
from core.apps.account.permissions import (
    IsAccountOwnerOrAdmin,
    IsAddressOwnerOrAdmin,
    IsOrderOwnerOrAdmin,
    IsWishlistOwner,
)
from core.apps.account.serializers import AddressSerializer, UserSerializer
from core.apps.order.models import Order
from core.apps.order.serializers import OrderSerializer
from core.apps.store.models import Product
from core.apps.store.serializers import ProductSerializer
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.middleware.csrf import get_token
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, viewsets
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Address
from .tokens import account_activation_token


class CSRFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        response = Response({
            'success': 'CSRF Token set'
        })
        response['X-CSRFToken'] = get_token(request)
        return response


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Username or password are needed'
            }, status=400)

        user = User.objects.filter(username=username).first()

        if user:
            if user.is_active:
                user = authenticate(username=username, password=password)

                if not user:
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=401)
            else:
                return Response({
                    'error': 'The account is inactive. Please activate your account, \
                        or email the support team.'
                }, status=400)
        else:
            return Response({
                'error': 'The account does not exist'
            }, status=404)

        login(request, user)
        return Response({'success': 'Login successful'})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,  format=None):
        logout(request)
        return Response({'success': 'Logout successful'})


class WhoAmIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        return Response({'username': request.user.username})


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    lookup_field = 'user__username'

    def get_queryset(self):
        return CustomUser.objects.filter(user__is_active=True).all()

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminUser]
        elif self.action == 'retrieve' \
            or self.action == 'update' \
                or self.action == 'destroy':
            permission_classes = [IsAccountOwnerOrAdmin]
        elif self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]

        return [permission() for permission in permission_classes]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Prune keys withouth value in request data
        data = {key: value for key, value in request.data.items() if value}

        # Handle changing of password
        if data.get('old_password') and data.get('new_password'):
            old = data.pop('old_password')
            new = data.pop('new_password')

            if instance.user.check_password(old):
                data['password'] = new
            else:
                return Response({
                    'password': 'Invalid password'
                }, status=403)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class UserActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token, format=None):
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(pk=uid).first()

        if user and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({
                'success': 'User account activated'
            })
        else:
            return Response({
                'error': 'User account activation failed. Please contact the support team'
            }, status=400)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    email_template_name = 'account/user/password_reset_email.html'

    def post(self, request, format=None):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        base_url = settings.env('FRONTEND_BASEURL') if settings.FROM_DOCKER else 'http://localhost:3000/'

        if user:
            user.email_user(
                subject='FatOwl - Password reset request for {username}'.format(
                        username=user.username
                ),
                message=render_to_string(
                    self.email_template_name,
                    {
                        'user': user,
                        'base_url': base_url,
                        'path': 'password-reset/{uidb64}/{token}'.format(
                            uidb64=urlsafe_base64_encode(force_bytes(user.pk)),
                            token=default_token_generator.make_token(user)
                        )
                    }
                )
            )
            return Response({
                'success': 'Password reset email sent'
            })
        else:
            return Response({
                'error': 'There is no user with that email'
            }, status=404)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, format=None):
        password = request.data.get('password')

        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(pk=uid).first()

        if user and default_token_generator.check_token(user, token):
            user.password = make_password(password)
            user.save()
            return Response({
                'success': 'Password reset'
            })
        else:
            return Response({
                'error': 'Password reset failed. Please try again'
            }, status=400)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    lookup_field = 'public_id'
    permission_classes = [IsAddressOwnerOrAdmin]

    def get_queryset(self):
        return Address.objects.filter(user__user__id=self.request.user.id).all()

    # Include custom user in creation and updating of address
    # to safeguard against interacting with other users' address

    def create(self, request, *args, **kwargs):
        data = request.data
        data['user'] = request.user.customuser.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        data['user'] = request.user.customuser.id

        # Enable partial updates
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class WishListView(generics.ListAPIView):
    """
    Public wishlist view for the current logged in user
    """
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(users_wishlist=self.request.user.customuser)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class WishListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsWishlistOwner]

    def get_object(self, product_id):
        return Product.objects.get(id=product_id)

    def update(self, request, product_id, *args, **kwargs):
        try:
            product = self.get_object(product_id)
            if product.users_wishlist.filter(user_id=request.user.id).exists():
                product.users_wishlist.remove(request.user.customuser)
                return Response({
                    'success':
                        f'{product.title} has been removed from your wishlist',
                })
            else:
                product.users_wishlist.add(request.user.customuser)
                return Response({
                    'success':
                        f'Added {product.title} to your wishlist'
                })
        except(Product.DoesNotExist):
            return Response({
                'error': 'Product does not exist'
            }, status=404)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsOrderOwnerOrAdmin]

    def get_queryset(self):
        return Order.objects.filter(user__user__id=self.request.user.id).all()
