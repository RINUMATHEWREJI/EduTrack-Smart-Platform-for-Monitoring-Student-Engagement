from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    RegisterTeacherSerializer,RegisterStudentSerializer,
    TeacherProfileSerializer,StudentProfileSerializer,
    ChangePasswordSerializer
)

User = get_user_model()

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self,request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request,email=email,password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "user":UserSerializer(user).data,
                "refresh":str(refresh),
                "access":str(refresh.access_token),
            },status=status.HTTP_200_OK)

        else:
            return Response({"detail":"invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()   # invalidate refresh token
            return Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterTeacherView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request):
        serializer = RegisterTeacherSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterStudentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self,request):
        serializer = RegisterStudentSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class TeacherProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        serializer = TeacherProfileSerializer(request.user.teacher_profile)
        return Response(serializer.data)
    def patch(self,request):
        serializer = TeacherProfileSerializer(request.user.teacher_profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        serializer = StudentProfileSerializer(request.user.student_profile)
        return Response(serializer.data)
    def patch(self,request):
        serializer = StudentProfileSerializer(request.user.student_profile,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self,request):
        serializer = ChangePasswordSerializer(request.user,data = request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"details":"password updated succesfully"})
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)