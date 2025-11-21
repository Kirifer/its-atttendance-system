import { useState } from "react";
import API from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot-password", { email });
      // show reset link if in DEV mode
      setMessage(res.data.resetUrl || res.data.message);
      if (res.data.resetUrl) {
        console.log("Password reset link:", res.data.resetUrl);
      }
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && (
        <p style={{ wordBreak: "break-word", marginTop: "10px" }}>{message}</p>
      )}
    </div>
  );
}

export default ForgotPassword;
