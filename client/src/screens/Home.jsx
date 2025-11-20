import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }

  return (
    <div>
      <h1>Home</h1>

      <button onClick={() => navigate("/login")}>Log in</button>
      <button onClick={() => navigate("/sign-up")}>Sign up</button>

      {token && (
        <button onClick={() => navigate("/dashboard")}>Go to dashboard</button>
      )}
    </div>
  );
}

export default Home;
