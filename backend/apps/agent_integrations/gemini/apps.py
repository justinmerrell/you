from django.apps import AppConfig

class GeminiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.agent_integrations.gemini'
    verbose_name = 'Gemini Integration'
