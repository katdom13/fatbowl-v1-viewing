import uuid

from core.apps.account.models import CustomUser
from core.apps.store.models import Product
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
            sum(item.price() for item in self.items.all())
        )


class CartItem(models.Model):
    """
    This table contains information about a single item
    in a cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.PositiveBigIntegerField(default=1, verbose_name=_('Quantity'))

    # Get the price of item multiplied with quantity
    def price(self):
        return self.product.regular_price * self.qty
