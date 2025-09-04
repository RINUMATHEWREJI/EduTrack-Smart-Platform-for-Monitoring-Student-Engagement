import { useState } from "react";
import { getAccessToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import './TeacherPage.css'
import StudentList from "../components/StudentList";
import RegisterStudentForm from "../components/RegisterStudentForm";
import axios from "axios";
import TeacherProfile from "../components/TeacherProfile";
import ChangePassword from "../components/ChangePassword";
import CourseList from "../components/CourseList";
import CreateCourse from "../components/CreateCourse";
import CourseListSub from "../components/CourseListSub";

const API_URL = import.meta.env.VITE_API_URL;

function TeacherPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [activePage, setActivePage] = useState("courses"); // "register" or "view"

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}students/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="Teacher-dashboard">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h2>Teacher Menu</h2>
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
        <button
          className={activePage === "register" ? "active" : ""}
          onClick={() => setActivePage("register")}
        >
          Register Student
        </button>
        <button
          className={activePage === "view" ? "active" : ""}
          onClick={() => {
            setActivePage("view");
            fetchStudents();
          }}
        >
          View Students
        </button>
        <button
          className={activePage === "createcourses" ? "active" : ""}
          onClick={() => {
            setActivePage("createcourses");
          
          }}
        >
          Create Courses
        </button>
        <button
          className={activePage === "courses" ? "active" : ""}
          onClick={() => {
            setActivePage("courses");
          
          }}
        >
          Courses
        </button>
        <button
          className={activePage === "attentive" ? "active" : ""}
          onClick={() => {
            setActivePage("attentive");
          
          }}
        >
        Students Perfomance
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Right Content */}
      <div className="content">
        {activePage === "viewprofile" && (
          <TeacherProfile />
        )}
        {activePage === "changepassword" && (
          <ChangePassword />
        )}
        {activePage === "register" && (
          <RegisterStudentForm fetchStudents={fetchStudents} />
        )}
        {activePage === "view" && (
          <StudentList students={students} fetchStudents={fetchStudents} />
        )}
        {activePage === "createcourses" && (
          <CreateCourse />
        )}
        {activePage === "courses" && (
          <CourseList />
        )}
        {activePage === "attentive" && (
          <CourseListSub />
        )}
      </div>
    </div>
  );
}

export default TeacherPage