import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Styling
import "./App.css";
// Screens
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import Logs from "./screens/Logs";
import Reports from "./screens/Reports";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Timeoff from "./screens/Timeoff";
import Timesheet from "./screens/Timesheet";
import Userinfo from "./screens/Userinfo";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Page "/" */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/time-off" element={<Timeoff />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/user-info" element={<Userinfo />} />
      </Routes>
    </Router>
  );
}

export default App;
