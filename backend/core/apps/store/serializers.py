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
    short_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            'id',
            'image',
            'short_url',
            'alt_text',
            'is_feature',
        ]

    def get_short_url(self, obj):
        print(obj.image.__dict__)
        return obj.image.name


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
