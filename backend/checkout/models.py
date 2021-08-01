from django.db import models
from django.utils.translation import gettext_lazy as _


class DeliveryOption(models.Model):
    """
    The delivery methods table containing all delivery configurations
    """

    DELIVERY_CHOICES = [
        ('IS', 'In store'),
        ('HD', 'Home delivery'),
        ('DD', 'Digital delivery'),
    ]

    name = models.CharField(
        verbose_name=_('Delivery name'),
        help_text=_('Required'),
        max_length=255,
    )

    price = models.DecimalField(
        verbose_name=_('Delivery price'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
    )

    method = models.CharField(
        choices=DELIVERY_CHOICES,
        verbose_name=_('Delivery method'),
        help_text=_('Required'),
        max_length=255,
    )

    timeframe = models.CharField(
        verbose_name=_('Delivery timeframe'),
        help_text=_('Required'),
        max_length=255,
    )

    window = models.CharField(
        verbose_name=_('Delivery window'),
        help_text=_('Required'),
        max_length=255,
    )

    order = models.IntegerField(
        verbose_name=_('List order'),
        help_text=_('Required'),
        default=0
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Delivery option')
        verbose_name_plural = _('Delivery options')

    def __str__(self):
        return self.name


class PaymentSelection(models.Model):
    """
    Payment options
    """

    name = models.CharField(
        verbose_name=_('Payment option'),
        help_text=_('Required'),
        max_length=255
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = _('Payment option')
        verbose_name_plural = _('Payment options')

    def __str__(self):
        return self.name
