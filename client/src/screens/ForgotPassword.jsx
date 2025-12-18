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
      }, 10000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid email!";
      setMessage(errorMsg);
      setIsError(true);

      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 10000);
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
    <div className="forgot-background">
      <form
        onSubmit={(e) => handleSubmit(e, "initial")}
        className="forgot-password-box"
      >
        <div className="top-box-header">
          <p className="forgot-password-text">
            {step === "email"
              ? "Enter your email address and we'll send you a verification code to reset your password."
              : `Please enter the 6-digit code sent to ${email} to verify your identity.`}
          </p>

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
              <button
                type="button"
                className="resend-link-btn"
                disabled={newOtp}
                onClick={(e) => !newOtp && handleSubmit(e, "resend")}
                style={{
                  color: newOtp ? "#555" : "#1a5dac",
                }}
              >
                {newOtp ? "Sending..." : "Click here to request new OTP code"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
