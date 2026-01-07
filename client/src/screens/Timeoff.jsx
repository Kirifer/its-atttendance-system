import { useState } from "react";
import "../styles/Timeoff.css";
import DashboardLayout from "../components/DashboardLayout";
import LeaveForm from "../components/LeaveForm";
import { createLeave } from "../api/leave";
import Loader from "../components/Spinner/Loader";

function Timeoff() {
  const [loading, setLoading] = useState(false);

  const handleLeaveSubmit = async (formData) => {
    try {
      setLoading(true);
      await createLeave(formData);
    } catch (err) {
      console.error("Failed to create leave:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="timeoff__main">
        <h2 className="timeoff_title">File a Leave</h2>
        <p className="timeoff__description">
          Submit your leave requests here using the form below. Please ensure
          all details are accurate before submitting.
        </p>
        <Loader loading={loading}>
          <LeaveForm onSubmit={handleLeaveSubmit} />
        </Loader>
      </div>
    </DashboardLayout>
  );
}

export default Timeoff;
