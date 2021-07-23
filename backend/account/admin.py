from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Address, CustomUser

# Unregister default User admin
admin.site.unregister(User)


class AddressInline(admin.StackedInline):
    model = Address
    extra = 1


class CustomUserInline(admin.StackedInline):
    model = CustomUser
    extra = 1
    show_change_link = True


@admin.register(User)
class UserAdmin(UserAdmin):
    inlines = (CustomUserInline, )


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    inlines = (AddressInline,)
