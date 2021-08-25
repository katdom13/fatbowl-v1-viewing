from core.apps.account.models import CustomUser
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """
    Product category table
    """
    name = models.CharField(
        verbose_name=_('Category name'),
        help_text=_('Required and unique'),
        max_length=255,
        unique=True,
    )
    slug = models.SlugField(
        verbose_name=_('Category safe URL'),
        max_length=255,
        unique=True
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    is_active = models.BooleanField(default=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')

    def get_absolute_url(self):
        return reverse('core.apps.store:category_list', args=[self.slug])

    def __str__(self):
        return self.name


class ProductManager(models.Manager):
    """
    A customized queryset for the Product table
    """
    def get_queryset(self):
        return super(ProductManager, self).get_queryset().filter(is_active=True)


class Product(models.Model):
    """
    Product table containing all items
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        related_name='products'
    )
    title = models.CharField(
        verbose_name=_('Title'),
        help_text=_('Required'),
        max_length=255
    )
    description = models.TextField(
        verbose_name=_('Description'),
        help_text=_('Not required'),
        blank=True
    )
    slug = models.SlugField(
        verbose_name=_('Product safe URL'),
        max_length=255,
        unique=True
    )
    regular_price = models.DecimalField(
        verbose_name=_('Regular price'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
    )
    discount_price = models.DecimalField(
        verbose_name=_('Discount price'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
    )
    is_active = models.BooleanField(
        verbose_name=_('Product visibility'),
        help_text=_('Change product visibility'),
        default=True
    )
    created_at = models.DateTimeField(
        verbose_name=_('Created at'),
        auto_now_add=True,
        editable=False
    )
    updated_at = models.DateTimeField(
        verbose_name=_('Updated at'),
        auto_now=True,
        null=True
    )

    objects = models.Manager()
    products = ProductManager()
    users_wishlist = models.ManyToManyField(
        CustomUser,
        related_name='wishlist',
        blank=True
    )

    class Meta:
        ordering = ('-created_at', )
        verbose_name = _('Product')
        verbose_name_plural = _('Product')

    def get_absolute_url(self):
        return reverse('core.apps.store:product_detail', args=[self.slug])

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    """
    Product image table
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='product_image'
    )
    image = models.ImageField(
        verbose_name=_('Image'),
        help_text=_('Upload a product image'),
        upload_to='images/',
        default='images/default.png'
    )
    alt_text = models.CharField(
        verbose_name=_('Alternative text'),
        help_text=_('Please add alternative text'),
        max_length=255,
        null=True,
        blank=True
    )
    is_feature = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        verbose_name=_('Created at'),
        auto_now_add=True,
        editable=False
    )
    updated_at = models.DateTimeField(
        verbose_name=_('Updated at'),
        auto_now=True
    )

    class Meta:
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')


class ProductSpecification(models.Model):
    """
    The Product Specification table
    contains alternate features or specifications for the product
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.RESTRICT,
        related_name='specifications',
    )
    name = models.CharField(
        verbose_name=_('Name'),
        help_text=_('Required'),
        max_length=255
    )

    class Meta:
        verbose_name = _('Product Specification')
        verbose_name_plural = _('Product Specifications')

    def __str__(self):
        return self.name


class ProductSpecificationValue(models.Model):
    """
    The Product Specification Value table holds each of the products'
    individual specification value or features
    """
    specification = models.ForeignKey(
        ProductSpecification,
        on_delete=models.RESTRICT,
        related_name='values'
    )
    value = models.CharField(
        verbose_name=_('Value'),
        help_text=_('Product specification value (255 word max)'),
        max_length=255,
    )
    additional_price = models.DecimalField(
        verbose_name=_('Additional price'),
        help_text=_('Maximum 9999999.99'),
        error_messages={
            'name': {
                'max_length': _('The price must be between 0 and 9999999.99'),
            },
        },
        max_digits=9,
        decimal_places=2,
        default=0
    )

    class Meta:
        verbose_name = _('Product Specification Value')
        verbose_name_plural = _('Product Specification Values')

    def __str__(self):
        return self.value
