import { useEffect, useState } from "react";
import { getAllUsers } from "../api/auth";
import { getUserOjtHours, setUserOjtHours } from "../api/ojtHours";

export default function useHandleOjtHours() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [totalOJTHours, setTotalOJTHours] = useState("");
  const [remainingWorkHours, setRemainingWorkHours] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- ADMIN ONLY ---------------- */
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setError("Admin access only");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- FETCH HOURS ---------------- */
  const selectUser = async (user) => {
    try {
      setLoading(true);
      setSelectedUser(user);

      const data = await getUserOjtHours(user.id);
      setTotalOJTHours(data.totalOJTHours || 0);
      setRemainingWorkHours(data.remainingWorkHours || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SAVE / UPDATE ---------------- */
  const saveOjtHours = async () => {
    if (!selectedUser) return;

    const value = Number(totalOJTHours);
    if (!Number.isInteger(value) || value <= 0) {
      setError("Total OJT Hours must be a positive integer");
      return;
    }

    try {
      setLoading(true);
      const data = await setUserOjtHours(selectedUser.id, value);

      setRemainingWorkHours(data.remainingWorkHours);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    search,
    setSearch,
    filteredUsers,
    selectUser,

    selectedUser,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,

    saveOjtHours,
    loading,
    error,
  };
}
