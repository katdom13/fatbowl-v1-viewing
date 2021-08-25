from core.apps.account.models import CustomUser
from core.apps.store.models import (
    Product,
    ProductSpecification,
    ProductSpecificationValue,
)
from django.db import models
from django.utils.translation import gettext_lazy as _


class Order(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    full_name = models.CharField(
        verbose_name=_('Full name'),
        max_length=255,
        blank=True
    )
    email = models.EmailField(
        verbose_name=_('Email'),
        blank=True
    )
    address_line_1 = models.CharField(
        verbose_name=_('Address line 1'),
        max_length=150,
        blank=True
    )
    address_line_2 = models.CharField(
        verbose_name=_('Address line 2'),
        max_length=150,
        blank=True
    )
    town_city = models.CharField(
        verbose_name=_('Town/City/State'),
        max_length=150,
        blank=True
    )
    phone_number = models.CharField(
        verbose_name=_('Phone number'),
        max_length=15,
        blank=True
    )
    postcode = models.CharField(
        verbose_name=_('Address line 1'),
        max_length=150,
        blank=True
    )
    country_code = models.CharField(
        verbose_name=_('Country code'),
        max_length=4,
        blank=True
    )
    created_at = models.DateTimeField(
        verbose_name=_('Created at'),
        auto_now_add=True,
        editable=False
    )
    updated_at = models.DateTimeField(
        verbose_name=_('Updated at'),
        auto_now=True,
        null=True
    )
    total_paid = models.DecimalField(
        verbose_name=_('Total paid'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
    )
    order_key = models.CharField(
        verbose_name=_('Order key'),
        max_length=255
    )
    payment_option = models.CharField(
        verbose_name=_('Payment option'),
        max_length=255,
        blank=True
    )
    billing_status = models.BooleanField(default=False)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return str(self.created_at)


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(
        verbose_name=_('Item price'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
    )
    qty = models.PositiveBigIntegerField(default=1, verbose_name=_('Quantity'))

    def __str__(self):
        return str(self.product.title)


class OrderItemSpecification(models.Model):
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.CASCADE,
        related_name='specifications'
    )
    specification = models.ForeignKey(ProductSpecification, on_delete=models.CASCADE)
    value = models.ForeignKey(ProductSpecificationValue, on_delete=models.CASCADE)
