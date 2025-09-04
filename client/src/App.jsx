import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import CourseDetail from "./pages/CourseDetail";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import './App.css'
import StudentCourses from "./components/StudentCourses";
import StudentCourseDetail from "./pages/StudentCourseDetail";

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
        <Route 
        path="/courses/:id" 
      element={
       <ProtectedRoute allowedRoles={["TEACHER"]}>
        <CourseDetail />
       </ProtectedRoute>
      } 
    />
    <Route path="/student/courses" element={<StudentCourses />} />
    <Route path="/student/courses/:id" element={<StudentCourseDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
