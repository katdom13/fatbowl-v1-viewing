from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from store.models import Product

from .models import Cart, CartItem
from .serializers import CartItemSerializer


class CartViewSet(viewsets.ModelViewSet):
    """
    This viewset provides 'list' and 'retrieve' actions
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    # override
    def get_queryset(self):
        return CartItem.objects.filter(cart__user__id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(user__id=request.user.id).first()

        if not cart:
            cart = Cart.objects.create(user=request.user)

        product = Product.objects.filter(id=request.data.get('product_id')).first()

        cart_item = CartItem.objects.filter(
            cart__id=cart.id,
            product__id=product.id
        ).first()

        if cart_item:
            cart_item.qty = cart_item.qty + request.data.get('product_qty')
            cart_item.save()
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                product=Product.objects.filter(id=request.data.get('product_id')).first(),
                qty=request.data.get('product_qty')
            )

        # Return generated cart item json
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)
