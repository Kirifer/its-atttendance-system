import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/Login.css";
import PasswordInput from "../components/PasswordInput";
import Loader from "../components/Loader";
import API from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({
      email: "",
      password: "",
      general: "",
    });
    setLoading(true);

    try {
      const { token } = await loginUser(email, password);

      localStorage.setItem("token", token);
      await fetchUser();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      {loading && <Loader />}
      <form onSubmit={handleSubmit} className="login-box">
        <img src="/its-logo.png" alt="ITS Logo" className="login-logo" />

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

        <div className="login-eye-wrapper">
          <PasswordInput
            password={password}
            onPasswordChange={(e) => setPassword(e.target.value)}
            showConfirm={false}
          />
        </div>

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
