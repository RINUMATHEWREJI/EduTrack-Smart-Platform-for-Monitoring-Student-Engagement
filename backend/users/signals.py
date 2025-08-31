from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User,TeacherProfile,StudentProfile

@receiver(post_save,sender=User)
def create_profile(sender,instance,created,**kwargs):
    if created:
        if instance.role == User.Roles.TEACHER:
            TeacherProfile.objects.create(user=instance)
        elif instance.role == User.Roles.STUDENT:
            StudentProfile.objects.create(user=instance)