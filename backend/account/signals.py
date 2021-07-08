from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import CustomUser


# The api already handles ordinary users but not the createsuperuser command
@receiver(post_save, sender=User)
def create_custom_user(sender, instance, created, **kwargs):
    if created and instance.is_staff == 1:
        CustomUser.objects.create(user=instance)


@receiver(post_delete, sender=CustomUser)
def delete_user(sender, instance, **kwargs):
    instance.user.delete()
