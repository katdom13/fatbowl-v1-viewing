import uuid

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(models.Model):
    """
    Model class to extend the defualt User model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    about = models.TextField(
        verbose_name=_('About'),
        max_length=500,
        blank=True
    )

    # Status
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

    def email_user(self, subject, message):
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [self.user.email],
            fail_silently=False
        )

    def __str__(self):
        return self.user.username


class Address(models.Model):
    """
    Table for delivery details
    """

    # Implement public ids for sensitive data
    # that cannot be used on frontend public urls
    public_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        CustomUser,
        verbose_name=_('Custom user'),
        on_delete=models.CASCADE
    )
    phone_number = models.CharField(verbose_name=_('Phone number'), max_length=15, blank=True)
    postcode = models.CharField(verbose_name=_('Postal code'), max_length=12, blank=True)
    address_line_1 = models.CharField(verbose_name=_('Address line 1'), max_length=150, blank=True)
    address_line_2 = models.CharField(verbose_name=_('Address line 2'), max_length=150, blank=True)
    town_city = models.CharField(verbose_name=_('Town/City/State'), max_length=150, blank=True)
    delivery_instructions = models.CharField(
        verbose_name=_('Delivery instructions'),
        max_length=255,
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
    is_default = models.BooleanField(
        verbose_name=_('Default address'),
        help_text=_('Change default address'),
        default=False
    )

    class Meta:
        verbose_name = _('Address')
        verbose_name_plural = _('Addresses')

    def __str__(self):
        return str(self.public_id)
