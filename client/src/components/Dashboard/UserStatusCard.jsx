import { useState, useEffect } from "react";
import { getLoginStatus } from "../../api/userStatus";
import { getAllStaffUsers } from "../../api/auth";
import "../../styles/UserStatusCard.css";

export default function UserStatusCard({ reload }) {
  const [tab, setTab] = useState("online"); // "online" or "offline"
  const [users, setUsers] = useState({ loggedIn: [], loggedOut: [] });
  const [loading, setLoading] = useState(true);
  const [visibleUserIds, setVisibleUserIds] = useState(null);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

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

  const rawList = tab === "online" ? users.loggedIn : users.loggedOut;
  const list =
    visibleUserIds instanceof Set
      ? rawList.filter((u) => visibleUserIds.has(u.id))
      : user?.role === "SUPERVISOR" && user?.department
      ? []
      : rawList;

  useEffect(() => {
    if (user?.role !== "ADMIN" && user?.role !== "SUPERVISOR") return;

    setLoading(true);
    getLoginStatus()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [reload, user]);

  if (user?.role !== "ADMIN" && user?.role !== "SUPERVISOR") return null;

  useEffect(() => {
    const loadUsers = async () => {
      if (user?.role !== "SUPERVISOR" || !user?.department) {
        setVisibleUserIds(null);
        return;
      }
      try {
        const allUsers = await getAllStaffUsers();
        const allowed = new Set(
          (allUsers || [])
            .filter(
              (u) =>
                u.role === "USER" &&
                u.department === user.department,
            )
            .map((u) => u.id),
        );
        setVisibleUserIds(allowed);
      } catch (err) {
        setVisibleUserIds(new Set());
      }
    };
    loadUsers();
  }, [user]);

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
        <div className="user-status-list scrollable">
  {list && list.length > 0 ? (
    list.map((user) => (
      <div key={user.id} className="user-status-item">
        <div className="user-info">
          <span className="user-name">{user.username}</span>
          <span className="user-email">{user.email}</span>
        </div>
        {tab === "online" && (
          <div className="user-time">
            <div>{formatTime(user.timeIn)}</div>
            <div className="started-on">Started on</div>
          </div>
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
