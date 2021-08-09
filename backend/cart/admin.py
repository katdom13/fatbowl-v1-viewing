from django.contrib import admin

from .models import Cart, CartItem

# admin.site.register(Cart)
# admin.site.register(CartItem)


class CartItemInline(admin.TabularInline):
    model = CartItem
    fields = ['product', 'qty']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemInline]
