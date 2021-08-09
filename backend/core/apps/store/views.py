from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Get root nodes only
    def get_queryset(self):
        return Category.objects.filter(level=0)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.products.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    # Custom method to view products by category
    @action(detail=False, methods=['get'], url_path=r'category/(?P<slug>\w+)')
    def category(self, request, slug):
        product_category = Category.objects.filter(slug=slug).first()

        if product_category:
            queryset = self.get_queryset().filter(
                category__in=Category.objects.get(slug=slug).get_descendants(
                    include_self=True
                )
            )
            serializer = self.get_serializer(queryset, many=True)

            return Response({
                'category': product_category.name,
                'products': serializer.data
            })
        else:
            Response({
                'error': 'Category not found'
            }, status=404)
