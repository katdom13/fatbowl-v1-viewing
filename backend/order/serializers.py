from cart.serializers import CartItemSerializer
from rest_framework import serializers
from store.serializers import ProductSerializer

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'detail', 'price', 'qty']


class OrderSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'full_name',
            'email',
            'address_line_1',
            'address_line_2',
            'town_city',
            'phone_number',
            'postcode',
            'country_code',
            'created_at',
            'updated_at',
            'total_paid',
            'order_key',
            'payment_option',
            'billing_status',
            'items',
        ]
