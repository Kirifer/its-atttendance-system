import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api/auth";
import "../styles/Signup.css";
import PasswordInput from "../components/PasswordInput";
import SignupSuccess from "../components/SignupSuccess";
import Loader from "../components/Loader";
import API from "../api/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const navigate = useNavigate();

  // Clear messages
  const clearMessages = () => {
    setTimeout(() => {
      setFieldErrors({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        general: "",
      });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });
    setLoading(true);

    if (password !== confirmPassword) {
      setFieldErrors({ general: "Passwords do not match!" });
      clearMessages();
      setLoading(false);
      return;
    }

    try {
      const { token } = await signUpUser(
        username,
        email,
        password,
        confirmPassword,
      );
      localStorage.setItem("token", token);

      setShowSuccessPopup(true);
      clearMessages();
    } catch (err) {
      const message = err.message.toLowerCase();

      if (message.includes("already exist")) {
        setFieldErrors({ general: "User already exists!" });
        clearMessages();
        return;
      }

      setFieldErrors({ general: err.message });
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-background">
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (showSuccessPopup) return;

          if (e.key === "Enter" || e.key === "NumpadEnter") {
            handleSubmit(e);
          }
        }}
        className="signup-box"
      >
        <div className="top-box-header">
          <p className="signup-text"></p>
          <button className="close-btn" onClick={() => navigate("/")}>
            X
          </button>
        </div>

        {/* Error message */}
        {fieldErrors.general && (
          <p
            style={{
              color:
                fieldErrors.general === "Login successful!" ? "green" : "red",
              marginTop: "10px",
            }}
          >
            {fieldErrors.general}
          </p>
        )}

        <div>
          <input
            className="text-box"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            className="text-box"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="signup-eye-wrapper">
          <PasswordInput
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onConfirmChange={(e) => setConfirmPassword(e.target.value)}
            showConfirm={true}
          />
        </div>

        {/* Buttons */}
        <button className="signup-button" type="submit">
          Sign Up
        </button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/")} className="link-text">
            Click here to log in.
          </span>
        </p>
      </form>

      {showSuccessPopup && (
        <SignupSuccess
          message="Registration successful. Your account is currently pending administrative activation."
          onClose={() => {
            localStorage.removeItem("token");
            setShowSuccessPopup(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
}

export default Signup;
