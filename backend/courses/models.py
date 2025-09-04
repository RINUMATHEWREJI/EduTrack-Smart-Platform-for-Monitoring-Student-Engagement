from django.db import models

# Create your models here.

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True,null=True)
    owner = models.ForeignKey("users.TeacherProfile",on_delete=models.CASCADE,related_name="courses")
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class CourseMaterial(models.Model):
    MATERIAL_CHOICES = [
        ("VIDEO", "Video"),
        ("PDF", "PDF"),
        ("NOTE", "Note"),
        ("LINK", "Link"),
    ]

    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name="materials")

    title = models.CharField(max_length=200)
    material_type = models.CharField(max_length=10,choices=MATERIAL_CHOICES)

    file = models.FileField(upload_to="materials/files/",null=True,blank=True)
    video_url = models.URLField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    student = models.ForeignKey("users.StudentProfile", on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")  # student can't enroll twice

    def __str__(self):
        return f"{self.student.user.email} enrolled in {self.course.title}"
