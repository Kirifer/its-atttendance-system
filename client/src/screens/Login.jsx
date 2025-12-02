import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import "../styles/Login.css";
import PasswordInput from "../components/PasswordInput";
import API from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({
      email: "",
      password: "",
      general: "",
    });

    try {
      const { token, user } = await loginUser(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setFieldErrors({ ...fieldErrors, general: "Login successful!" });
      setTimeout(() => {
        setFieldErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);

      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setFieldErrors({ email: "", password: "", general: message });

      setTimeout(() => {
        setFieldErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleSubmit} className="login-box">
        <div className="top-box-header">
          <p className="login-text">Log in</p>
          <button className="close-btn" onClick={() => navigate("/")}>
            X
          </button>
        </div>

        {/* Error Messages */}
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <PasswordInput
          password={password}
          onPasswordChange={(e) => setPassword(e.target.value)}
          showConfirm={false} // login doesn’t need confirm
        />

        {/* Buttons */}
        <p onClick={() => navigate("/forgot-password")} className="link-text">
          Forgot Password?
        </p>
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/sign-up")} className="link-text">
            Click here to sign up.
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
