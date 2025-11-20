import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user safely from localStorage
  const getStoredUser = () => {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());

  // Optional: sync user on page reload
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};

// Custom hook to access auth
export const useAuth = () => useContext(AuthContext);
