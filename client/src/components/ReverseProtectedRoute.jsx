import { Navigate } from "react-router-dom";

const ReverseProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ReverseProtectedRoute;
