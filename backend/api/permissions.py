from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée qui permet uniquement aux utilisateurs administrateurs
    de créer ou de supprimer des objets. Les autres utilisateurs ont un accès en lecture seule.
    """

    def has_permission(self, request, view):
        # Si la méthode est en lecture seule, tout le monde peut y accéder
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_superuser
