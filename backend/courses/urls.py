from django.urls import path
from .views import (
    CourseListCreateView, CourseDetailView,
    CourseMaterialCreateView,
    MyCoursesView,
    CourseMaterialDetailView)


urlpatterns = [
    path("courses/", CourseListCreateView.as_view(), name="course-list-create"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),


    path("me/courses/", MyCoursesView.as_view(), name="my-courses"),



    path("courses/<int:course_id>/materials/", CourseMaterialCreateView.as_view(), name="course-materials"),
    path("courses/<int:course_id>/materials/<int:material_id>/", CourseMaterialDetailView.as_view(), name="course-material-detail"),



]