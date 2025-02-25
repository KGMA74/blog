from rest_framework import serializers
from djoser.serializers import UserSerializer
from .models import Profile, Tag, Article, User



class ProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer(many=False)
    class Meta:
        model = Profile
        fields = '__all__'

class CustomUserSerializer(UserSerializer):
    profile = ProfileSerializer(read_only=True)
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('is_superuser', 'fullname', 'profile')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name', 'description']


class ArticleSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'image', 'tags', 'author', 'views', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Remplacer les IDs par les objets Tag complets lors du retrieve
        request = self.context.get("request")
        if request and request.method in ["GET"]:
            data["tags"] = TagSerializer(instance.tags.all(), many=True).data
        
        return data
