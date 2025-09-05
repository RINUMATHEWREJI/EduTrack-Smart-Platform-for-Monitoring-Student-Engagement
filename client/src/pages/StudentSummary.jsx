// src/pages/StudentSummary.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import "../css/StudentSummary.css"; // 👈 CSS file

const API_URL = import.meta.env.VITE_API_URL;

function StudentSummary() {
  const { materialId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${API_URL}analytics/materials/${materialId}/summary/`,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [materialId]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!summary) return <p className="no-summary">No summary available</p>;

  return (
    <div className="student-summary">
      <div className="header">
        <h2>📊 Material Summary</h2>
        <Link to={-1} className="back-btn">⬅ Back</Link>
      </div>

      <div className="summary-card">
        <p><strong>Material:</strong> {summary.material_title}</p>
        <p><strong>Students:</strong> {summary.num_students}</p>
        <p className="attentive"><strong>Avg Attentive %:</strong> {summary.avg_attentive_pct}%</p>
        <p className="distracted"><strong>Avg Distracted %:</strong> {summary.avg_distracted_pct}%</p>
        <p className="time"><strong>Avg Time Spent:</strong> {summary.avg_time_spent_minutes} min</p>
      </div>
    </div>
  );
}

export default StudentSummary;
