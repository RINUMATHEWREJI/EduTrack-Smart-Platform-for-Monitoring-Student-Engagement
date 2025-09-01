import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, logout } from "../utils/auth";
import RegisterTeacherForm from "../components/RegisterTeacherForm";
import TeacherList from "../components/TeacherList";
import axios from "axios";
import './AdminPage.css'

const API_URL = import.meta.env.VITE_API_URL;

function AdminPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [activePage, setActivePage] = useState("register"); // "register" or "view"

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}teachers/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h2>Admin Menu</h2>
        <button
          className={activePage === "register" ? "active" : ""}
          onClick={() => setActivePage("register")}
        >
          Register Teacher
        </button>
        <button
          className={activePage === "view" ? "active" : ""}
          onClick={() => {
            setActivePage("view");
            fetchTeachers();
          }}
        >
          View Teachers
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Right Content */}
      <div className="content">
        {activePage === "register" && (
          <RegisterTeacherForm fetchTeachers={fetchTeachers} />
        )}
        {activePage === "view" && (
          <TeacherList teachers={teachers} fetchTeachers={fetchTeachers} />
        )}
      </div>
    </div>
  );
}

export default AdminPage;
