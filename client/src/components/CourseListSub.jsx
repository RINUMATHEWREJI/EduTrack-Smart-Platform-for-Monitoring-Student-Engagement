import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import "../css/CourseListSub.css"; // add this CSS file

const API_URL = import.meta.env.VITE_API_URL;

function CourseListSub() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}me/courses/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="course-list">
      <h2>My Courses</h2>
      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button
              className="view-btn"
              onClick={() => navigate(`/attentive/courses/${course.id}`)}
            >
              View Materials
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseListSub;
