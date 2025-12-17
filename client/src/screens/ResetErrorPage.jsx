import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // milliseconds to seconds = 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "red" }}>
        You are not allowed this access this page!!
      </h1>
    </div>
  );
}

export default ResetErrorPage;
