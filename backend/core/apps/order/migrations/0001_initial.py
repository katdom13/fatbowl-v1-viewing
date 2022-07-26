# Generated by Django 3.2.3 on 2021-08-07 13:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(blank=True, max_length=255, verbose_name='Full name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('address_line_1', models.CharField(blank=True, max_length=150, verbose_name='Address line 2')),
                ('town_city', models.CharField(blank=True, max_length=150, verbose_name='Town/City/State')),
                ('phone_number', models.CharField(blank=True, max_length=15, verbose_name='Phone number')),
                ('postcode', models.CharField(blank=True, max_length=150, verbose_name='Address line 1')),
                ('country_code', models.CharField(blank=True, max_length=4, verbose_name='Country code')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, null=True, verbose_name='Updated at')),
                ('total_paid', models.DecimalField(decimal_places=2, error_messages={'name': {'max_length': 'The price must be between 0 and 9999999.99'}}, help_text='Maximum 9999999.99', max_digits=9, verbose_name='Total paid')),
                ('order_key', models.CharField(max_length=255, verbose_name='Order key')),
                ('payment_option', models.CharField(blank=True, max_length=255, verbose_name='Payment option')),
                ('billing_status', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='account.customuser')),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, error_messages={'name': {'max_length': 'The price must be between 0 and 9999999.99'}}, help_text='Maximum 9999999.99', max_digits=9, verbose_name='Item price')),
                ('qty', models.PositiveBigIntegerField(default=1, verbose_name='Quantity')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='order.order')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store.product')),
            ],
        ),
    ]
