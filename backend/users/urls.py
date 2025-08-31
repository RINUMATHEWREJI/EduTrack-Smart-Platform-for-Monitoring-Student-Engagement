from django.urls import path
from .views import(
    LoginView,LogoutView,
    RegisterTeacherView,RegisterStudentView,
    TeacherProfileView,StudentProfileView,
    ChangePasswordView
    
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/teacher/",RegisterTeacherView.as_view(),name="register-teacher"),
    path("register/student/",RegisterStudentView.as_view(),name="register-student"),
    path("profile/teacher/",TeacherProfileView.as_view(),name="teacher-profile"),
    path("profile/student/",StudentProfileView.as_view(),name="student-profile"),
    path("changepassword/",ChangePasswordView.as_view(),name="change-password"),
]