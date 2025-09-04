import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function CourseEnrollments({ courseId, close }) {
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(`${API_URL}courses/${courseId}/enrollments/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setEnrollments(res.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="course-enrollments">
      <h3>Enrolled Students</h3>
      <button onClick={close}>Close</button>
      <ul>
        {enrollments.length > 0 ? (
          enrollments.map((e) => (
            <li key={e.id}>
              Student ID: {e.student} (Enrolled at: {new Date(e.enrolled_at).toLocaleString()})
            </li>
          ))
        ) : (
          <p>No students enrolled yet.</p>
        )}
      </ul>
    </div>
  );
}

export default CourseEnrollments;
