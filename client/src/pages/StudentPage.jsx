// src/pages/StudentPage.jsx
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function StudentPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Student Dashboard</h1>
      <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
    </div>
  );
}

export default StudentPage