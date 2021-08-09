from rest_framework import permissions

from .models import Cart, CartItem


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Cart):
            return request.user.is_staff or (obj.user.user.id == request.user.id)
        elif isinstance(obj, CartItem):
            return request.user.is_staff or (obj.cart.user.user.id == request.user.id)

        return super().has_object_permission(request, view, obj)
