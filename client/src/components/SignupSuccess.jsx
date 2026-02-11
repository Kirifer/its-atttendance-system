import React, { useEffect, useRef } from "react";
import "../styles/SignupSuccess.css";

export default function SuccessPopup({ message, onClose }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "NumpadEnter" || e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div className="signup-success-overlay">
      <div className="signup-success-box">
        <p>{message}</p>
        <button ref={buttonRef} onClick={onClose} type="button">
          Proceed
        </button>
      </div>
    </div>
  );
}
