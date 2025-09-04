import { useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function CourseForm({ course, fetchCourses, closeForm }) {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    published: course?.published || false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (course) {
        // Update
        await axios.patch(`${API_URL}courses/${course.id}/`, formData, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
      } else {
        // Create
        await axios.post(`${API_URL}courses/`, formData, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
      }
      fetchCourses();
      closeForm();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  return (
    <div className="course-form">
      <h3>{course ? "Edit Course" : "Create Course"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </label>
        <label>
          Published:
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={closeForm}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CourseForm;
