import uuid
from decimal import Decimal

from core.apps.account.models import CustomUser
from core.apps.store.models import (
    Product,
    ProductSpecification,
    ProductSpecificationValue,
)
from django.db import models
from django.utils.translation import gettext_lazy as _


class Cart(models.Model):
    """
    This table contains the cart information
    """
    public_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='cart'
    )

    def __str__(self):
        return f'{self.user.user.username}\'s cart'

    # Get total quantity of products in cart
    @property
    def total_qty(self):
        return sum(item.qty for item in self.items.all())

    # Get the total price of products in cart
    @property
    def total_price(self):
        return '{:.2f}'.format(
            sum(float(item.price) for item in self.items.all())
        )


class CartItem(models.Model):
    """
    This table contains information about a single item
    in a cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveBigIntegerField(default=1, verbose_name=_('Quantity'))

    # Get the price of item plus additional price multiplied with quantity
    @property
    def price(self):
        additional_price = Decimal(0.00)

        for specification in self.specifications.all():
            additional_price += specification.value.additional_price

        total = (self.product.regular_price + additional_price) * self.qty

        return '{:.2f}'.format(total)


class CartItemSpecification(models.Model):
    """
    This table contains nested information about a single item
    """
    cart_item = models.ForeignKey(CartItem, on_delete=models.CASCADE, related_name='specifications')
    specification = models.ForeignKey(ProductSpecification, on_delete=models.CASCADE)
    value = models.ForeignKey(ProductSpecificationValue, on_delete=models.CASCADE)
