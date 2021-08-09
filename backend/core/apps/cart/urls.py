from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'cart'

# Create a default router to register the cart viewsets
cart_router = DefaultRouter()
cart_router.register(r'', views.CartViewSet, basename='cart')

urlpatterns = [
    path('', include(cart_router.urls))
]
