import { useEffect, useState } from "react";
import { getAllUsers } from "../api/auth";
import { getUserOjtHours, setUserOjtHours } from "../api/ojtHours";

export default function useHandleOjtHours() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [totalOJTHours, setTotalOJTHours] = useState("");
  const [remainingWorkHours, setRemainingWorkHours] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const filteredUsers =
    isSearching && search
      ? users.filter((u) =>
          u.email.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const selectUser = async (user) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      setSelectedUser(user);
      setIsSearching(false); // hide dropdown immediately

      const data = await getUserOjtHours(user.id);

      setTotalOJTHours(data?.totalOJTHours ?? "");
      setRemainingWorkHours(data?.remainingWorkHours ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveOjtHours = async () => {
    if (!selectedUser) {
      setError("Please select an intern");
      return false;
    }

    const value = Number(totalOJTHours);
    if (!Number.isInteger(value) || value <= 0) {
      setError("Total OJT Hours must be a positive integer");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const data = await setUserOjtHours(selectedUser.id, value);

      setRemainingWorkHours(data.remainingWorkHours);
      setSuccess("OJT hours successfully updated");

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSearch("");
    setIsSearching(false);
    setSelectedUser(null);

    setTotalOJTHours("");
    setRemainingWorkHours(0);

    setError(null);
    setSuccess(null);
    setLoading(false);
  };

  return {
    search,
    setSearch,
    isSearching,
    setIsSearching,
    filteredUsers,
    selectUser,
    selectedUser,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,
    saveOjtHours,
    resetState,
    loading,
    error,
    success,
  };
}
