import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function CourseList() {
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
    <div>
      <h2>My Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <strong>{course.title}</strong> - {course.description}
            <button onClick={() => navigate(`/courses/${course.id}`)}>
              Manage Materials
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
