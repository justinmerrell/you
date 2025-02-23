from rest_framework import serializers
from apps.thoughts.models import Thought

class ThoughtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thought
        fields = ['id', 'text', 'introspective_version', 'created_at', 'updated_at', 'user']
        read_only_fields = ['introspective_version', 'user', 'created_at', 'updated_at']
