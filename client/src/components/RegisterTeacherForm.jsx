import { useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterTeacherForm({fetchTeachers}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${API_URL}register/teacher/`,
        { email, password },
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setSuccess("Teacher registered successfully!");
      setEmail("");
      setPassword("");
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.email || "Error registering teacher");
    }
  };

  return (
    <div className="register-form">
      <h2>Register Teacher</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Teacher Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default RegisterTeacherForm;
