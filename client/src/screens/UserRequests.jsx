import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";
import UserRequestsTable from "../components/UserRequestTable";
import "../styles/UserRequests.css";
import SessionLogout from "../components/SessionLogout";

function UserRequests() {
  const [userRequests, setUserRequests] = useState([]);
  const [filterType, setFilterType] = useState("type");
  const [query, setQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMyRequests = async () => {
    try {
      const response = await API.get("/time-adjustments/my-requests");
      const myRequests = response.data.requests.filter(
        (r) => r.userId === user.id
      );
      setUserRequests(myRequests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <SessionLogout>
      <DashboardLayout>
        <div className="user-time__main">
          <div className="user-time__header-table">
            <div className="user-time__header">
              <h3 className="user-time-title_h3">
                My Time Adjustment Requests
              </h3>
              <a href="/timesheet" className="x-button">
                X
              </a>
            </div>

            <div className="user-time-requests">
              <UserRequestsTable
                requests={userRequests}
                filterType={filterType}
                query={query}
                setFilterType={setFilterType}
                setQuery={setQuery}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SessionLogout>
  );
}

export default UserRequests;
