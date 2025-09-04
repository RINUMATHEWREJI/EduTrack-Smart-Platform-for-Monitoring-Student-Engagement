from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import AttentionSession, AttentionRecord
from .serializers import AttentionSessionSerializer, AttentionRecordSerializer
from courses.models import CourseMaterial, Course
from .attention import predict_attention
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from users.models import StudentProfile
from courses.models import CourseMaterial

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "student_profile")

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "teacher_profile")


class StartAttentionSessionView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, material_id):
        material = get_object_or_404(CourseMaterial, id=material_id)
        session = AttentionSession.objects.create(
            student=request.user.student_profile,
            material=material
        )
        return Response({"session_id": session.id}, status=status.HTTP_201_CREATED)


class RecordAttentionView(APIView):
    """
    Accept frame bytes (multipart or base64) and store prediction.
    For simplicity, use multipart: field name 'frame'.
    Body: { session_id, frame }
    """
    permission_classes = [IsStudent]

    def post(self, request, material_id):
        session_id = request.data.get("session_id")
        frame = request.FILES.get("frame")  # multipart/form-data

        if not session_id or not frame:
            return Response({"detail": "session_id and frame are required"}, status=400)

        session = get_object_or_404(AttentionSession, id=session_id, student=request.user.student_profile, material_id=material_id)

        # Read bytes and run ML
        image_bytes = frame.read()
        attentive, confidence = predict_attention(image_bytes)

        record = AttentionRecord.objects.create(
            session=session,
            material=session.material,
            student=session.student,
            attentive=attentive,
            confidence=confidence,
        )
        return Response(AttentionRecordSerializer(record).data, status=201)


class StopAttentionSessionView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, material_id):
        session_id = request.data.get("session_id")
        session = get_object_or_404(AttentionSession, id=session_id, student=request.user.student_profile, material_id=material_id)

        if session.ended_at:
            return Response({"detail": "Session already stopped"}, status=400)

        from django.utils import timezone
        session.ended_at = timezone.now()
        session.save(update_fields=["ended_at"])
        return Response(AttentionSessionSerializer(session).data)


# ---------- Teacher Analytics ----------

class MaterialAttentionSummaryView(APIView):
    """For a teacher: summary across all students for a material."""
    permission_classes = [IsTeacher]

    def get(self, request, material_id):
        material = get_object_or_404(CourseMaterial, id=material_id)
        # Guard: only the owner teacher can view
        if material.course.owner != request.user.teacher_profile:
            return Response({"detail": "Not your course/material."}, status=403)

        qs = AttentionRecord.objects.filter(material=material)
        total = qs.count() or 1
        attentive_count = qs.filter(attentive=True).count()
        distracted_count = qs.filter(attentive=False).count()

        return Response({
            "material_id": material.id,
            "material_title": material.title,
            "total_records": total if total != 1 else qs.count(),
            "attentive_pct": round(100.0 * attentive_count / total, 2) if total else 0.0,
            "distracted_pct": round(100.0 * distracted_count / total, 2) if total else 0.0,
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def material_students(request, material_id):
    """
    Return per-student attention stats (time spent + attention %) for a material.
    """
    material = CourseMaterial.objects.get(id=material_id)

    students = StudentProfile.objects.filter(
        attention_records__material=material
    ).distinct()

    result = []
    for student in students:
        # total attentive/distracted records
        records = AttentionRecord.objects.filter(material=material, student=student)
        total = records.count()
        attentive = records.filter(attentive=True).count()
        distracted = records.filter(attentive=False).count()

        if total > 0:
            attentive_pct = round(attentive / total * 100, 2)
            distracted_pct = round(distracted / total * 100, 2)
        else:
            attentive_pct = distracted_pct = 0

        # total time spent (sum of all sessions for this material)
        sessions = AttentionSession.objects.filter(material=material, student=student)
        total_seconds = sum([s.duration_seconds for s in sessions])

        result.append({
            "student_id": student.id,
            "email": student.user.email,
            "time_spent_seconds": total_seconds,
            "time_spent_minutes": round(total_seconds / 60, 2),
            "attentive_pct": attentive_pct,
            "distracted_pct": distracted_pct,
        })

    return Response(result)        
        
class StudentMaterialTimelineView(APIView):
    """For a teacher: timeline of a single student's records for a material."""
    permission_classes = [IsTeacher]

    def get(self, request, material_id, student_id):
        material = get_object_or_404(CourseMaterial, id=material_id)
        if material.course.owner != request.user.teacher_profile:
            return Response({"detail": "Not your course/material."}, status=403)

        qs = (AttentionRecord.objects
              .filter(material=material, student_id=student_id)
              .order_by("timestamp")
              .values("timestamp", "attentive", "confidence"))
        return Response(list(qs))
