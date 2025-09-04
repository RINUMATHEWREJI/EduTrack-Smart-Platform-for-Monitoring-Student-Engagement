from django.db import models
from django.utils import timezone

class AttentionSession(models.Model):
    student = models.ForeignKey("users.StudentProfile", on_delete=models.CASCADE, related_name="attention_sessions")
    material = models.ForeignKey("courses.CourseMaterial", on_delete=models.CASCADE, related_name="attention_sessions")
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    @property
    def duration_seconds(self):
        end = self.ended_at or timezone.now()
        return int((end - self.started_at).total_seconds())

    def __str__(self):
        return f"Session {self.id} - {self.student.user.email} - {self.material.title}"


class AttentionRecord(models.Model):
    session = models.ForeignKey(AttentionSession, on_delete=models.CASCADE, related_name="records")
    material = models.ForeignKey("courses.CourseMaterial", on_delete=models.CASCADE, related_name="attention_records")
    student = models.ForeignKey("users.StudentProfile", on_delete=models.CASCADE, related_name="attention_records")

    timestamp = models.DateTimeField(auto_now_add=True)
    attentive = models.BooleanField()
    confidence = models.FloatField(default=0.0)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        state = "Attentive" if self.attentive else "Distracted"
        return f"{self.student.user.email} - {self.material.title} - {state} ({self.confidence:.2f})"
