import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Login />}/>
      <Route path="/teacher" element = {<TeacherPage />}/>
      <Route path="/student" element = {<StudentPage />}/>
      <Route path="/admin" element = {<AdminPage />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
