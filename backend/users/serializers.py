from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TeacherProfile,StudentProfile
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id",'email','role']


class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = TeacherProfile
        fields = ["id","user","name","bio","department","avatar","gender","phone"]

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = StudentProfile
        fields = ["id","user","name","department","avatar","gender","phone"]

class RegisterTeacherSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email","password"]
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self,validated_data):
        user = User(
            email = validated_data["email"],
            role = User.Roles.TEACHER,
            is_active = True

        )
        user.set_password(validated_data["password"])
        user.save(creator=self.context["request"].user)
        return user

class RegisterStudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email","password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self,validated_data):
        user = User(
            email = validated_data["email"],
            role = User.Roles.STUDENT,
            is_active = True

        )
        user.set_password(validated_data["password"])
        user.save(creator=self.context["request"].user)
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        # Use Django's built-in validators (strong password rules)
        validate_password(value)
        return value

    def validate(self, data):
        user = self.context["request"].user
        if not user.check_password(data["old_password"]):
            raise serializers.ValidationError({"old_password": "Old password is incorrect"})
        return data

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user