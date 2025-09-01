// src/pages/TeacherPage.jsx
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function TeacherPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
    </div>
  );
}

export default TeacherPage