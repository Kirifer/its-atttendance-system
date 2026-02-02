import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage({ message }) {
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
      <h1 style={{ color: "red", fontWeight: "bolder" }}>Access Denied!!</h1>
      <h2 style={{ color: "red", fontWeight: "bolder" }}>
        {token
          ? "YOU DO NOT HAVE ACCESS TO THIS PAGE!!"
          : "SIGN IN FIRST TO ACCESS THIS PAGE!!"}
      </h2>
      <h3 style={{ color: "red" }}>
        {token ? "Redirecting to dashboard..." : "Redirecting to home page..."}
      </h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorPage;
