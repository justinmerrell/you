from django.urls import path
from .views import GeminiViewSet

urlpatterns = [
    path('gemini/auth-url/', GeminiViewSet.as_view({'get': 'auth_url'}), name='gemini-auth-url'),
    path('gemini/config/', GeminiViewSet.as_view({'get': 'config', 'put': 'config'}), name='gemini-config'),
    path('gemini/disconnect/', GeminiViewSet.as_view({'post': 'disconnect'}), name='gemini-disconnect'),
    path('gemini/callback/', GeminiViewSet.as_view({'get': 'callback'}), name='gemini-callback'),
]
