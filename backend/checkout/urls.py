from django.urls import path

from . import views

app_name = 'checkout'

urlpatterns = [
    path('delivery_options/', views.DeliveryOptionListView.as_view(), name='delivery_options'),
    path('payment/', views.Payment.as_view(), name='paypal-payment')
]
