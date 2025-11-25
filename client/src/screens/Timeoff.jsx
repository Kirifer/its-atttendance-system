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
        <h2 className="timeoff_title">File a Leave</h2>
        <p className="timeoff__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo diam, interdum nec placerat in, venenatis egestas justo. Nam eu gravida ante, vel egestas turpis.</p>
        <LeaveForm onSubmit={handleLeaveSubmit} />
      </div>
    </DashboardLayout>
    
  );
}

export default Timeoff;