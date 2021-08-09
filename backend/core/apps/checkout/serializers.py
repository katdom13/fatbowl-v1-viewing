from rest_framework import serializers

from .models import DeliveryOption


class DeliveryOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOption
        fields = [
            'id',
            'name',
            'price',
            'method',
            'timeframe',
            'window',
            'order',
            'is_active',
        ]
