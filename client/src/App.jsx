import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route (login) */}
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherPage />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentPage />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
