from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'qty']


class CartSerializer(serializers.ModelSerializer):
    # items = CartItemSerializer(many=True, read_only=True)
    item = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'user',
            'item',
        ]
