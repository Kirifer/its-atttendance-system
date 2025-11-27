import { useNavigate } from "react-router-dom";
import { useState } from "react"
import "../styles/Dashboard.css";
import TimeInOut from "../components/TimeInOutBtn.jsx"
import DashboardLayout from "../components/DashboardLayout";
import Clock from "../components/dashboard/Clock.jsx";
import LogsCard from "../components/dashboard/LogsCard.jsx";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  return (
    <DashboardLayout>
        <div className="dashboard__main">
          <div>
            <div className="dashboard__containerone">
              <div className="dashboard__left">
                 <Clock format="HH:mm:ss" />
                <TimeInOut
                  userId={user.id}
                  onAttendanceChange={() => setReload((r) => !r)}
                />
              </div>
              <div className="dashboard__right">
                <LogsCard
                  userName={user.name}
                  logs={[
                    { timeIn: "November 18, 2025 09:00 AM", timeOut: "November 18, 2025 06:00 PM" },
                    { timeIn: "November 19, 2025 09:05 AM", timeOut: "November 19, 2025 06:10 PM" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}

export default Dashboard;
