import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaRobot,
  FaCloudSun,
  FaChartLine,
  FaArrowRight,
  FaUsers,
  FaTint,
  FaClock,
  FaBullseye,
  FaUserCircle,
  FaStar,
  FaUser,
} from "react-icons/fa";

import dashboardImage from "../../assets/dashboard-circle.png";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m",
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Weather request failed");
        }
        return res.json();
      })
      .then((data) => {
        setWeather(data.current);
      })
      .catch((err) => {
        console.error("Weather Error:", err);
      });
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="logo">
          <FaLeaf className="logo-icon" />
          <span>FarmVerse</span>
        </div>

        <nav>
          <a className="active" href="#home">
            Home
          </a>

          <a href="#features">Features</a>

          <a href="#technology">Technology</a>

          <a href="#about">About</a>

          <button onClick={() => navigate("/login")}>Login</button>
        </nav>
      </header>

      {/* ================= MAIN ================= */}

      <main>
        {/* ================= HERO ================= */}

        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-tag">
              <FaRobot />
              <span>AI Powered Agriculture Platform</span>
            </div>

            <h1>
              Transform Farming
              <br />
              With <span>Artificial</span>
              <br />
              <span>Intelligence</span>
            </h1>

            <p>
              FarmVerse empowers farmers with AI-driven crop prediction, disease
              detection, weather intelligence and market analysis for smarter
              farming.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <FaArrowRight />
              </button>

              <button className="secondary-btn" onClick={scrollToFeatures}>
                Explore Features
              </button>
            </div>

            <div className="trusted-farmers">
              <div className="avatar-stack">
                <FaUserCircle />
                <FaUserCircle />
                <FaUserCircle />
              </div>

              <div>
                <strong>10,000+ Farmers</strong>
                <span>Trust FarmVerse</span>
              </div>
            </div>
          </div>

          {/* ================= HERO DASHBOARD ================= */}

          <div className="hero-dashboard">
            <div className="dashboard-wrapper">
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>

              <img
                src={dashboardImage}
                alt="FarmVerse smart farming dashboard"
                className="dashboard-image"
              />

              {/* WEATHER */}

              <div className="floating-card weather-card">
                <FaCloudSun />

                <div>
                  <h3>{weather ? `${weather.temperature_2m}°C` : "29°C"}</h3>

                  <p>Live Weather</p>

                  <span>Pune, India</span>
                </div>
              </div>

              {/* CROP HEALTH */}

              <div className="floating-card crop-card">
                <FaLeaf />

                <div>
                  <h3>92%</h3>
                  <p>Crop Health</p>
                  <span>Excellent</span>
                </div>
              </div>

              {/* SOIL MOISTURE */}

              <div className="floating-card moisture-card">
                <FaTint />

                <div>
                  <h3>65%</h3>
                  <p>Soil Moisture</p>
                  <span>Good</span>
                </div>
              </div>

              {/* MARKET */}

              <div className="floating-card market-card">
                <FaChartLine />

                <div>
                  <h3>₹2350</h3>
                  <p>Market Price</p>
                  <span>Per Quintal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="stats" aria-label="FarmVerse statistics">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>

            <div>
              <h2>10K+</h2>
              <p>Happy Farmers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaBullseye />
            </div>

            <div>
              <h2>95%</h2>
              <p>Prediction Accuracy</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaLeaf />
            </div>

            <div>
              <h2>50+</h2>
              <p>Supported Crops</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClock />
            </div>

            <div>
              <h2>24/7</h2>
              <p>AI Support</p>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        <section className="features" id="features">
          <div className="section-title">
            <span className="heading">OUR FEATURES</span>

            <h2>Smart Farming Solutions</h2>

            <p>Advanced AI technology to empower modern agriculture.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaRobot />
              </div>

              <div>
                <h3>AI Crop Prediction</h3>

                <p>
                  Get accurate crop recommendations using AI and climate
                  analysis.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaLeaf />
              </div>

              <div>
                <h3>Disease Detection</h3>

                <p>
                  Detect crop diseases early using intelligent image analysis.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCloudSun />
              </div>

              <div>
                <h3>Weather Forecast</h3>

                <p>
                  Real-time weather updates and forecasts for better planning.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>

              <div>
                <h3>Market Analysis</h3>

                <p>Track market prices and trends to maximize your profits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}

        <section className="how-it-works">
          <div className="section-title">
            <span className="heading">HOW IT WORKS</span>

            <h2>Start Smart Farming in Four Steps</h2>

            <p>A simple process designed for every farmer.</p>
          </div>

          <div className="steps">
            {[
              [
                "1",
                "Create Account",
                "Sign up and access your smart farming dashboard.",
              ],
              [
                "2",
                "Add Farm Details",
                "Enter crop, soil and location information.",
              ],
              [
                "3",
                "AI Analysis",
                "FarmVerse analyzes your farm using AI models.",
              ],
              [
                "4",
                "Get Recommendations",
                "Receive predictions, alerts and weather insights.",
              ],
            ].map(([number, title, text]) => (
              <div className="step-card" key={number}>
                <div className="step-number">{number}</div>

                <h3>{title}</h3>

                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= WHY FARMVERSE ================= */}

        <section className="why-choose" id="about">
          <div className="section-title">
            <span className="heading">WHY FARMVERSE</span>

            <h2>Built for Smarter Decisions</h2>

            <p>Powerful tools that make farming easier and more profitable.</p>
          </div>

          <div className="why-grid">
            {[
              [
                <FaRobot />,
                "AI Powered",
                "Advanced AI helps you make better farming decisions.",
              ],
              [
                <FaCloudSun />,
                "Live Weather",
                "Real-time weather updates support better planning.",
              ],
              [
                <FaLeaf />,
                "Healthy Crops",
                "Monitor crop health and improve productivity.",
              ],
              [
                <FaChartLine />,
                "Higher Profit",
                "Analyze market prices and maximize earnings.",
              ],
            ].map(([icon, title, text]) => (
              <div className="why-card" key={title}>
                <div className="why-icon">{icon}</div>

                <h3>{title}</h3>

                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TECHNOLOGY ================= */}

        <section className="technology" id="technology">
          <div className="section-title">
            <span className="heading">OUR TECHNOLOGY</span>

            <h2>Technology Behind FarmVerse</h2>

            <p>Modern technologies powering smart farming solutions.</p>
          </div>

          <div className="tech-grid">
            {[
              [
                <FaRobot />,
                "Artificial Intelligence",
                "Smart crop prediction and intelligent recommendations.",
              ],
              [
                <FaCloudSun />,
                "Weather API",
                "Real-time weather forecasting for better planning.",
              ],
              [
                <FaChartLine />,
                "Data Analytics",
                "Analyze farming data and improve productivity.",
              ],
              [
                <FaLeaf />,
                "Smart Agriculture",
                "Modern farming techniques powered by technology.",
              ],
            ].map(([icon, title, text]) => (
              <div className="tech-card" key={title}>
                <div className="tech-icon">{icon}</div>

                <h3>{title}</h3>

                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= AI ASSISTANT ================= */}

        <section className="ai-assistant">
          <div className="section-title">
            <span className="heading">AI ASSISTANT</span>

            <h2>FarmVerse AI Assistant</h2>

            <p>Get smart farming recommendations in a simple conversation.</p>
          </div>

          <div className="chat-box">
            <div className="chat user-chat">
              <div className="chat-message user-message">
                Which crop is best for my farm?
              </div>

              <div className="chat-icon user-icon">
                <FaUser />
              </div>
            </div>

            <div className="chat ai-chat">
              <div className="chat-icon ai-icon">
                <FaRobot />
              </div>

              <div className="chat-message ai-message">
                <h4>FarmVerse AI</h4>

                <p>
                  Based on your soil and weather conditions, Wheat is
                  recommended for maximum yield.
                </p>
              </div>
            </div>

            <div className="chat user-chat">
              <div className="chat-message user-message">
                Should I irrigate today?
              </div>

              <div className="chat-icon user-icon">
                <FaUser />
              </div>
            </div>

            <div className="chat ai-chat">
              <div className="chat-icon ai-icon">
                <FaRobot />
              </div>

              <div className="chat-message ai-message">
                <h4>FarmVerse AI</h4>

                <p>
                  No irrigation is required today. Rainfall is expected within
                  the next 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}

        <section className="testimonials">
          <div className="section-title">
            <span className="heading">TESTIMONIALS</span>

            <h2>What Farmers Say</h2>

            <p>
              Trusted by farmers across India for smarter farming decisions.
            </p>
          </div>

          <div className="testimonial-grid">
            {[
              [
                "Rahul Patil",
                "Maharashtra",
                "FarmVerse helped me choose the right crop and increased my production significantly.",
              ],
              [
                "Priya Deshmukh",
                "Karnataka",
                "The weather forecast and AI recommendations are accurate and easy to understand.",
              ],
              [
                "Amit Shinde",
                "Madhya Pradesh",
                "Disease detection saved my crop from major damage. Excellent platform.",
              ],
            ].map(([name, state, quote]) => (
              <div className="testimonial-card" key={name}>
                <FaUserCircle className="testimonial-icon" />

                <h3>{name}</h3>

                <span>{state}</span>

                <p>{quote}</p>

                <div className="stars">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="cta">
          <h2>Ready to Transform Your Farm?</h2>

          <p>
            Join FarmVerse and make smarter decisions with AI-powered
            agriculture.
          </p>

          <button onClick={() => navigate("/signup")}>
            Create Free Account
            <FaArrowRight />
          </button>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer>
        <p>
          © 2026 FarmVerse. Smart farming powered by Artificial Intelligence.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
