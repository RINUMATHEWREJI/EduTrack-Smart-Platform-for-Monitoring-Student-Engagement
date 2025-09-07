from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from .models import Course,CourseMaterial
from .serializers import (
    CourseSerializer,CourseMaterialSerializer
)

class CourseListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses,many=True)
        return Response(serializer.data)
    def post(self,request):
        if not hasattr(request.user, "teacher_profile"):
            raise PermissionDenied("Only teachers can create courses.")
        serializer = CourseSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(owner = request.user.teacher_profile)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
# class CourseDetailView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self,pk):
#         return get_object_or_404(Course,pk=pk)
    
#     def get(self,request,pk):
#         course = self.get_object(pk)
#         serializer = CourseSerializer(course)
#         return Response(serializer.data)
#     def patch(self,request,pk):

#         course = self.get_object(pk)
#         if request.user.teacher_profile != course.owner:
#             raise PermissionDenied("Not your course!")
#         serializer = CourseSerializer(course, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         course = self.get_object(pk)
#         if request.user.teacher_profile != course.owner:
#             raise PermissionDenied("Not your course!")
#         course.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)




# Materials
class CourseMaterialCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        if course.owner != request.user.teacher_profile:
            raise PermissionDenied("Not your course!")
        materials = course.materials.all()
        serializer = CourseMaterialSerializer(materials, many=True)
        return Response(serializer.data)

    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        if course.owner != request.user.teacher_profile:
            raise PermissionDenied("Not your course!")
        serializer = CourseMaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(course=course)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




   
# courses/views.py
class MyCoursesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "teacher_profile"):
            raise PermissionDenied("Only teachers can view their own courses.")

        courses = request.user.teacher_profile.courses.all()  # reverse relation
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)



# views.py
class CourseDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Course, pk=pk)

    def get(self, request, pk):
        course = self.get_object(pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
    
class CourseMaterialDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, course_id, material_id):
        course = get_object_or_404(Course, id=course_id)

        # check ownership
        if course.owner != request.user.teacher_profile:
            raise PermissionDenied("Not your course!")

        material = get_object_or_404(CourseMaterial, id=material_id, course=course)
        material.delete()
        return Response({"detail": "Material deleted"}, status=status.HTTP_204_NO_CONTENT)
    
