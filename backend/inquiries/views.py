from rest_framework import generics, permissions, viewsets
from .models import Inquiry
from .serializers import InquirySerializer

class InquiryCreateView(generics.CreateAPIView):
    """
    API endpoint for public form submissions.
    Allows anyone to POST an inquiry.
    """
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.AllowAny]

class InquiryViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet for managing inquiries.
    Requires authentication and staff privileges.
    """
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.AllowAny]
