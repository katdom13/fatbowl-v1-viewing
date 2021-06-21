from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _
from store.models import Product


class CartManager(models.Manager):
    """
    A customized queryset for a cart
    """
    def get_queryset(self):
        return super(CartManager, self).get_queryset().filter(user=self.request.user)


class Cart(models.Model):
    """
    Cart table for a specific user
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')

    objects = models.Manager()
    contents = CartManager()

    def __str__(self):
        return f"{self.user.username}'s cart"


class CartItem(models.Model):
    """
    CartItem table
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='item')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(
        verbose_name=_('Quantity')
    )
