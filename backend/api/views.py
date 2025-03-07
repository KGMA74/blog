from .serializers import (
    ProfileSerializer, ArticleSerializer, TagSerializer
    )
from .utils import votes_nbr, related_articles_to_tag
from datetime import datetime
from .models import Profile, Tag, Article, Vote
from .permissions import IsAdminUserOrReadOnly
from django.conf import settings 
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, action, permission_classes
from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                domain=settings.AUTH_COOKIE_DOMAIN
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                domain=settings.AUTH_COOKIE_DOMAIN
            )

        return response
    
#customisation de la class TokenObtainPairView pour que les tokens passes par les cookies et non les headers donc plus securise
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
        #un cookie pour le access token
        response.set_cookie(
            'access',
            access_token,
            max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            domain=settings.AUTH_COOKIE_DOMAIN
        )
        
        #un cookie pour le refresh token
        response.set_cookie(
            'refresh',
            refresh_token,
            max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            domain=settings.AUTH_COOKIE_DOMAIN
        )
            
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs) :
        refresh_token = request.COOKIES.get('refresh')
        
        if refresh_token:
            #si le token refresh dans le la list des cookies
            request.data['refresh'] = refresh_token
            
        response =  super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            print("Access token:", access_token)
            
            #on met a jour le access token
            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                path=settings.AUTH_COOKIE_PATH,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                domain=settings.AUTH_COOKIE_DOMAIN
            )
            
        return response
    

class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')
        
        if access_token:
            request.data['token'] = access_token
            
        return super().post(request, *args, **kwargs)
    

    
@api_view(['POST'])
def LogoutView(request):
    if request.method == 'POST':
        # Supprimer les tokens en mettant leur valeur des cookies à ''
        response = Response(status=status.HTTP_204_NO_CONTENT)
        
        response.set_cookie(
            'refresh',
            value='',
            max_age=0,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            domain=settings.AUTH_COOKIE_DOMAIN 
        )
        
        response.set_cookie(
            'access',
            value='',
            max_age=0,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            path=settings.AUTH_COOKIE_PATH,
            samesite=settings.AUTH_COOKIE_SAMESITE,
            domain=settings.AUTH_COOKIE_DOMAIN
        )

        # Ajouter les tokens à la liste de blackliste

        refresh_token = request.data.get('refresh', None)
        access_token = request.data.get('access', None)
        
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            pass

        return response
    
    return Response("", status=status.HTTP_405_METHOD_NOT_ALLOWED)


class TagViewSet(viewsets.ModelViewSet):
    """
    Vue pour gérer les tags.
    Seuls les administrateurs peuvent créer ou supprimer des tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminUserOrReadOnly]

import logging
logger = logging.getLogger(__name__)
class ArticleViewSet(viewsets.ModelViewSet):
    """
    Vue pour gérer les articles.
    Seuls les administrateurs peuvent créer ou supprimer des articles.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        """Ajoute automatiquement l'auteur de l'article"""
        serializer.save(author=self.request.user)

    def retrieve(self, request, pk=None):
        try:
            article = self.get_object()

            #veriefier si l'utilisateur a deja vu recemment
            last_viewed = request.session.get(f'viewed_{pk}')
            now = datetime.now().timestamp()

            if not last_viewed or now - last_viewed > 36000 * 24: # 1j d'attente entre 2 comptages
                article.views += 1
                article.save()
                request.session[f'viewed_{pk}'] = now 
        except:
            pass
            
        return super().retrieve(request, pk)



@api_view(['GET'])
@permission_classes([AllowAny])
def searchView(request):
    query = request.GET.get('q', '').strip()  # Récupérer la requête texte
    tags = request.GET.getlist('tags')  # Récupérer la liste de tags (ex: ?tags=python&tags=django)

    try:
        # Filtrer par titre ou contenu si une requête est fournie
        filter_conditions = Q()
        if query:
            filter_conditions |= Q(title__icontains=query) | Q(content__icontains=query)

        # Filtrer par tags si fournis (OU inclusif)
        if tags:
            tag_filters = Q()
            for tag in tags:
                tag_filters |= Q(tags__name__icontains=tag)  # Recherche stricte des tags
            
            filter_conditions &= tag_filters  # Appliquer les deux conditions
            print("search; if tags")

        # Récupérer les articles filtrés
        articles = Article.objects.filter(filter_conditions).distinct()

        article_serializer = ArticleSerializer(articles, many=True, context={"request": request})

        print(article_serializer.data)
        return Response(status=status.HTTP_200_OK, data=article_serializer.data)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def votesView(request, pk):
    if request.method == 'GET':
        upvotes, downvotes = votes_nbr(pk)
        return Response(data={'upvotes': upvotes, 'downvotes': downvotes}, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def performVotesView(request, pk):
    article = get_object_or_404(Article, pk=pk)
    vote_type = request.data.get('vote_type')

    if vote_type not in ['upvote', 'downvote', 'none']:
        return Response({"detail": "Invalid vote type."}, status=status.HTTP_400_BAD_REQUEST)
   

    # Trouver ou créer un vote
    vote, created = Vote.objects.get_or_create(author=request.user, article=article)

    if not created: #le vote existait deja
        if vote_type == 'none':
            vote.delete()
        vote.vote_type = vote_type

    upvotes, downvotes = votes_nbr(pk)
    return Response({'upvotes': upvotes, 'downvotes': downvotes}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def relatedArticlesView(request, pk):
    if request.method == 'GET':
        nbr = related_articles_to_tag(tag_name=pk)
        if not nbr:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(data=nbr, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)



