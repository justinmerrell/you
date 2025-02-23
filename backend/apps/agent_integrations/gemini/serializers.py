from rest_framework import serializers
from .models import GeminiIntegration, GeminiConfig

class GeminiConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeminiConfig
        fields = ['model_preference', 'temperature', 'max_output_tokens', 'top_p', 'top_k']

class GeminiIntegrationSerializer(serializers.ModelSerializer):
    config = GeminiConfigSerializer(required=False)
    api_key = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = GeminiIntegration
        fields = ['id', 'is_active', 'api_key', 'config', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'api_key': {'write_only': True}
        }

    def create(self, validated_data):
        config_data = validated_data.pop('config', None)
        integration = GeminiIntegration.objects.create(**validated_data)

        if config_data:
            GeminiConfig.objects.create(integration=integration, **config_data)
        else:
            GeminiConfig.objects.create(integration=integration)

        return integration

class GeminiAuthSerializer(serializers.Serializer):
    code = serializers.CharField(required=False)
    error = serializers.CharField(required=False)
    state = serializers.CharField(required=False)
