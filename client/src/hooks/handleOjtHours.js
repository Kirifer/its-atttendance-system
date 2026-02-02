import { useEffect, useState, useMemo } from "react";
import { getAllUsers } from "../api/auth";
import { getUserOjtHours, setUserOjtHours } from "../api/ojtHours";

export default function useHandleOjtHours() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  useEffect(() => {
    const fetchSingleUserData = async () => {
      if (selectedUsers.length !== 1 || selectedUsers[0].id === "ALL") {
        setTotalOJTHours("");
        setRemainingWorkHours(0);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserOjtHours(selectedUsers[0].id);
        setTotalOJTHours(data?.totalOJTHours ?? "");
        setRemainingWorkHours(data?.remainingWorkHours ?? 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleUserData();
  }, [selectedUsers]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data?.users || data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) &&
        !selectedUsers.find((sel) => sel.id === u.id),
    );
  }, [users, search, selectedUsers]);

  const selectUser = (userObj) => {
    setSuccess(null);
    setError(null);
    if (userObj.id === "ALL") {
      setSelectedUsers([{ id: "ALL", email: "ALL USERS" }]);
      return;
    }
    const currentList = selectedUsers.filter((u) => u.id !== "ALL");
    if (!currentList.find((u) => u.id === userObj.id)) {
      setSelectedUsers([...currentList, userObj]);
    }
    setSearch("");
    setIsSearching(false);
  };

  const removeUser = (id) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const saveOjtHours = async () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one intern");
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

      let targetUsers = selectedUsers;
      if (selectedUsers.some((u) => u.id === "ALL")) {
        targetUsers = users;
      }

      const promises = targetUsers.map((user) =>
        setUserOjtHours(user.id, value),
      );

      await Promise.all(promises);

      if (selectedUsers.length === 1 && selectedUsers[0].id !== "ALL") {
        console.log("Fetching fresh data for user:", selectedUsers[0].id);
        const freshData = await getUserOjtHours(selectedUsers[0].id);
        setRemainingWorkHours(freshData.remainingWorkHours);
        setTotalOJTHours(freshData.totalOJTHours);
      } else {
        setSelectedUsers([]);
        setTotalOJTHours("");
        setRemainingWorkHours(0);
      }

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
    setSelectedUsers([]);
    setTotalOJTHours("");
    setRemainingWorkHours(0);
    setError(null);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    search,
    setSearch,
    isSearching,
    setIsSearching,
    filteredUsers,
    selectUser,
    removeUser,
    selectedUsers,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,
    saveOjtHours,
    resetState,
    clearMessages,
    loading,
    error,
    success,
  };
}
