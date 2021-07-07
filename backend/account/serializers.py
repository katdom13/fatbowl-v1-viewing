from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    # Hash password on create
    def create(self, validated_data):
        return User.objects.create(
            password=make_password(validated_data.pop('password')),
            **validated_data
        )

    # Hash password on update
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if 'password' in validated_data:
            instance.password = make_password(validated_data['password'])
        instance.save()
        return instance

    # Validate email to be unique
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            if self.instance and self.instance.email == value:
                return value

            raise serializers.ValidationError('This email is already registered')
        return value

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
