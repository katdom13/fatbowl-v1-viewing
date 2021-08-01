from django.urls import include, path

from . import views

app_name = 'checkout'

urlpatterns = [
    path('delivery_options/', views.DeliveryOptionListView.as_view(), name='delivery_options'),
]
