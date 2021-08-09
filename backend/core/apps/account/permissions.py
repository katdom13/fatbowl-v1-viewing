from rest_framework import permissions


class IsAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user.id == request.user.id


class IsAccountOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or (obj.user.id == request.user.id)


class IsAddressOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user.user.id == request.user.id


class IsAddressOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or (obj.user.user.id == request.user.id)


class IsWishlistOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.users_wishlist.filter(user_id=request.user.id).first()


class IsOrderOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or (obj.user.user.id == request.user.id)
