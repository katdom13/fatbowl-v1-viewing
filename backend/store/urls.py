from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'store'

# Create a default router to register the viewsets
router = DefaultRouter()
router.register(r'products', views.ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', views.CategoryListView.as_view(), name='category_list')
]
