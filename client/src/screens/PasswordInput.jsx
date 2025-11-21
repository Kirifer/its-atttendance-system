import { useState } from "react";
import "../styles/PasswordInput.css";

export default function PasswordInput({ value, onChange, error }) { 
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-input-container">
    )