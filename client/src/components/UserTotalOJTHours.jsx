import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function UserTotalOJTHours() {
  const { user, loading: contextLoading } = useContext(UserContext);

  const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "ADMIN" || cachedUser?.role === "ADMIN";

  if (isAdmin) return null;

  if (contextLoading) {
    return (
      <p style={{ textAlign: "center" }}>Loading User's Total OJT Hours...</p>
    );
  }

  if (!user || user.role !== "USER") return null;

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>OJT Hours</h3>
      {user.totalOJTHours === null || user.totalOJTHours === 0 ? (
        <p>The admin hasn’t set your Total OJT hours yet.</p>
      ) : (
        <>
          <p>Total: {user.totalOJTHours} hours</p>
          <p>
            Remaining:{" "}
            {user.remainingWorkHours !== null ? user.remainingWorkHours : "0"}{" "}
            hours
          </p>
        </>
      )}
    </div>
  );
}
