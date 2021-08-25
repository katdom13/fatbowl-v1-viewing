from core.apps.store.serializers import (
    ProductSerializer,
    ProductSpecificationSerializer,
    ProductSpecificationValueSerializer,
)
from rest_framework import serializers

from .models import Cart, CartItem, CartItemSpecification


class CartItemSpecificationSerializer(serializers.ModelSerializer):
    specification_detail = ProductSpecificationSerializer(source='specification', read_only=True)
    value_detail = ProductSpecificationValueSerializer(source='value', read_only=True)

    class Meta:
        model = CartItemSpecification
        fields = [
            'id',
            'specification',
            'value',
            'specification_detail',
            'value_detail'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    detail = ProductSerializer(source='product', read_only=True)
    specifications = CartItemSpecificationSerializer(many=True, read_only=True)
    price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'detail', 'qty', 'specifications', 'price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_qty = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = [
            'public_id',
            'items',
            'total_qty',
            'total_price'
        ]
