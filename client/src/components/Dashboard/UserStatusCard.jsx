import { useState, useEffect } from "react";
import { getLoginStatus } from "../../api/userStatus";
import "../../styles/UserStatusCard.css";

export default function UserStatusCard({ reload }) {
  const [tab, setTab] = useState("online"); // "online" or "offline"
  const [users, setUsers] = useState({ loggedIn: [], loggedOut: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLoginStatus()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [reload]);

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  const list = tab === "online" ? users.loggedIn : users.loggedOut;

  return (
    <div className="user-status-card">
      <div className="user-status-tabs">
        <button
          className={tab === "online" ? "active" : ""}
          onClick={() => setTab("online")}
        >
          Online Users
        </button>
        <button
          className={tab === "offline" ? "active" : ""}
          onClick={() => setTab("offline")}
        >
          Offline Users
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="user-status-list">
          {list && list.length > 0 ? (
            list.map((user) => (
              <div key={user.id} className="user-status-item">
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                {tab === "online" && (
                  <div className="user-time">{formatTime(user.timeIn)}</div>
                )}
              </div>
            ))
          ) : (
            <div className="no-users">No users in this tab</div>
          )}
        </div>
      )}
    </div>
  );
}
