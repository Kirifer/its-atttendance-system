import React from "react";
import "../styles/SuccessPopup.css";

export default function Popup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        <button onClick={onClose}>Proceed</button>
      </div>
    </div>
  );
}
