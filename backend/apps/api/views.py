from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.thoughts.models import Thought
from .serializers import ThoughtSerializer
from rest_framework.permissions import IsAuthenticated
from apps.thoughts.services import ThoughtIntrospectionService

class ThoughtViewSet(viewsets.ModelViewSet):
    serializer_class = ThoughtSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return thoughts for the current authenticated user only"""
        return Thought.objects.filter(user=self.request.user).order_by('-created_at')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._introspection_service = ThoughtIntrospectionService()

    def perform_create(self, serializer):
        # Get the original thought text
        thought_text = serializer.validated_data.get('text', '')

        try:
            # Process the thought through the introspection agent
            introspective_version = self._introspection_service.process_thought(thought_text)

            # Save both the original and introspective versions
            serializer.save(
                user=self.request.user,
                introspective_version=introspective_version
            )
        except Exception as e:
            return Response(
                {"error": "Failed to process thought"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_update(self, serializer):
        if 'text' in serializer.validated_data:
            thought_text = serializer.validated_data['text']
            try:
                introspective_version = self._introspection_service.process_thought(thought_text)
                serializer.save(introspective_version=introspective_version)
            except Exception as e:
                return Response(
                    {"error": "Failed to process thought"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            serializer.save()
