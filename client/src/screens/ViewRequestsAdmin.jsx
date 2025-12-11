import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";
import {
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../api/leaveAdmin";
import ViewRequestTable from "../components/ViewRequestTable";
import "../styles/ViewRequestsAdmin.css";

function ViewRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time adjustment proper labeling
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  // Time off proper labeling
  const leaveTypeLabels = {
    SICK: "Sick Leave",
    VACATION: "Vacation",
    HOLIDAY: "Holiday",
    OFFSET: "Offset Hours",
  };

  const coverageTypeLabels = {
    FULL_DAY: "Full Day",
    HALF_DAY: "Half Day",
  };

  const fetchRequests = async () => {
    try {
      const leavesData = await getAllLeaves();
      const leaves = leavesData.map((l) => ({
        id: l.id,
        rawType: l.leaveType,
        type: leaveTypeLabels[l.leaveType] || l.leaveType,
        reason: l.reason,
        intern: l.user?.username || "Unknown",
        coverage: coverageTypeLabels[l.coverage] || l.coverageType,
        duration: `${l.startDate} → ${l.endDate}`,
        status: l.status,
        attachment: l.attachment || null,
        source: "leave",
        createdAt: l.createdAt,
      }));

      const adjustmentsRes = await API.get("/time-adjustments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const adjustments = adjustmentsRes.data.requests.map((r) => ({
        id: r.id,
        rawType: r.type,
        type: typeLabels[r.type] || r.type,
        reason: r.details,
        intern: r.user?.username || "Unknown",
        coverage: "-",
        duration: "-",
        status: r.status,
        attachment: r.attachment || null,
        source: "adjustment",
        createdAt: r.createdAt,
      }));

      const merged = [...leaves, ...adjustments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRequests(merged);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, source, status) => {
    try {
      if (source === "leave") {
        await updateLeaveStatus(id, status);
      } else {
        await API.put(
          `/time-adjustments/${id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      fetchRequests();
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id, source) => {
    try {
      if (source === "leave") {
        await deleteLeave(id);
      } else {
        await API.delete(`/time-adjustments/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchRequests();
    } catch (err) {
      console.error(err);
      throw new Error(
        err.response?.data?.message || "Failed to delete request"
      );
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="admin__loading">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div>
        <section className="user-requests">
          {requests.length === 0 ? (
            <p>No requests submitted yet.</p>
          ) : (
            <ViewRequestTable
              requests={requests}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ViewRequestsAdmin;
