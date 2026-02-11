import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetErrorPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(token ? "/dashboard" : "/");
    }, 3000); // milliseconds to seconds = 3 seconds

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "red", fontWeight: "bolder" }}>
        YOU ARE NOT ALLOWED TO ACCESS THIS PAGE!!
      </h1>
      <h3 style={{ color: "red" }}>
        {token ? "Redirecting to dashboard..." : "Redirecting to home page..."}
      </h3>
    </div>
  );
}

export default ResetErrorPage;
