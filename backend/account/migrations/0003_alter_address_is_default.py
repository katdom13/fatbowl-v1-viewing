# Generated by Django 3.2.3 on 2021-07-20 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20210720_1838'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='is_default',
            field=models.BooleanField(default=False, help_text='Change default address', verbose_name='Default address'),
        ),
    ]
