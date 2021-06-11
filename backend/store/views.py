from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    This viewset provides 'list' and 'retrieve' actions
    """
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    # Custom filter of objects
    def get_queryset(self):
        return Product.objects.filter(is_active=True)

    # Custom methods
    @action(detail=False, methods=['get'], url_path=r'category/(?P<slug>\w+)')
    def category(self, request, slug):
        queryset = self.get_queryset().filter(category__slug=slug)
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
