from .models import Vote, Tag, Article

def votes_nbr(article_id):
    """
    Retourne le nombre de votes positifs (upvotes) et négatifs (downvotes) pour un article donne.
    """
    votes = Vote.objects.filter(article=article_id) 
    upvotes = votes.filter(vote_type='upvote').count() 
    downvotes = votes.filter(vote_type='downvote').count()
    return upvotes, downvotes

def related_articles_to_tag(tag_name):
    try:
        nbr = Article.objects.filter(tags__name__iexact=tag_name).count()
        return nbr
    except Tag.DoesNotExist:
        return None