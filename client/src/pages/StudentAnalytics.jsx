// src/pages/StudentAnalytics.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import "../css/StudentAnalytics.css"; // 👈 new CSS file

const API_URL = import.meta.env.VITE_API_URL;

function StudentAnalytics() {
  const { materialId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}materials/${materialId}/students/`,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching per-student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [materialId]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="student-analytics">
      <div className="header">
        <h2>📊 Per-Student Attention</h2>
        <Link to={-1} className="back-btn">⬅ Back</Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Time Spent (minutes)</th>
              <th>Attentive %</th>
              <th>Distracted %</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.email}</td>
                <td>{s.time_spent_str} min</td>
                <td className="attentive">{s.attentive_pct}%</td>
                <td className="distracted">{s.distracted_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentAnalytics;
