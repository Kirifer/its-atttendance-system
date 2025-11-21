import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api/auth";
import "../styles/Signup.css";
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
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    if (password !== confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    try {
      const { token } = await signUpUser(username, email, password);
      localStorage.setItem("token", token);

      setFieldErrors({
        ...fieldErrors,
        general: "User has been created succesfully!",
      });
      navigate("/login");
    } catch (err) {
      const message = err.message;

      if (message.toLowerCase().includes("already exist")) {
        setFieldErrors({ ...fieldErrors, email: message });
      } else {
        setFieldErrors({ ...fieldErrors, general: message });
      }
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

        <div>
          <input
            class="text-box"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {fieldErrors.username && (
            <p style={{ color: "red" }}>{fieldErrors.username}</p>
          )}
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
          {fieldErrors.email && (
            <p style={{ color: "red" }}>{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <input
            class="text-box"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && (
            <p style={{ color: "red" }}>{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <input
            class="text-box"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {fieldErrors.confirmPassword && (
            <p style={{ color: "red" }}>{fieldErrors.confirmPassword}</p>
          )}
        </div>

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

        {fieldErrors.general && (
          <p style={{ color: "green", marginTop: "10px" }}>
            {fieldErrors.general}
          </p>
        )}
      </form>
    </div>
  );
}

export default Signup;
