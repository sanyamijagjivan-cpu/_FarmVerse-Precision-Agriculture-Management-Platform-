import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo-circle">🌿</div>

      <h1>FarmVerse</h1>

      <p>Smart Farming Solution</p>

      <div className="loader"></div>
    </div>
  );
};

export default Splash;
