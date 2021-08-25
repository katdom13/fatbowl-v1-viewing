from core.apps.cart.models import Cart, CartItem, CartItemSpecification
from core.apps.cart.permissions import IsOwnerOrAdmin
from core.apps.cart.serializers import CartItemSerializer, CartSerializer
from core.apps.store.models import Product
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


class CartViewSet(viewsets.ModelViewSet):
    lookup_fields = ('id', 'public_id')
    permission_classes = [IsOwnerOrAdmin]

    def get_serializer_class(self):
        if self.action == 'list' \
            or self.action == 'create' \
                or self.action == 'retrieve':
            return CartSerializer
        elif self.action == 'update' \
                or self.action == 'delete':
            return CartItemSerializer

    def get_queryset(self):
        if self.action == 'list' \
            or self.action == 'create' \
                or self.action == 'retrieve':
            return Cart.objects.get(user__user__id=self.request.user.id)
        elif self.action == 'update' \
                or self.action == 'delete':
            return CartItem.objects.filter(
                cart__user__user__id=self.request.user.id
            )

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

        # Lookup object
        obj = get_object_or_404(model, **filter)
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
                'total_price': '{:.2f}'.format(0)
            })

    def create(self, request, *args, **kwargs):
        cart = Cart.objects.filter(user__user__id=request.user.id).first()

        # If there is no cart yet, create one
        if not cart:
            user = request.user.customuser
            cart = Cart.objects.create(user=user)

        product = Product.objects.filter(id=request.data.get('product_id')).first()
        qty = request.data.get('product_qty')
        specifications = request.data.get('specifications')
        truth_table = []

        if not product:
            return Response({
                'error': 'Product does not exist'
            }, status=404)

        item = CartItem.objects.filter(
            cart__public_id=cart.public_id,
            product_id=product.id
        ).first()

        # If the item exists in the cart AND
        # has the exact same specifications
        # just add the quantity
        # otherwise, create the cart item
        if item:
            for spec in specifications:
                truth_table.append(
                    CartItemSpecification.objects.filter(
                        cart_item=item,
                        specification_id=spec['specification'],
                        value_id=spec['value']
                    ).exists()
                )

            if all(truth_table) and (len(specifications) == len(item.specifications.all())):
                item.qty += qty
                item.save()
            else:
                item = CartItem.objects.create(
                    cart=cart,
                    product=product,
                    qty=qty
                )

                for spec in specifications:
                    CartItemSpecification.objects.create(
                        cart_item=item,
                        specification_id=spec['specification'],
                        value_id=spec['value']
                    )
        else:
            item = CartItem.objects.create(
                cart=cart,
                product=product,
                qty=qty
            )

            # Include selected product specifications
            for spec in specifications:
                CartItemSpecification.objects.create(
                    cart_item=item,
                    specification_id=spec['specification'],
                    value_id=spec['value']
                )

        # Return Cart information
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=False)

        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        try:
            # Do default Cart Item update
            super().update(request, *args, **kwargs)

            # Force to return Cart information
            queryset = Cart.objects.get(user__user__id=request.user.id)
            serializer = CartSerializer(queryset, context={'request': request}, many=False)

            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Item does not exist'
            }, status=404)
        except Cart.DoesNotExist:
            return Response({
                'error': 'Cart does not exist'
            }, status=404)

    def destroy(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(user__user__id=request.user.id)
            super().destroy(request, *args, **kwargs)

            # Delete whole cart if it is empty
            # and return an empty cart
            if not len(cart.items.all()):
                cart.delete()
                return Response({
                    'public_id': '',
                    'items': [],
                    'total_qty': 0,
                    'total_price': '{:.2f}'.format(0)
                })

            # Force to return Cart information
            queryset = Cart.objects.get(user__user__id=request.user.id)
            serializer = CartSerializer(queryset, context={'request': request}, many=False)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response({
                'error': 'Item does not exist'
            }, status=404)
        except Cart.DoesNotExist:
            return Response({
                'error': 'Cart does not exist'
            }, status=404)

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Cart.DoesNotExist:
            return Response({
                'error': 'Cart does not exist'
            }, status=404)
