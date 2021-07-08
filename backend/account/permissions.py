from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to interact with it
    """
    # Override
    def has_object_permission(self, request, view, obj):
        print('[PERMISSION OBJECT]', obj.__dict__, 'AAAA', obj)
        return obj.user == request.user


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission to only allow admins or owners of an object to interact with it
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or (obj.user == request.user)
