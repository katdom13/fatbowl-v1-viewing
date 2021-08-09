from rest_framework import permissions

from .models import Order


class IsOrderOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object
    to interact with it
    """
    # Override
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Order):
            return request.user.is_staff or (obj.user.user.id == request.user.id)
