from django.urls import path
from django.urls.conf import include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'account'

# Create a default router and register the viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

address_router = DefaultRouter()
address_router.register(r'address', views.AddressViewSet, basename='address')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(address_router.urls)),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
    path(
        'activate/<slug:uidb64>/<slug:token>/',
        views.UserActivationView.as_view(),
        name='activate'
    ),
    path('password_reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path(
        'password_reset_confirm/<slug:uidb64>/<slug:token>/',
        views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    )
]
