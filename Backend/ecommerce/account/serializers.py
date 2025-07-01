from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        email = attrs.get('email')

        # Check if passwords match
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password must be same.")

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists.")

        return attrs

    def create(self, validated_data):
        # Remove password2 from validated_data
        validated_data.pop('password2')

        # Create user with hashed password
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    

class UserLoginSerializers(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    class Meta:
        model = User
        fields = ['email', 'password']

    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        
        user = authenticate(request=self.context.get('request'),email=email , password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        attrs['user'] = user
        return attrs
    


class UserProfileSerializers(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['name', 'email']
