from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from .manager import UserManager

class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractBaseUser, BaseModel):
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    # nickname = models.CharField(max_length=50, unique=True)
    fullname = models.CharField(max_length=255)
    #la definition du champ password n'est pas necessaire car faite par defaut par django

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
  
    REQUIRED_FIELDS = ['fullname']

    def __str__(self):
        return self.email
    
    def has_module_perms(self, obj=None):
        return self.is_staff
    
    def has_perm(self, perm, obj=None):
        return True
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    # address = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user}'
    
class Tag(models.Model):
    name = models.CharField(max_length=150, primary_key=True)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Vote(models.Model):
    VOTE_CHOICES = [
        ('Upvote', 'upvote'),
        ('Downvote', 'downvote')
    ]

    author = models.ForeignKey('User', related_name='votes', on_delete=models.CASCADE)
    article = models.ForeignKey('Article', on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=8, choices=VOTE_CHOICES)

    class Meta:
        unique_together = ['author', 'article']

    def __str__(self):
        return f"{self.author.user.fullname} vote to article {self.article}"

class Article(BaseModel):
    author = models.ForeignKey(User, related_name='articles', on_delete=models.CASCADE, limit_choices_to=models.Q(is_superuser=True))
    title = models.CharField(max_length=150)
    content = models.TextField()
    image = models.ImageField(upload_to='articles/', blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-updated_at']
    def __str__(self):
        return f"{self.title} edited by {self.author.user.email}"
 
#pour la creation d un profile auto associe un new user
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
