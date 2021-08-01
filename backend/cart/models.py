import uuid

from account.models import CustomUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from store.models import Product


class CartManager(models.Manager):
    """
    A customized queryset for a cart
    """
    def get_queryset(self):
        return super(CartManager, self).get_queryset().filter(custom_user__user=self.request.user)


class Cart(models.Model):
    """
    Contains cart information
    """
    public_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    custom_user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='cart')

    objects = models.Manager()
    contents = CartManager()

    def __str__(self):
        return f'{self.custom_user.user.username}\'s cart'

    # Get total qty of products in cart
    @property
    def total_qty(self):
        return sum(item.qty for item in self.items.all())

    # Get total amount of products in cart
    @property
    def total_price(self):
        return '{:.2f}'.format(
            sum(item.product.regular_price * item.qty for item in self.items.all())
        )


class CartItem(models.Model):
    """
    Information about individual items in cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(
        verbose_name=_('Quantity')
    )

    # Get price of item multiplied with quantity
    def price(self):
        return self.product.regular_price * self.qty
