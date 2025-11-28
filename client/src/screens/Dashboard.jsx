import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Dashboard.css";
import TimeInOut from "../components/TimeInOutBtn.jsx";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reload, setReload] = useState(false);

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
          <TimeInOut
            userId={user.id}
            onAttendanceChange={() => setReload((r) => !r)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
