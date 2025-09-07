from django.urls import path
from .views import (
    StartAttentionSessionView, RecordAttentionView, StopAttentionSessionView,
    MaterialAttentionSummaryView, material_students, 
)
from . import views

urlpatterns = [
    # Student-side tracking
    path("materials/<int:material_id>/attention/start/", StartAttentionSessionView.as_view()),
    path("materials/<int:material_id>/attention/record/", RecordAttentionView.as_view()),
    path("materials/<int:material_id>/attention/stop/",  StopAttentionSessionView.as_view()),

    # Teacher analytics
    path("analytics/materials/<int:material_id>/summary/",   MaterialAttentionSummaryView.as_view()),

    path("materials/<int:material_id>/students/", views.material_students, name="material_students"),
]
