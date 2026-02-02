import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import "../styles/Dashboard.css";
import AttBtn from "../components/Dashboard/AttBtn.jsx";
import DashboardLayout from "../components/DashboardLayout";
import Clock from "../components/Dashboard/Clock.jsx";
import LogsCard from "../components/Dashboard/LogsCard.jsx";
import FiledLeavesCard from "../components/Dashboard/FiledLeavesCard.jsx";
import Calendar from "../components/Dashboard/Calendar.jsx";
import UserStatusCard from "../components/Dashboard/UserStatusCard.jsx";
import RegistrationNotif from "../components/RegistrationNotif.jsx";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [reload, setReload] = useState(false);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="dashboard__main">
        <RegistrationNotif user={user} />
        <div>
          <div className="dashboard__containerone">
            <div className="dashboard__left">
              <Clock format="HH:mm:ss" />
              <AttBtn
                userId={user.id}
                reload={reload}
                onAttendanceChange={() => setReload((r) => !r)}
              />
            </div>

            <div className="dashboard__right">
              {user.role === "ADMIN" ? (
                <UserStatusCard reload={reload} />
              ) : (
                <LogsCard
                  userName={user.name}
                  logs={[
                    {
                      timeIn: "November 18, 2025 09:00 AM",
                      timeOut: "November 18, 2025 06:00 PM",
                    },
                    {
                      timeIn: "November 19, 2025 09:05 AM",
                      timeOut: "November 19, 2025 06:10 PM",
                    },
                  ]}
                  reload={reload}
                />
              )}
            </div>
          </div>

          <div className="dashboard__container__two">
            <div className="dashboard__left__two">
              <FiledLeavesCard />
            </div>
            <div className="dashboard__right__two">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
