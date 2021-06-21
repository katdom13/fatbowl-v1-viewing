from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'cart'

# Create a default router to register the viewsets
router = DefaultRouter()
router.register(r'cart', views.CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]
