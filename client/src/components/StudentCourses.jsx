import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}courses/`, {
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
    <div className="student-courses">
      <h2>Available Courses</h2>
      <div className="course-grid">
        {courses.length === 0 ? (
          <p>No courses available yet.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => navigate(`/student/courses/${course.id}`)}
            >
              <h3>{course.title}</h3>
              <p className="teacher">👨‍🏫 {course.owner_name || "Unknown Teacher"}</p>
              <p className="desc">{course.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentCourses;
