import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/")}>Go to home</button>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}

export default Dashboard;
