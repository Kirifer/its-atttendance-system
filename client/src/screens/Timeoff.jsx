import { useState } from "react";
import "../styles/Timeoff.css";
import DashboardLayout from "../components/DashboardLayout";
import LeaveForm from "../components/LeaveForm";
import { createLeave } from "../api/leave";
import SessionLogout from "../components/SessionLogout";
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
    <SessionLogout>
      <DashboardLayout>
        <div className="timeoff__main">
          <h2 className="timeoff_title">File a Leave</h2>
          <p className="timeoff__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo
            diam, interdum nec placerat in, venenatis egestas justo. Nam eu
            gravida ante, vel egestas turpis.
          </p>
          <Loader loading={loading}>
            <LeaveForm onSubmit={handleLeaveSubmit} />
          </Loader>
        </div>
      </DashboardLayout>
    </SessionLogout>
  );
}

export default Timeoff;
