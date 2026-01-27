import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

export default function UserTotalOJTHours() {
  const [remainingHours, setRemainingHours] = useState(null);
  const [totalHours, setTotalHours] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setRole(data.role);
        setTotalHours(data.totalOJTHours);
        setRemainingHours(data.remainingWorkHours);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if (loading && role === null) return null;
  if (loading && role === "ADMIN") return null;
  if (loading && role === "USER")
    return <p>Loading User's Total OJT Hours...</p>;
  if (error) return <p>Error: {error}</p>;

  if (role !== "USER") return null;

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>OJT Hours</h3>
      {totalHours === null ? (
        <p>The admin hasn’t set your Total OJT hours yet.</p>
      ) : (
        <>
          <p>Total: {totalHours} hours</p>
          <p>
            Remaining: {remainingHours !== null ? remainingHours : "0"} hours
          </p>
        </>
      )}
    </div>
  );
}
