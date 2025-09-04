from rest_framework import serializers
from .models import AttentionSession, AttentionRecord

class AttentionSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttentionSession
        fields = ["id", "student", "material", "started_at", "ended_at", "duration_seconds"]
        read_only_fields = ["id", "student", "material", "started_at", "ended_at", "duration_seconds"]


class AttentionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttentionRecord
        fields = ["id", "session", "material", "student", "timestamp", "attentive", "confidence"]
        read_only_fields = ["id", "material", "student", "timestamp"]
