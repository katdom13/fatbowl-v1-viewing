from core.apps.store.serializers import (
    ProductSerializer,
    ProductSpecificationSerializer,
    ProductSpecificationValueSerializer,
)
from rest_framework import serializers

from .models import Order, OrderItem, OrderItemSpecification


class OrderItemSpecificationSerializer(serializers.ModelSerializer):
    specification_detail = ProductSpecificationSerializer(source='specification', read_only=True)
    value_detail = ProductSpecificationValueSerializer(source='value', read_only=True)

    class Meta:
        model = OrderItemSpecification
        fields = [
            'id',
            'specification',
            'value',
            'specification_detail',
            'value_detail'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    detail = ProductSerializer(source='product', read_only=True)
    specifications = OrderItemSpecificationSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'detail', 'price', 'qty', 'specifications']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

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
