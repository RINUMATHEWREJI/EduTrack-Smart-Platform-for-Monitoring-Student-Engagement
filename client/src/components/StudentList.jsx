import axios from "axios";
import { getAccessToken } from "../utils/auth";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function StudentList({ students, fetchStudents }) {
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({});

  // Start editing
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({
      name: student.name || "",
      department: student.department || "",
      gender: student.gender || "",
      phone: student.phone || "",
      email: student.user.email || "",
      password: "", // always empty
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingStudent(null);
    setFormData({});
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${API_URL}students/${id}/`, formData, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      handleCancel();
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Error updating Student:", error);
    }
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Student?")) return;

    try {
      await axios.delete(`${API_URL}students/${id}/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      fetchStudents(); // refresh list
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="student-list">
      <h2>Students List</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              {editingStudent === s.id ? (
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
                    <button onClick={() => handleUpdate(s.user.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.user.email}</td>
                  <td>{s.name || "-"}</td>
                  <td>{s.department || "-"}</td>
                  <td>{s.gender || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s.user.id)}>Delete</button>
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

export default StudentList;
