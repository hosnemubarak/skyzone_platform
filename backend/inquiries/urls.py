from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InquiryCreateView, InquiryViewSet

router = DefaultRouter()
router.register(r'manage', InquiryViewSet, basename='manage')

urlpatterns = [
    path('submit/', InquiryCreateView.as_view(), name='inquiry-submit'),
    path('', include(router.urls)),
]
