from django.contrib import admin

from .models import (
    Category,
    Product,
    ProductImage,
    ProductSpecification,
    ProductSpecificationValue,
)


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(admin.ModelAdmin):
    list_display = ('product', 'name')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {
        'slug': ('name', )
    }


class ProductImageInline(admin.TabularInline):
    model = ProductImage


class ProductSpecificationValueInline(admin.TabularInline):
    model = ProductSpecificationValue

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        field = super(ProductSpecificationValueInline, self).formfield_for_foreignkey(
            db_field,
            request,
            **kwargs
        )

        if db_field.name == 'specification':
            parent_id = request.resolver_match.kwargs.get('object_id')
            field.queryset = field.queryset.filter(product=parent_id)

        return field


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline, ProductSpecificationValueInline]
    prepopulated_fields = {
        'slug': ('title', )
    }
