# Generated by Django 5.1.6 on 2025-02-25 06:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_remove_user_nickname_article_views'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='views',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
