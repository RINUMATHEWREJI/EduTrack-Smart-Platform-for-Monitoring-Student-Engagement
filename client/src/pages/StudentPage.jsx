import { useState } from "react";
import { getAccessToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import './StudentPage.css'
import StudentProfile from "../components/StudentProfile";
import ChangePassword from "../components/ChangePassword";
import StudentCourses from "../components/StudentCourses";  // NEW

function StudentPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("courses");

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
          className={activePage === "viewprofile" ? "active" : ""}
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

        <button
          className={activePage === "courses" ? "active" : ""}
          onClick={() => setActivePage("courses")}
        >
          My Courses
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Right Content */}
      <div className="content">
        {activePage === "viewprofile" && <StudentProfile />}
        {activePage === "changepassword" && <ChangePassword />}
        {activePage === "courses" && <StudentCourses />}
      </div>
    </div>
  );
}

export default StudentPage;
