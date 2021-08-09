from rest_framework import permissions

from .models import Product


class IsWishlistOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object
    to interact with it
    """
    # Override
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Product):
            return request.users_wishlist.filter(user_id=request.user.id)
