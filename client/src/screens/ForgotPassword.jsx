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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email); // use service function
      setMessage(res.message || "The OTP has been sent to your email."); // DEV mode shows reset link
      setIsError(false);
      setStep("otp");
      if (res.resetUrl) {
        console.log("Password reset link:", res.resetUrl);
      }
    } catch (err) {
      setMessage(err.message || "An error occurred. Please try again.");
      setIsError(true);

      setTimeout(() => {
        setMessage("");
        setIsError(false);
      }, 5000);
    }
  };

  // handle otp
  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp(email, otp);
      navigate(res.resetUrl.replace(process.env.REACT_APP_API_URL, ""));
    } catch (err) {
      setMessage(err.message || "Invalid OTP.");
      setIsError(true);
    }

    setTimeout(() => {
      setMessage("");
      setIsError(false);
    }, 5000);
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleSubmit} className="forgot-password-box">
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
            <button
              type="button"
              className="forgot-password-button"
              onClick={handleSubmit}
            >
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
              placeholder="Enter OTP"
              required
            />
            <button
              type="button"
              className="forgot-password-button"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
