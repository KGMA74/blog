from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView, CustomTokenRefreshView, CustomTokenVerifyView, LogoutView,
    ArticleViewSet, TagViewSet, searchView, votesView, relatedArticlesView, performVotesView
)


router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('jwt/create/', CustomTokenObtainPairView.as_view()),
    path('jwt/refresh/', CustomTokenRefreshView.as_view()),
    path('jwt/verify/', CustomTokenVerifyView.as_view()),
    path('logout/', LogoutView),
    path('', include('djoser.urls')),
    path('', include(router.urls)),
    path('article/<str:id>/votes/', votesView),
    path('vote/<str:pk>/', performVotesView),
    path('tags/<str:pk>/articles/', relatedArticlesView),
    path('search/', searchView)
]
