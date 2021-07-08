from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers

from account.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(source='user.password')

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'phone_number']

    # Hash password on create
    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user = User.objects.create(
            password=make_password(user_data.pop('password')),
            **user_data
        )

        return CustomUser.objects.create(
            user=user,
            **validated_data
        )

    # Hash password on update
    def update(self, instance, validated_data):
        # print('[CUSTOM USER SERIALIZER INSTANCE]', instance.user.email, type(instance), validated_data)

        user_data = validated_data.pop('user')
        instance = super().update(instance, validated_data)

        if 'password' in user_data:
            instance.user.password = make_password(user_data['password'])

        instance.user.save()
        instance.save()

        return instance

    # Validate username to be unique
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            if self.instance and self.instance.user and self.instance.user.username == value:
                return value

            raise serializers.ValidationError('A user with that username already exists.')
        return value

    # Validate email to be unique
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            if self.instance and self.instance.user and self.instance.user.email == value:
                return value

            raise serializers.ValidationError('This email is already registered')
        return value

# class UserSerializer(serializers.ModelSerializer):
#     # Hash password on create
#     def create(self, validated_data):
#         return User.objects.create(
#             password=make_password(validated_data.pop('password')),
#             **validated_data
#         )

#     # Hash password on update
#     def update(self, instance, validated_data):
#         instance = super().update(instance, validated_data)
#         if 'password' in validated_data:
#             instance.password = make_password(validated_data['password'])
#         instance.save()
#         return instance

#     # Validate email to be unique
#     def validate_email(self, value):
#         if User.objects.filter(email=value).exists():
#             if self.instance and self.instance.email == value:
#                 return value

#             raise serializers.ValidationError('This email is already registered')
#         return value

#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password']
