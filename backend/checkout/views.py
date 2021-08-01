from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import DeliveryOption
from .serializers import DeliveryOptionSerializer


class DeliveryOptionListView(generics.ListAPIView):
    serializer_class = DeliveryOptionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DeliveryOption.objects.filter(is_active=True).all()
