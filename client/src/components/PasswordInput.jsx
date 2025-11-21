import { useState } from "react";
import "../styles/PasswordInput.css";

export default function PasswordInput({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  error,
  showConfirm = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="text-box password-input"
          value={password}
          onChange={onPasswordChange}
          required
        />
        <span
          className="material-symbols-outlined eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "visibility" : "visibility_off"}
        </span>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showConfirm && (
        <div className="input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="text-box password-input"
            value={confirmPassword}
            onChange={onConfirmChange}
            required
          />
          <span
            className="material-symbols-outlined eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "visibility" : "visibility_off"}
          </span>
        </div>
      )}
    </div>
  );
}
