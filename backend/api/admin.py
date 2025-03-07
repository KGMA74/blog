from django.contrib import admin
from .models import User, Tag, Article, Profile

# Register your models here.
admin.site.register([
    User,
    Tag,
    Article,
    Profile
])