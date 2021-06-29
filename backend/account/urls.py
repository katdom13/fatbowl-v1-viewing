from django.urls import path

from . import views

app_name = 'account'

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view),
    path('whoami/', views.WhoAmIView.as_view(), name='whoami'),
]
