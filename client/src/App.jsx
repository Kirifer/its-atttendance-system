// User log out when server is down through pinging
import { useEffect } from "react";
import { pingServer } from "./api/api";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedResetRoute from "./components/ProtectedResetRoute";
// Styling
import "./App.css";
import Approvals from "./screens/Approvals";
import Dashboard from "./screens/Dashboard";
import ForgotPassword from "./screens/ForgotPassword";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import Signup from "./screens/Signup";
import Timeoff from "./screens/Timeoff";
import Timesheet from "./screens/Timesheet";
import UserInfo from "./screens/UserInfo";
import UserRequests from "./screens/UserRequests";
import ResetErrorPage from "./screens/ResetErrorPage";
import SessionLogout from "./components/SessionLogout";

function App() {
  return (
    <SessionLogout>
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

          <Route
            path="/approvals"
            element={
              <ProtectedRoute adminOnly={true}>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ---------------------------- Reset Pass URL Security ---------------------------- */}
          <Route
            path="/reset-password/:token"
            element={
              <ProtectedResetRoute>
                <ResetPassword />
              </ProtectedResetRoute>
            }
          />
          <Route path="/reset-password" element={<ResetErrorPage />} />

          <Route path="/sign-up" element={<Signup />} />
          <Route
            path="/time-off"
            element={
              <ProtectedRoute userOnly={true}>
                {" "}
                <Timeoff />
              </ProtectedRoute>
            }
          />
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
            path="/my-requests"
            element={
              <ProtectedRoute>
                <UserRequests />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </SessionLogout>
  );
}

export default App;
