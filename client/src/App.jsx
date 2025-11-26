import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// Styling
import "./App.css";
// Screens
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import ForgotPassword from "./screens/ForgotPassword";
import Login from "./screens/Login";
import Logs from "./screens/Logs";
import Reports from "./screens/Reports";
import ResetPassword from "./screens/ResetPassword";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Timeoff from "./screens/Timeoff";
import Timesheet from "./screens/Timesheet";
import UserInfo from "./screens/UserInfo";
import TimeoffAdmin from "./screens/TimeoffAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Page "/" */}
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/time-off" element={<Timeoff />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route
          path="/time-off-admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <TimeoffAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
