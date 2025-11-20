import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage({ message }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // milliseconds to seconds = 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ color: "red" }}>Access Denied</h1>
      <h2 style={{ color: "red" }}>SIGN IN FIRST TO ACCESS THIS PAGE!!</h2>
      <h3 style={{ color: "red" }}>Redirecting back to home page...</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorPage;
