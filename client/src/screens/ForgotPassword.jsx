import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp } from "../api/auth";
import "../styles/ForgotPassword.css";
import API from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  // otp
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  // request new otp code
  const [newOtp, setNewOtp] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e, reason = "initial") => {
    if (e) e.preventDefault();
    setNewOtp(true);
    try {
      const res = await forgotPassword(email, reason);

      setMessage(res.message);
      setIsError(false);
      setStep("otp");

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid email!";
      setMessage(errorMsg);
      setIsError(true);

      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 5000);
    } finally {
      setNewOtp(false);
    }
  };

  // handle otp
  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp(email, otp);

      sessionStorage.setItem("reset_allowed", true);

      if (res.token) {
        navigate(`/reset-password/${res.token}`);
      } else {
        const token = res.resetUrl.split("/").pop();
        navigate(`/reset-password/${token}`);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "The OTP code inputted is wrong!";
      setMessage(errorMsg);
      setIsError(true);
    }

    setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, 5000);
  };

  return (
    <div className="background center-align-items">
      <form
        onSubmit={(e) => handleSubmit(e, "initial")}
        className="forgot-password-box"
      >
        <div className="top-box-header">
          <p className="forgot-password-text">Forgot Password</p>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/")}
          >
            X
          </button>
        </div>

        {/* OTP */}
        {message && (
          <p
            style={{
              wordBreak: "break-word",
              marginTop: "10px",
              color: isError ? "red" : "green",
            }}
          >
            {message}
          </p>
        )}

        {step === "email" && (
          <div>
            <input
              className="text-box"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="forgot-password-button">
              Submit
            </button>
          </div>
        )}

        {step === "otp" && (
          <div>
            <input
              className="text-box"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP code"
              required
            />
            <button
              type="button"
              className="forgot-password-button"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>

            {/* Request new otp */}
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <span style={{ fontSize: "14px", color: "#555" }}>
                Didn't receive a code?&nbsp;
              </span>
              <span
                type="button"
                className="resend-link-btn"
                disabled={newOtp} // Use the variable, not the function
                onClick={(e) => handleSubmit(e, "resend")}
                style={{
                  background: "none",
                  border: "none",
                  color: newOtp ? "#0011ffff" : "#007bff", // Use the variable
                  textDecoration: "underline",
                  cursor: newOtp ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                {newOtp ? "Sending..." : "Click here to request new OTP code"}
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
