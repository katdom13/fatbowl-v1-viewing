from account.models import CustomUser
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from store.models import Product

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_fields = ('id', 'public_id')

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'create' or self.action == 'retrieve':
            return CartSerializer
        elif self.action == 'update' or self.action == 'delete':
            return CartItemSerializer

    def get_queryset(self):
        if self.action == 'list' or self.action == 'create' or self.action == 'retrieve':
            return Cart.objects.get(custom_user__user__id=self.request.user.id)
        elif self.action == 'update' or self.action == 'delete':
            return CartItem.objects.filter(cart__custom_user__user__id=self.request.user.id)

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        filter = {}

        if self.action == 'retrieve':
            field = self.lookup_fields[1]
            model = Cart
        else:
            field = self.lookup_fields[0]
            model = CartItem

        filter[field] = self.kwargs['pk']

        obj = get_object_or_404(model, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=False)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({
                'public_id': '',
                'items': [],
                'total_qty': 0,
                'total_price': '{:.2f}'.format(0),
            })

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(custom_user__user__id=request.user.id).first()

        # If there is no cart yet, create one
        if not cart:
            user = CustomUser.objects.get(user__id=request.user.id)
            cart = Cart.objects.create(custom_user=user)

        product = Product.objects.get(id=request.data.get('product_id'))
        qty = request.data.get('product_qty')

        item = CartItem.objects.filter(
            cart__public_id=cart.public_id,
            product__id=product.id
        ).first()

        if item:
            item.qty += qty
            item.save()
        else:
            item = CartItem.objects.create(
                cart=cart,
                product=product,
                qty=qty
            )

        # return all cart items
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        try:
            super().update(request, *args, **kwargs)

            # Force to return cart data
            queryset = Cart.objects.get(custom_user__user__id=self.request.user.id)
            serializer = CartSerializer(queryset, context={'request': request}, many=False)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({'error': 'Item does not exist'}, status=404)

    def destroy(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(custom_user__user__id=request.user.id)

            super().destroy(request, *args, **kwargs)

            # Delete whole cart if it is empty and return an empty json
            if not len(cart.items.all()):
                cart.delete()
                return Response({
                    'public_id': '',
                    'items': [],
                    'total_qty': 0,
                    'total_price': '{:.2f}'.format(0),
                })

            queryset = Cart.objects.get(custom_user__user__id=self.request.user.id)
            serializer = CartSerializer(queryset, context={'request': request}, many=False)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({'error': 'Item does not exist'}, status=404)

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart does not exist'}, status=404)
