import { useState } from "react";
import { getAccessToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import './StudentPage.css'
import axios from "axios";
import StudentProfile from "../components/StudentProfile";
import ChangePassword from "../components/ChangePassword";

const API_URL = import.meta.env.VITE_API_URL;

function StudentPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("viewprofile"); // "register" or "view"


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="student-dashboard">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h2>Student Menu</h2>
        <button
          className={activePage === "viewprofie" ? "active" : ""}
          onClick={() => setActivePage("viewprofile")}
        >
          View Profile
        </button>
        <button
          className={activePage === "changepassword" ? "active" : ""}
          onClick={() => setActivePage("changepassword")}
        >
          Change Password
        </button>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Right Content */}
      <div className="content">
        {activePage === "viewprofile" && (
          <StudentProfile />
        )}
        {activePage === "changepassword" && (
          <ChangePassword />
        )}
        
      </div>
    </div>
  );
}

export default StudentPage