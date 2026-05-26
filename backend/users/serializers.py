from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': ['Passwords do not match']}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    """Custom login serializer that includes user data."""

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except DjangoValidationError as e:
            if hasattr(e, 'error_dict'):
                raise serializers.ValidationError(e.error_dict)
            raise serializers.ValidationError({'non_field_errors': [str(e)]})

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class LogoutSerializer(serializers.Serializer):
    """Serializer for logout with refresh token."""
    refresh = serializers.CharField(write_only=True)

    def validate(self, attrs):
        self.refresh_token = attrs['refresh']
        return attrs
