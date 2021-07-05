from django.urls import path
from django.urls.conf import include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'account'

# Create a default router and register the viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
]
