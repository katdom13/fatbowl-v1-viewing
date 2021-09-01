from core.apps.store.serializers import ProductSerializer
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers

from .models import Address, CustomUser
from .tokens import account_activation_token


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(source='user.password')
    wishlist = ProductSerializer(read_only=True, many=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'password',
            'wishlist',
        ]

    def create(self, validated_data):

        url = settings.env('FRONTEND_BASEURL') if settings.FROM_DOCKER else 'http://localhost:3000/'
        url += 'account/activate/{uidb64}/{token}'

        user_data = validated_data.pop('user')

        # Hash password on create
        user = User.objects.create(
            password=make_password(user_data.pop('password')),
            **user_data
        )

        # Make the user initially inactive by default
        user.is_active = False
        user.save()

        # Send registration email
        user.email_user(
            subject='Activate your Account',
            message=render_to_string('account/registration/account_activation_email.html', {
                'user': user,
                'url': url.format(
                    uidb64=urlsafe_base64_encode(force_bytes(user.pk)),
                    token=account_activation_token.make_token(user)
                )
            })
        )

        return CustomUser.objects.create(
            user=user,
            **validated_data
        )

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        instance = super().update(instance, validated_data)
        request = self.context.get('request')

        if 'password' in user_data:
            instance.user.password = make_password(user_data['password'])

        # Email and username
        instance.user.email = user_data.get('email')
        instance.user.username = user_data.get('username')

        instance.user.save()
        instance.save()

        update_session_auth_hash(request, instance.user)

        return instance

    # Validate username to be unique
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            # If the current instance/object has the same username, it is in edit mode
            if self.instance and self.instance.user and self.instance.user.username == value:
                return value

            raise serializers.ValidationError('A user with that username already exists.')

        return value

    # Validate email to be unique
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            # If the current instance/object has the same username, it is in edit mode
            if self.instance and self.instance.user and self.instance.user.email == value:
                return value

            raise serializers.ValidationError('This email is already registered.')

        return value


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'public_id',
            'user',
            'phone_number',
            'address_line_1',
            'address_line_2',
            'town_city',
            'postcode',
            'is_default',
        ]
    read_only_fields = ['public_id', ]
