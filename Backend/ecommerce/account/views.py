from django.shortcuts import render
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializers,
    UserProfileSerializers
)
from rest_framework.views import APIView
from .models import User
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings


# Helper to create JWT tokens
def get_token_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh_token': str(refresh),
        'access_token': str(refresh.access_token),
    }



class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_token_user(user)
            response = Response({
                'token': token,
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)

            # Set cookies
            response.set_cookie(
                key='access_token',
                value=token['access_token'],
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=60 * 5  # 5 minutes
            )

            response.set_cookie(
                key='refresh_token',
                value=token['refresh_token'],
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=60 * 60 * 24  # 1 day
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Login View
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializers = UserLoginSerializers(data=request.data)
        if serializers.is_valid(raise_exception=True):
            email = serializers.validated_data.get('email')
            password = serializers.validated_data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                token = get_token_user(user)
                response = Response({
                    "token": token,
                    "message": "User logged in successfully"
                }, status=status.HTTP_200_OK)

                # Set cookies
                response.set_cookie(
                    key='access_token',
                    value=token['access_token'],
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    max_age=60 * 5
                )
                response.set_cookie(
                    key='refresh_token',
                    value=token['refresh_token'],
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    max_age=60 * 60 * 24
                )
                return response

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Logout View
class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {"message": "User logged out successfully"},
            status=status.HTTP_200_OK
        )
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response


# ✅ User Profile View
class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializers(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    