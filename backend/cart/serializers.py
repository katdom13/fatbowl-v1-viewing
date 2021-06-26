from rest_framework import serializers
from store.serializers import ProductSerializer

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'qty']


class CartSerializer(serializers.ModelSerializer):
    # items = CartItemSerializer(many=True, read_only=True)
    item = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'user',
            'item',
        ]
