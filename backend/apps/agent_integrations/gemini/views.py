from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from .models import GeminiIntegration
from .serializers import GeminiIntegrationSerializer, GeminiConfigSerializer

class GeminiViewSet(viewsets.ModelViewSet):
    serializer_class = GeminiIntegrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GeminiIntegration.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'put'])
    def config(self, request):
        """Get or update Gemini configuration"""
        try:
            integration = GeminiIntegration.objects.get(user=request.user)

            if request.method == 'GET':
                return Response({
                    'is_connected': integration.is_active,
                    'api_key': integration.api_key if integration.is_active else None
                })

            # Handle PUT request
            api_key = request.data.get('api_key')
            if not api_key:
                return Response(
                    {'error': 'API key is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            integration.api_key = api_key
            integration.is_active = True
            integration.save()

            return Response({
                'is_connected': True,
                'message': 'Gemini API key updated successfully'
            })

        except GeminiIntegration.DoesNotExist:
            if request.method == 'GET':
                return Response({
                    'is_connected': False,
                    'api_key': None
                })

            # Create new integration with API key
            integration = GeminiIntegration.objects.create(
                user=request.user,
                api_key=request.data.get('api_key'),
                is_active=True
            )

            return Response({
                'is_connected': True,
                'message': 'Gemini API key configured successfully'
            })

    @action(detail=False, methods=['post'])
    def disconnect(self, request):
        """Disconnect Gemini integration"""
        try:
            integration = GeminiIntegration.objects.get(user=request.user)
            integration.is_active = False
            integration.api_key = ''  # Clear the API key
            integration.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except GeminiIntegration.DoesNotExist:
            return Response(
                {'error': 'No active Gemini integration found'},
                status=status.HTTP_404_NOT_FOUND
            )
