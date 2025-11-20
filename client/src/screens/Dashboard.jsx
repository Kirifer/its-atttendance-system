import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div>
        <h1>Dashboard</h1>
        <button onClick={() => navigate("/")}>Go to home</button>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
