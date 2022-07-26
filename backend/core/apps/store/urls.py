from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'store'

# Router for the products
product_router = DefaultRouter()
product_router.register('products', views.ProductViewSet)

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('', include(product_router.urls))
]
