import React from "react";
import "../styles/Timeoff.css";
import DashboardLayout from "../components/DashboardLayout";
import LeaveForm from "../components/LeaveForm";
import { createLeave } from "../api/leave";

function Timeoff() {
  const handleLeaveSubmit = async (formData) => {
    await createLeave(formData);
  };

  return (
    <DashboardLayout>
      <div className="timeoff__main">
        <h2>Submit a Leave</h2>
        <LeaveForm onSubmit={handleLeaveSubmit} />
      </div>
    </DashboardLayout>
    
  );
}

export default Timeoff;