from rest_framework import serializers
from .models import Course, CourseMaterial




class CourseMaterialSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=True)
    
    class Meta:
        model = CourseMaterial
        fields = "__all__"
        read_only_fields = ["course"]

class CourseSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.name", read_only=True)
    materials = CourseMaterialSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ["owner","created_at","updated_at"]
