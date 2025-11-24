import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="background center-align-items">
      <h1>Welcome to IT Squarehub Attendance Management System!</h1>

      {!token && (
        <>
          <button className="login-button" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button
            className="signup-button"
            onClick={() => navigate("/sign-up")}
          >
            Sign up
          </button>
        </>
      )}

      {token && (
        <>
          <button onClick={() => navigate("/dashboard")}>
            Go to dashboard
          </button>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      )}
    </div>
  );
}

export default Home;
