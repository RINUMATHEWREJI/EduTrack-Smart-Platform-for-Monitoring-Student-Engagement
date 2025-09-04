// CreateCourse.jsx
import { useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function CreateCourse() {
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  const addCourse = async () => {
    try {
      await axios.post(`${API_URL}courses/`, newCourse, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setMessage("✅ Course created successfully!");
      setNewCourse({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("❌ Failed to create course.");
    }
  };

  return (
    <div className="create-course">
      <h2>Create a New Course</h2>

      <input
        type="text"
        placeholder="Course Title"
        value={newCourse.title}
        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
      />
      <textarea
        placeholder="Course Description"
        value={newCourse.description}
        onChange={(e) =>
          setNewCourse({ ...newCourse, description: e.target.value })
        }
      />
      <button onClick={addCourse}>+ Create Course</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateCourse;
