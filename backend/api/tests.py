from django.test import TestCase

# Create your tests here.
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Article, Tag

def test_create_article_with_image():
    # Créez un tag pour l'article
    tag = Tag.objects.create(name='Technologie')

    # Créez un fichier image simulé
    image = SimpleUploadedFile(
        name='test_image.jpg',
        content=b'fake image content',
        content_type='image/jpeg'
    )

    # Créez un client API
    client = APIClient()

    # Données de l'article avec l'image
    data = {
        'title': 'Nouvel Article',
        'content': 'Contenu de l\'article',
        'image': image,
        'tags': [tag.id]
    }

    # Effectuez la requête POST
    response = client.post('/articles/', data, format='multipart')

    # Vérifiez la réponse
    assert response.status_code == 201
    assert 'image' in response.data
