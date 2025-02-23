from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Custom user model for the application"""
    # Add any additional fields here if needed
    pass

    class Meta:
        db_table = 'custom_users'
