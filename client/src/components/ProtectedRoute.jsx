import ErrorPage from "../screens/ErrorPage.jsx";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <ErrorPage message="" />;
  }

  if (adminOnly) {
    try {
      const decoded = jwtDecode(token); // decode JWT
      if (decoded.role !== "ADMIN") {
        return <ErrorPage message="YOU DO NOT HAVE ACCESS TO THIS PAGE!!" />;
      }
    } catch (err) {
      return <ErrorPage message="Invalid token" />;
    }
  }

  return children;
}

export default ProtectedRoute;
