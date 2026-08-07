import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🌿</div>

        <h1>FarmVerse</h1>

        <p>Welcome back, Farmer</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <div className="login-links">
          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>

          <span onClick={() => navigate("/signup")}>Create Account</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
