import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "./DashboardLayout/Navbar";
import Sidebar from "./DashboardLayout/Sidebar";
import Footer from "./DashboardLayout/Footer";
import "../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const { user: contextUser } = useContext(UserContext);
  const [user, setUser] = useState({ username: "", email: "", role: "" });

  useEffect(() => {
    if (contextUser) setUser(contextUser);
    else {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  }, [contextUser]);

  return (
    <div className="dashboard">
      <div className="dashboard__content-wrapper">
        <Sidebar user={user} />

        <main className="dashboard__main">
          <Navbar user={user} />

          {children}

          <footer>
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
}