// Sser log out when server is down through pinging
import { useEffect } from "react";
import { pingServer } from "./api/api";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
// Styling
import "./App.css";
import Dashboard from "./screens/Dashboard";
import ForgotPassword from "./screens/ForgotPassword";
import Login from "./screens/Login";
import Logs from "./screens/Logs";
import ResetPassword from "./screens/ResetPassword";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Timeoff from "./screens/Timeoff";
import Timesheet from "./screens/Timesheet";
import UserInfo from "./screens/UserInfo";
import TimeoffAdmin from "./screens/TimeoffAdmin";

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      pingServer();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Page "/" */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/time-off" element={<Timeoff />} />
        <Route
          path="/timesheet"
          element={
            <ProtectedRoute>
              <Timesheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-info"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-off-admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <TimeoffAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
