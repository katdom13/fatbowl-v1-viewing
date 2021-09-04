from django.urls import path
from django.urls.conf import include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = 'account'

# Create a detault router to register the user crud viewset
user_router = DefaultRouter()
user_router.register(r'users', views.UserViewSet, basename='user')

# Create a default router to register the address crud viewset
address_router = DefaultRouter()
address_router.register(r'address', views.AddressViewSet, basename='address')

# Create

urlpatterns = [
    # User crud
    path('', include(user_router.urls)),

    # Address crud
    path('', include(address_router.urls)),

    # Authentication
    path('csrf/', views.CSRFView.as_view(), name='csrf'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
    path(
        'activate/<slug:uidb64>/<slug:token>/',
        views.UserActivationView.as_view(),
        name='activate'
    ),

    # JWT Authentication
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Password reset
    path('password_reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path(
        'password_reset_confirm/<slug:uidb64>/<slug:token>/',
        views.PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'
    ),

    # Wishlist
    path('wishlist/', views.WishListView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', views.WishListDetailView.as_view(), name='wishlist-item'),

    # Orders
    path('orders/', views.OrderListView.as_view(), name='orders'),
]
