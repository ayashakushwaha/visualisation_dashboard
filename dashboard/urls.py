from django.urls import path
from dashboard import views

urlpatterns = [
    path('', views.home),
    path('data/', views.data)
]