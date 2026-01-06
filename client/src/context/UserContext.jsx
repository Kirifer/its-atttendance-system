import { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user || res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
    } catch (err) {
      console.error("Failed to fetch user", err);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
