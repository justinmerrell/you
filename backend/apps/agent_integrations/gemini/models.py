from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class GeminiIntegration(models.Model):
    """Model to store Gemini integration settings for a user"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='gemini_integration'
    )
    api_key = models.CharField(max_length=512)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Gemini Integration")
        verbose_name_plural = _("Gemini Integrations")

    def __str__(self):
        return f"Gemini Integration for {self.user.email}"

class GeminiConfig(models.Model):
    """Model to store Gemini configuration settings"""
    integration = models.OneToOneField(
        GeminiIntegration,
        on_delete=models.CASCADE,
        related_name='config'
    )
    model_preference = models.CharField(
        max_length=50,
        default='gemini-pro',
        choices=[
            ('gemini-pro', 'Gemini Pro'),
            ('gemini-pro-vision', 'Gemini Pro Vision'),
        ]
    )
    temperature = models.FloatField(default=0.7)
    max_output_tokens = models.IntegerField(default=2048)
    top_p = models.FloatField(default=0.95)
    top_k = models.IntegerField(default=40)

    class Meta:
        verbose_name = _("Gemini Configuration")
        verbose_name_plural = _("Gemini Configurations")

    def __str__(self):
        return f"Gemini Config for {self.integration.user.email}"
