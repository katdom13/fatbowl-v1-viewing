from rest_framework import serializers

from .models import (
    Category,
    Product,
    ProductImage,
    ProductSpecification,
    ProductSpecificationValue,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            'id',
            'image',
            'alt_text',
            'is_feature',
        ]


class ProductSpecificationValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecificationValue
        fields = [
            'id',
            'value',
            'additional_price',
        ]


class ProductSpecificationSerializer(serializers.ModelSerializer):
    values = ProductSpecificationValueSerializer(many=True, read_only=True)

    class Meta:
        model = ProductSpecification
        fields = [
            'id',
            'name',
            'values',
        ]


class ProductSerializer(serializers.ModelSerializer):
    product_image = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'slug',
            'regular_price',
            'product_image',
            'specifications',
        ]
