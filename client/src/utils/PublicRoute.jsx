import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function PublicRoute({ children }) {
  const user = getUser();

  if (user) {
    if (user.role === "TEACHER") return <Navigate to="/teacher" replace />;
    if (user.role === "STUDENT") return <Navigate to="/student" replace />;
    if (user.role === "SUPERADMIN") return <Navigate to="/admin" replace />;
  }

  return children;
}

export default PublicRoute;
