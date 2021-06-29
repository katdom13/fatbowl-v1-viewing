import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


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
        user = authenticate(username=username, password=password)

        if not user:
            return JsonResponse({'info': 'Invalid credentials'}, status=401)

    if not user:
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
