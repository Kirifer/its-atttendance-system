import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import TimeInOut from "../components/TimeInOutBtn.jsx"
import DashboardLayout from "../components/DashboardLayout";

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
        <div>
          <button className="return-button" onClick={() => navigate("/")}>
            Return to home
          </button>
          <TimeInOut />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
