import { useState } from "react";
import "../styles/PasswordInput.css";

export default function PasswordInput({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  newPassword,
  confirmNewPassword,
  onNewChange,
  onConfirmNewChange,
  error,
  showConfirm = false,
  showNew = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <div className="password-wrapper">
      {/* Password */}
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

      {/* Confirm Password */}
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

      {/* New Password + Confirm New Password */}
      {showNew && (
        <>
          <div className="input-group">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="text-box password-input"
              value={newPassword}
              onChange={onNewChange}
              required
            />
            <span
              className="material-symbols-outlined eye-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "visibility" : "visibility_off"}
            </span>
          </div>

          <div className="input-group">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="text-box password-input"
              value={confirmNewPassword}
              onChange={onConfirmNewChange}
              required
            />
            <span
              className="material-symbols-outlined eye-icon"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? "visibility" : "visibility_off"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
