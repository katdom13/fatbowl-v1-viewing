from core.apps.order.models import Order, OrderItem, OrderItemSpecification
from paypalcheckoutsdk.orders import OrdersGetRequest
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DeliveryOption
from .paypal import PayPalClient
from .serializers import DeliveryOptionSerializer


class DeliveryOptionListView(generics.ListAPIView):
    serializer_class = DeliveryOptionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DeliveryOption.objects.filter(is_active=True).all()


class Payment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        PPClient = PayPalClient()
        order_id = request.data.get('order_id')
        address = request.data.get('address')

        request_order = OrdersGetRequest(order_id)
        response = PPClient.client.execute(request_order)

        user = request.user.customuser
        total_paid = response.result.purchase_units[0].amount.value
        cart = user.cart

        # Create the order object
        order = Order.objects.create(
            user=user,
            full_name=response.result.purchase_units[0].shipping.name.full_name,
            email=user.user.email,
            address_line_1=address.get('address_line_1'),
            address_line_2=address.get('address_line_2'),
            town_city=address.get('town_city'),
            phone_number=address.get('phone_number'),
            postcode=address.get('postcode'),
            country_code='PH',
            total_paid=total_paid,
            order_key=response.result.id,
            payment_option='paypal',
            billing_status=True
        )

        # From cart to receipt
        for cart_item in cart.items.all():
            order_item = OrderItem.objects.create(
                order_id=order.pk,
                product=cart_item.product,
                price=cart_item.price,
                qty=cart_item.qty
            )

            for specification in cart_item.specifications.all():
                OrderItemSpecification.objects.create(
                    order_item=order_item,
                    specification=specification.specification,
                    value=specification.value
                )

        # Delete cart altogether
        cart.delete()

        return Response({
            'success': 'Payment successful'
        })
