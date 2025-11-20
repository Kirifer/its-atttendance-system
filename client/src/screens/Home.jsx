import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate("/login")}>Log in</button>
      <button onClick={() => navigate("/sign-up")}>Sign up</button>
    </div>
  );
}

export default Home;
