import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api/auth";
import "../styles/Signup.css";
import PasswordInput from "../components/PasswordInput";
import API from "../api/api";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({ general: "" });

    if (password !== confirmPassword) {
      setFieldErrors({ general: "Passwords do not match" });
      return;
    }

    try {
      const { token } = await signUpUser(username, email, password);
      localStorage.setItem("token", token);

      setShowSuccessPopup(true);
    } catch (err) {
      const message = err.message.toLowerCase();

      if (message.includes("already exist")) {
        setFieldErrors({ general: "User already exists!!!" });
        return;
      }

      setFieldErrors({ general: err.message });
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleSubmit} class="signup-box">
        <div className="top-box-header">
          <p class="signup-text">Sign Up</p>
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
            class="text-box"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            class="text-box"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <PasswordInput
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmChange={(e) => setConfirmPassword(e.target.value)}
          showConfirm={true}
        />

        {/* Buttons */}
        <button class="signup-button" type="submit">
          Sign Up
        </button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="link-text">
            Click here to log in.
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
