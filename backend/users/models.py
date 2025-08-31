from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.db import models
from django.core.exceptions import PermissionDenied
# Create your models here.

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Roles.SUPERADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    class Roles(models.TextChoices):
        SUPERADMIN = "SUPERADMIN","Super Admin"
        TEACHER = "TEACHER","Teacher"
        STUDENT = "STUDENT","Student"
    
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20,choices=Roles.choices,default=Roles.STUDENT)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def save(self,*args,**kwargs):
        creator = kwargs.pop("creator",None)

        if self._state.adding:
            if self.role == self.Roles.TEACHER:
                if not(creator and creator.role == self.Roles.SUPERADMIN):
                    raise PermissionDenied("only super admin can add teachers")
            if self.role == self.Roles.STUDENT:
                if not(creator and creator.role == self.Roles.TEACHER):
                    raise PermissionDenied("only teachers can add student")
        super().save(*args,**kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
    

class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher_profile")
    name = models.CharField(max_length=30,blank=False,null=False)
    bio = models.TextField(blank=True,null=True)
    department = models.CharField(max_length=30,blank=True,null=True)
    avatar = models.ImageField(blank=True,null=True,upload_to="avatars/teachers/")
    gender = models.CharField(max_length=20,blank=True,null=True)
    phone = models.CharField(max_length=15,blank=True,null=True)

    def __str__(self):
        return f"{self.user.email} ({self.user.role})"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    name = models.CharField(max_length=30,blank=False,null=False)
    department = models.CharField(max_length=30,blank=True,null=True)
    avatar = models.ImageField(blank=True,null=True,upload_to="avatars/students/")
    gender = models.CharField(max_length=20,blank=True,null=True)
    phone = models.CharField(max_length=15,blank=True,null=True)

    def __str__(self):
        return f"{self.user.email} ({self.user.role})"