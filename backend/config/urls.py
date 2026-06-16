"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from config.forms import AdminLoginForm

admin.site.login_form = AdminLoginForm

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/inquiries/', include('inquiries.urls')),
]
