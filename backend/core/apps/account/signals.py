from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import CustomUser


# The API already handles user creation via frontend
# but not the createsuperuser command
@receiver(post_save, sender=User)
def create_custom_user(sender, instance, created, **kwargs):
    if created and instance.is_staff == 1:
        CustomUser.objects.create(user=instance)


# Delete user from the default User table after deleting
# from the extension table
@receiver(post_delete, sender=CustomUser)
def delete_user(sender, instance, **kwargs):
    instance.user.delete()
