import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api/auth";
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
    <form onSubmit={handleSubmit}>
      <div>
        <input
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

      <button onClick={() => navigate("/")}>Return to home</button>
      <button type="submit">Sign Up</button>

      {fieldErrors.general && (
        <p style={{ color: "green", marginTop: "10px" }}>
          {fieldErrors.general}
        </p>
      )}
    </form>
  );
}

export default Signup;
