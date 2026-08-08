import React from "react";
import {
  FaLeaf,
  FaHome,
  FaSeedling,
  FaVirus,
  FaCloudSun,
  FaChartLine,
  FaRobot,
  FaBars,
  FaBell,
  FaUserCircle,
  FaUser,
  FaTint,
  FaTemperatureHigh,
  FaArrowUp,
  FaCog,
  FaArrowDown,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import "./Dashboard.css";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-page">
      {/* ================= MOBILE TOPBAR ================= */}
      <header className="mobile-topbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        <div className="mobile-logo">
          <FaLeaf />
          <span>FarmVerse</span>
        </div>

        <FaBell className="mobile-bell" />
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* LOGO */}
        <div className="dashboard-logo">
          <FaLeaf />
          <span>FarmVerse</span>
        </div>

        {/* MAIN MENU */}
        <div className="sidebar-menu">
          <p className="menu-label">MAIN MENU</p>

          <a
            className="sidebar-link active"
            href="#dashboard"
            onClick={closeSidebar}
          >
            <FaHome />
            <span>Dashboard</span>
          </a>

          <a className="sidebar-link" href="#farm" onClick={closeSidebar}>
            <FaSeedling />
            <span>My Farm</span>
          </a>

          <a
            className="sidebar-link"
            href="#crop-prediction"
            onClick={closeSidebar}
          >
            <FaSeedling />
            <span>Crop Prediction</span>
          </a>

          <a className="sidebar-link" href="#disease" onClick={closeSidebar}>
            <FaVirus />
            <span>Disease Detection</span>
          </a>

          <a className="sidebar-link" href="#weather" onClick={closeSidebar}>
            <FaCloudSun />
            <span>Weather</span>
          </a>

          <a className="sidebar-link" href="#market" onClick={closeSidebar}>
            <FaChartLine />
            <span>Market Analysis</span>
          </a>

          {/* TOOLS */}
          <p className="menu-label second-label">TOOLS</p>

          <a className="sidebar-link" href="#ai" onClick={closeSidebar}>
            <FaRobot />
            <span>AI Assistant</span>
          </a>
        </div>

        {/* ================= SIDEBAR BOTTOM ================= */}
        <div className="sidebar-bottom">
          {/* HELP */}
          <div className="sidebar-help">
            <FaRobot />

            <div>
              <strong>Need Help?</strong>
              <span>Ask FarmVerse AI</span>
            </div>
          </div>

          {/* PROFILE */}
          <a
            className="sidebar-bottom-link"
            href="/profile"
            onClick={closeSidebar}
          >
            <FaUserCircle />

            <div>
              <strong>Profile</strong>
              <span>My Account</span>
            </div>
          </a>

          {/* SETTINGS */}
          <a
            className="sidebar-bottom-link"
            href="/settings"
            onClick={closeSidebar}
          >
            <FaCog />

            <div>
              <strong>Settings</strong>
              <span>Preferences</span>
            </div>
          </a>
        </div>
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="dashboard-main">
        {/* ================= HEADER ================= */}
        <div className="dashboard-header">
          <div>
            <span className="dashboard-greeting">GOOD MORNING 👋</span>

            <h1>Welcome to FarmVerse</h1>

            <p>Monitor your farm and make smarter farming decisions with AI.</p>
          </div>

          <div className="header-actions">
            <button className="notification-btn" aria-label="Notifications">
              <FaBell />
              <span></span>
            </button>

            <div className="profile-box">
              <FaUserCircle />

              <div>
                <strong>Farmer</strong>
                <small>Farm Owner</small>
              </div>
            </div>
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}
        <section className="dashboard-section" id="dashboard">
          <div className="section-heading">
            <div>
              <span>OVERVIEW</span>
              <h2>Farm Overview</h2>
            </div>

            <button className="view-btn">View Details →</button>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon green">
                <FaSeedling />
              </div>

              <div className="overview-info">
                <span>Crop Health</span>
                <h3>92%</h3>

                <small className="positive">
                  <FaArrowUp />
                  4.5% this week
                </small>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon blue">
                <FaTint />
              </div>

              <div className="overview-info">
                <span>Soil Moisture</span>
                <h3>65%</h3>

                <small className="positive">
                  <FaArrowUp />
                  Optimal level
                </small>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon orange">
                <FaTemperatureHigh />
              </div>

              <div className="overview-info">
                <span>Temperature</span>
                <h3>29°C</h3>
                <small>Sunny · Pune</small>
              </div>
            </div>

            <div className="overview-card">
              <div className="overview-icon purple">
                <FaChartLine />
              </div>

              <div className="overview-info">
                <span>Market Price</span>
                <h3>₹2,350</h3>

                <small className="positive">
                  <FaArrowUp />
                  8.2% today
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MIDDLE CONTENT ================= */}
        <section className="dashboard-content-grid">
          {/* CROP HEALTH */}
          <div className="dashboard-card crop-health-card">
            <div className="card-header">
              <div>
                <span>CROP MONITORING</span>
                <h2>Crop Health</h2>
              </div>

              <button>Weekly ▾</button>
            </div>

            <div className="health-content">
              <div className="health-circle">
                <div>
                  <strong>92%</strong>
                  <span>Healthy</span>
                </div>
              </div>

              <div className="health-details">
                <div className="health-row">
                  <span>
                    <i className="dot healthy"></i>
                    Healthy Crops
                  </span>

                  <strong>92%</strong>
                </div>

                <div className="health-row">
                  <span>
                    <i className="dot warning"></i>
                    Need Attention
                  </span>

                  <strong>6%</strong>
                </div>

                <div className="health-row">
                  <span>
                    <i className="dot danger"></i>
                    Critical
                  </span>

                  <strong>2%</strong>
                </div>
              </div>
            </div>

            <div className="crop-status">
              <FaCheckCircle />

              <div>
                <strong>Excellent crop condition</strong>

                <p>Your crops are growing healthy.</p>
              </div>
            </div>
          </div>

          {/* WEATHER */}
          <div className="dashboard-card weather-dashboard-card" id="weather">
            <div className="card-header">
              <div>
                <span>WEATHER INTELLIGENCE</span>
                <h2>Today's Weather</h2>
              </div>

              <FaCloudSun className="weather-title-icon" />
            </div>

            <div className="weather-main">
              <div>
                <FaCloudSun className="big-weather-icon" />

                <strong>29°C</strong>

                <span>Partly Cloudy</span>
              </div>

              <div className="location">
                <strong>Pune, India</strong>
                <span>Today, 7 Aug 2026</span>
              </div>
            </div>

            <div className="weather-details">
              <div>
                <FaTint />
                <span>Humidity</span>
                <strong>68%</strong>
              </div>

              <div>
                <FaCloudSun />
                <span>Rain Chance</span>
                <strong>20%</strong>
              </div>

              <div>
                <FaTemperatureHigh />
                <span>Wind</span>
                <strong>12 km/h</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI RECOMMENDATION ================= */}
        <section className="ai-recommendation" id="ai">
          <div className="ai-icon-box">
            <FaRobot />
          </div>

          <div className="ai-content">
            <span>FARMVERSE AI RECOMMENDATION</span>

            <h2>Smart recommendation for your farm</h2>

            <p>
              Based on your soil moisture, weather conditions and crop health,
              your farm is currently in good condition. No irrigation is
              required today.
            </p>
          </div>

          <button className="ai-button">
            Ask AI <FaArrowUp />
          </button>
        </section>

        {/* ================= BOTTOM GRID ================= */}
        <section className="bottom-dashboard-grid">
          {/* MARKET */}
          <div className="dashboard-card market-dashboard-card" id="market">
            <div className="card-header">
              <div>
                <span>MARKET ANALYSIS</span>
                <h2>Market Prices</h2>
              </div>

              <button>View Market →</button>
            </div>

            <div className="market-list">
              <div className="market-item">
                <div className="crop-name">
                  <div className="crop-small-icon">
                    <FaSeedling />
                  </div>

                  <div>
                    <strong>Wheat</strong>
                    <span>Per Quintal</span>
                  </div>
                </div>

                <div className="market-price">
                  <strong>₹2,350</strong>

                  <span className="up">
                    <FaArrowUp />
                    8.2%
                  </span>
                </div>
              </div>

              <div className="market-item">
                <div className="crop-name">
                  <div className="crop-small-icon">
                    <FaSeedling />
                  </div>

                  <div>
                    <strong>Rice</strong>
                    <span>Per Quintal</span>
                  </div>
                </div>

                <div className="market-price">
                  <strong>₹3,120</strong>

                  <span className="up">
                    <FaArrowUp />
                    5.4%
                  </span>
                </div>
              </div>

              <div className="market-item">
                <div className="crop-name">
                  <div className="crop-small-icon">
                    <FaSeedling />
                  </div>

                  <div>
                    <strong>Cotton</strong>
                    <span>Per Quintal</span>
                  </div>
                </div>

                <div className="market-price">
                  <strong>₹7,180</strong>

                  <span className="down">
                    <FaArrowDown />
                    2.1%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <div>
                <span>ACTIVITY</span>
                <h2>Recent Activity</h2>
              </div>

              <button>See All</button>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  <FaCheckCircle />
                </div>

                <div>
                  <strong>Crop health checked</strong>
                  <span>Today · 10:30 AM</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon weather">
                  <FaCloudSun />
                </div>

                <div>
                  <strong>Weather updated</strong>
                  <span>Today · 09:15 AM</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon warning">
                  <FaExclamationTriangle />
                </div>

                <div>
                  <strong>Market price changed</strong>
                  <span>Yesterday · 06:40 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          © 2026 FarmVerse · Smart Farming Powered by AI
        </footer>
      </main>

      {/* ================= MOBILE + TABLET BOTTOM NAV ================= */}
      <nav className="mobile-bottom-nav">
        <button className="mobile-nav-item active">
          <FaHome />
          <span>Home</span>
        </button>

        <button className="mobile-nav-item">
          <FaLeaf />
          <span>Field</span>
        </button>

        <button className="mobile-nav-item">
          <FaChartLine />
          <span>Market</span>
        </button>

        <button className="mobile-nav-item">
          <FaUser />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
