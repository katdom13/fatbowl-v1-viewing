from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from store.models import Product

from .models import Cart, CartItem
from .serializers import CartItemSerializer


class CartViewSet(viewsets.ModelViewSet):
    """
    This viewset provides 'list' and 'retrieve' actions
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # override
    def get_queryset(self):
        return CartItem.objects.filter(cart__user__id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        items = serializer.data

        # Compute total price (price * qunatity)
        # and add to serializer data
        for item in items:
            item['total_price'] = float(item['product_detail']['regular_price']) * int(item['qty'])

        return Response({
            'items': items,
            'total_item_qty': sum(item.qty for item in queryset),
            'total_item_price':
                '{:.2f}'.format(sum(item.product.regular_price * item.qty for item in queryset))
        })

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
        serializer = self.get_serializer(cart_item)
        queryset = self.get_queryset()
        return Response({
            'item': serializer.data,
            'total_item_qty': sum(item.qty for item in queryset)
        })

    def destroy(self, request, *args, **kwargs):
        cart_item = self.get_object()
        serializer = self.get_serializer(cart_item)
        item = serializer.data

        super().destroy(request, *args, **kwargs)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'item': item,
            'items': serializer.data,
            'total_item_qty': sum(item.qty for item in queryset),
            'total_item_price': sum(item.product.regular_price * item.qty for item in queryset),
        })

    def update(self, request, *args, **kwargs):
        print('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', request.headers)
        cart_item = self.get_object()
        serializer = self.get_serializer(cart_item)
        item = serializer.data

        super().update(request, *args, **kwargs)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'item': item,
            'items': serializer.data,
            'total_item_qty': sum(item.qty for item in queryset),
            'total_item_price':
                '{:.2f}'.format(sum(item.product.regular_price * item.qty for item in queryset))
        })
