import { useEffect, useState } from "react";
import { pingServer } from "../api/api";
import { jwtDecode } from "jwt-decode";

const SessionLogout = ({ children }) => {
  const [serverError, setServerError] = useState(false);

  const handleForceLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const publicPages = ["/", "/sign-up", "/forgot-password"];
    const currentPath = window.location.pathname;
    const isPublicPage = publicPages.some((page) =>
      currentPath.startsWith(page),
    );

    if (!isPublicPage) {
      window.location.href = "/";
    }
  };

  // Token check (ONCE)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      handleForceLogout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        handleForceLogout();
      }
    } catch {
      handleForceLogout();
    }
  }, []);

  // Server heartbeat (SLOW)
  useEffect(() => {
    const ping = async () => {
      try {
        await pingServer();
        setServerError(false);
      } catch {
        setServerError(true);
      }
    };

    ping(); // initial ping
    const interval = setInterval(ping, 60_000); // 1 minute

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
