from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import (
    Category,
    Product,
    ProductImage,
    ProductSpecification,
    ProductSpecificationValue,
)


@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {
        'slug': ('name', )
    }


class ProductSpecificationValueInline(admin.StackedInline):
    model = ProductSpecificationValue
    extra = 1


class ProductSpecificationInline(admin.StackedInline):
    model = ProductSpecification
    extra = 1
    show_change_link = True


class ProductImageinline(admin.TabularInline):
    model = ProductImage


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageinline, ProductSpecificationInline]
    prepopulated_fields = {
        'slug': ('title', )
    }


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'product')
    inlines = (ProductSpecificationValueInline, )
