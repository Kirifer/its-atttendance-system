import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";
import Logs from "./screens/Logs";
import Reports from "./screens/Reports";
import Settings from "./screens/Settings";
import Timeoff from "./screens/Timeoff";
import Timesheet from "./screens/Timesheet";
import Userinfo from "./screens/Userinfo";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/time-off" element={<Timeoff />} />
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path="/user-info" element={<Userinfo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;