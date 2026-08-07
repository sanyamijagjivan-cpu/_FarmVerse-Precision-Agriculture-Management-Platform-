import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email) {
      alert("Password reset link sent to your email");
      navigate("/login");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <div className="forgot-logo">🔒</div>

        <h1>Forgot Password?</h1>

        <p>Enter your email to reset your password</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">Reset Password</button>
        </form>

        <span className="back-login" onClick={() => navigate("/login")}>
          Back to Login
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;
