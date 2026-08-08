import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LOGO */}
        <div className="login-logo">
          <div className="logo-circle">
            <FaLeaf />
          </div>

          <h1>FarmVerse</h1>

          <p>Welcome back, Farmer</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>

            <div className="input-box">
              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <div className="password-heading">
              <label>Password</label>

              <button
                type="button"
                onClick={() => alert("Forgot password feature coming soon!")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="input-box">
              <FaLock />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* LOGIN */}
          <button className="login-btn" type="submit">
            Login
            <FaArrowRight />
          </button>
        </form>

        {/* DIVIDER */}
        <div className="divider">
          <span>or continue with</span>
        </div>

        {/* GOOGLE */}
        <button className="google-btn">
          <FaGoogle />
          Continue with Google
        </button>

        {/* SIGNUP */}
        <div className="signup">
          <span>Don't have an account?</span>

          <button onClick={() => navigate("/signup")}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
