import ErrorPage from "../screens/ErrorPage.jsx";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, userOnly, adminOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <ErrorPage message="" />;
  }

  if (userOnly) {
    try {
      const decoded = jwtDecode(token); // decode JWT
      if (decoded.role !== "USER") {
        return <ErrorPage message="" />;
      }
    } catch (err) {
      return <ErrorPage message="Invalid token" />;
    }
  }

  if (adminOnly) {
    try {
      const decoded = jwtDecode(token); // decode JWT
      if (decoded.role !== "ADMIN") {
        return <ErrorPage message="" />;
      }
    } catch (err) {
      return <ErrorPage message="Invalid token" />;
    }
  }

  return children;
}

export default ProtectedRoute;
