from django.db import models
from django.conf import settings

class Thought(models.Model):
    """Model to store user thoughts"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='thoughts'
    )
    text = models.TextField()
    introspective_version = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'thoughts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s thought: {self.text[:50]}..."
