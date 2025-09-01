import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function TeacherList({ teachers, fetchTeachers }) {
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({});

  // Start editing
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher.id);
    setFormData({
      name: teacher.name || "",
      bio: teacher.bio || "",
      department: teacher.department || "",
      gender: teacher.gender || "",
      phone: teacher.phone || "",
      email: teacher.user.email || "",
      password: "", // always empty
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingTeacher(null);
    setFormData({});
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${API_URL}teachers/${id}/`, formData, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      handleCancel();
      fetchTeachers(); // refresh list
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await axios.delete(`${API_URL}teachers/${id}/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      fetchTeachers(); // refresh list
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  return (
    <div className="teacher-list">
      <h2>Teachers List</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Bio</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t.id}>
              {editingTeacher === t.id ? (
                <>
                  <td>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(t.user.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{t.user.email}</td>
                  <td>{t.name || "-"}</td>
                  <td>{t.bio || "-"}</td>
                  <td>{t.department || "-"}</td>
                  <td>{t.gender || "-"}</td>
                  <td>{t.phone || "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Edit</button>
                    <button onClick={() => handleDelete(t.user.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherList;
