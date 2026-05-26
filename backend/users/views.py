from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, LogoutSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """Login and return JWT tokens."""
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]


class RefreshView(TokenRefreshView):
    """Refresh access token using refresh token."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response


class LogoutView(generics.CreateAPIView):
    """Logout and blacklist refresh token."""
    serializer_class = LogoutSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            refresh_token = RefreshToken(serializer.validated_data['refresh'])
            refresh_token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': ['Invalid token']},
                status=status.HTTP_400_BAD_REQUEST
            )


class MeView(generics.RetrieveAPIView):
    """Get current authenticated user profile."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
