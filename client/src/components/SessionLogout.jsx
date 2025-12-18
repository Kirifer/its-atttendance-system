import { useEffect, useState } from "react";
import { pingServer } from "../api/api";
import { jwtDecode } from "jwt-decode";

const SessionLogout = ({ children }) => {
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token && window.location.pathname !== "/") {
        handleForceLogout();
        return;
      }

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.warn("Token expired. Logging out...");
            handleForceLogout();
            return;
          }
        } catch (err) {
          console.error("Invalid token format detected.");
          handleForceLogout();
          return;
        }
      }

      try {
        await pingServer();
        setServerError(false);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleForceLogout();
        } else {
          setServerError(true);
        }
      }
    };

    const handleForceLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {serverError && (
        <div style={errorBarStyle}>Server Error: Connection Lost</div>
      )}
      {children}
    </>
  );
};

const errorBarStyle = {
  backgroundColor: "#ff4d4d",
  color: "white",
  textAlign: "center",
  padding: "10px",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 9999,
  fontWeight: "bold",
};

export default SessionLogout;
