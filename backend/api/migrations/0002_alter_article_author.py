# Generated by Django 5.1.6 on 2025-02-20 12:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='author',
            field=models.ForeignKey(limit_choices_to={'author.user.is_supperuser': True}, on_delete=django.db.models.deletion.CASCADE, related_name='articles', to='api.profile'),
        ),
    ]
