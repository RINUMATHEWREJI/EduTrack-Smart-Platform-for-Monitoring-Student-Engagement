from django.urls import path
from .views import (
    CourseListCreateView, CourseDetailView,
    CourseMaterialCreateView,
    EnrollView, MyEnrollmentsView,
    MyCoursesView,CourseEnrollmentsView,
    CourseMaterialDetailView)


urlpatterns = [
    path("courses/", CourseListCreateView.as_view(), name="course-list-create"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    path("courses/<int:course_id>/enroll/", EnrollView.as_view(), name="enroll"),
    path("me/enrollments/", MyEnrollmentsView.as_view(), name="my-enrollments"),

    path("me/courses/", MyCoursesView.as_view(), name="my-courses"),

    path("courses/<int:course_id>/enrollments/", CourseEnrollmentsView.as_view(), name="course-enrollments"),


     path("courses/<int:course_id>/materials/", CourseMaterialCreateView.as_view(), name="course-materials"),
    path("courses/<int:course_id>/materials/<int:material_id>/", CourseMaterialDetailView.as_view(), name="course-material-detail"),



]