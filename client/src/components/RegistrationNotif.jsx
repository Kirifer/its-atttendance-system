import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function RegistrationNotif({ user }) {
  const hasNotified = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPendingUsers = async () => {
      if (user?.role !== "ADMIN" || hasNotified.current) return;

      hasNotified.current = true;

      try {
        const { data } = await API.get("/admins/pending-users");

        if (data && data.length > 0) {
          toast.info(
            `${data.length} account registrations pending. See Approvals tab.`,
            {
              position: "top-center",
              autoClose: 5000,
              onClick: () => navigate("/approvals"),
              style: { marginTop: "10px", cursor: "pointer" },
            },
          );
        }
      } catch (err) {
        hasNotified.current = false;
        console.error("Error checking pending users:", err);
      }
    };

    checkPendingUsers();
  }, [user, navigate]);

  return null;
}

export default RegistrationNotif;
