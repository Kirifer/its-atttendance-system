import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
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
      const { token } = await loginUser(email, password);
      localStorage.setItem("token", token);

      setFieldErrors({ ...fieldErrors, general: "Login successful!" });
      navigate("/dashboard");
    } catch (err) {
      const message = err.message;

      if (message.toLowerCase().includes("does not exist")) {
        setFieldErrors({ ...fieldErrors, email: message });
      } else if (message.toLowerCase().includes("incorrect password")) {
        setFieldErrors({ ...fieldErrors, password: message });
      } else {
        setFieldErrors({ ...fieldErrors, general: message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button onClick={() => navigate("/")}>Return to home</button>
      <button type="submit">Login</button>

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
    </form>
  );
}

export default Login;
