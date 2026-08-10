import React from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  /* ================= NOTIFICATIONS ================= */

  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      icon: "🌧️",
      title: "Weather Alert",
      message: "Rain expected tomorrow.",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      icon: "💧",
      title: "Irrigation",
      message: "No irrigation needed today.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      icon: "🌱",
      title: "Crop Health",
      message: "Your crops are 92% healthy.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 4,
      icon: "📈",
      title: "Market Update",
      message: "Cotton price increased by 8.2%.",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 5,
      icon: "⚠️",
      title: "Disease Alert",
      message: "Check your crop health.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  /* ================= SIDEBAR ================= */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const goToProfile = () => {
    closeSidebar();
    navigate("/profile");
  };

  const goToSettings = () => {
    closeSidebar();
    navigate("/settings");
  };

  /* ================= SCROLL ================= */

  const scrollToSection = (id) => {
    closeSidebar();

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ================= NOTIFICATION PANEL ================= */

  const NotificationPanel = () => (
    <div className="notification-dropdown">
      <div className="notification-header">
        <div>
          <h3>Notifications</h3>

          <span>
            {unreadCount === 0 ? "All caught up" : `${unreadCount} unread`}
          </span>
        </div>

        <button className="mark-read-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.unread ? "unread" : ""
            }`}
          >
            <div className="notification-icon">{notification.icon}</div>

            <div className="notification-content">
              <div className="notification-title-row">
                <strong>{notification.title}</strong>

                {notification.unread && <span className="unread-dot"></span>}
              </div>

              <p>{notification.message}</p>

              <small>{notification.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* =====================================================
          MOBILE TOPBAR
      ===================================================== */}

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

        <div className="notification-wrapper">
          <button
            className="mobile-notification-btn"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <FaBell />

            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {notificationsOpen && <NotificationPanel />}
        </div>
      </header>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* LOGO */}

        <div className="dashboard-logo">
          <FaLeaf />
          <span>FarmVerse</span>
        </div>

        {/* MAIN MENU */}

        <div className="sidebar-menu">
          <p className="menu-label">MAIN MENU</p>

          <button
            className="sidebar-link active"
            onClick={() => scrollToSection("dashboard")}
          >
            <FaHome />
            <span>Dashboard</span>
          </button>

          <button className="sidebar-link" onClick={() => navigate("/my-farm")}>
            <FaSeedling />
            <span>My Farm</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollToSection("crop-prediction")}
          >
            <FaSeedling />
            <span>Crop Prediction</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollToSection("disease")}
          >
            <FaVirus />
            <span>Disease Detection</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollToSection("weather")}
          >
            <FaCloudSun />
            <span>Weather</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => scrollToSection("market")}
          >
            <FaChartLine />
            <span>Market Analysis</span>
          </button>

          <p className="menu-label second-label">TOOLS</p>

          <button
            className="sidebar-link"
            onClick={() => navigate("/ai-assistant")}
          >
            <FaRobot />
            <span>AI Assistant</span>
          </button>
        </div>

        {/* =====================================================
            SIDEBAR BOTTOM
        ===================================================== */}

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

          <button className="sidebar-bottom-link" onClick={goToProfile}>
            <FaUserCircle />

            <div>
              <strong>Profile</strong>
              <span>My Account</span>
            </div>
          </button>

          {/* SETTINGS */}

          <button className="sidebar-bottom-link" onClick={goToSettings}>
            <FaCog />

            <div>
              <strong>Settings</strong>
              <span>Preferences</span>
            </div>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="dashboard-header">
          <div>
            <span className="dashboard-greeting">GOOD MORNING 👋</span>

            <h1>Welcome to FarmVerse</h1>

            <p>Monitor your farm and make smarter farming decisions with AI.</p>
          </div>

          <div className="header-actions">
            {/* NOTIFICATION */}

            <div className="notification-wrapper">
              <button
                className="notification-btn"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label="Notifications"
              >
                <FaBell />

                {unreadCount > 0 && <span className="notification-dot"></span>}
              </button>

              {notificationsOpen && <NotificationPanel />}
            </div>

            {/* PROFILE */}

            <button className="profile-box" onClick={goToProfile}>
              <FaUserCircle />

              <div>
                <strong>Farmer</strong>
                <small>Farm Owner</small>
              </div>
            </button>
          </div>
        </div>

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        <section className="dashboard-section" id="dashboard">
          <div className="section-heading">
            <div>
              <span>OVERVIEW</span>
              <h2>Farm Overview</h2>
            </div>

            <button className="view-btn">View Details →</button>
          </div>

          <div className="overview-grid">
            {/* CROP HEALTH */}

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

            {/* SOIL MOISTURE */}

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

            {/* TEMPERATURE */}

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

            {/* MARKET PRICE */}

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

        {/* =====================================================
            MY FARM
        ===================================================== */}

        <section className="dashboard-section" id="farm">
          <div className="section-heading">
            <div>
              <span>MY FARM</span>
              <h2>Farm Information</h2>
            </div>
          </div>

          <div className="farm-summary-grid">
            <div className="farm-summary-card">
              <FaSeedling />

              <div>
                <span>Total Farm Area</span>
                <strong>2.5 Acres</strong>
              </div>
            </div>

            <div className="farm-summary-card">
              <FaLeaf />

              <div>
                <span>Main Crop</span>
                <strong>Cotton</strong>
              </div>
            </div>

            <div className="farm-summary-card">
              <FaTint />

              <div>
                <span>Irrigation</span>
                <strong>Drip Irrigation</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CROP PREDICTION
        ===================================================== */}

        <section
          className="dashboard-section simple-feature-section"
          id="crop-prediction"
        >
          <div className="feature-placeholder">
            <div className="feature-placeholder-icon">
              <FaSeedling />
            </div>

            <div>
              <span>CROP INTELLIGENCE</span>

              <h2>Crop Prediction</h2>

              <p>
                Get AI-powered crop recommendations based on your farm
                conditions.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            DISEASE DETECTION
        ===================================================== */}

        <section
          className="dashboard-section simple-feature-section"
          id="disease"
        >
          <div className="feature-placeholder">
            <div className="feature-placeholder-icon red">
              <FaVirus />
            </div>

            <div>
              <span>CROP HEALTH</span>

              <h2>Disease Detection</h2>

              <p>Detect possible crop diseases using AI-powered analysis.</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            MIDDLE CONTENT
        ===================================================== */}

        <section className="dashboard-content-grid">
          {/* =================================================
              CROP HEALTH
          ================================================= */}

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

          {/* =================================================
              WEATHER
          ================================================= */}

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

        {/* =====================================================
            AI RECOMMENDATION
        ===================================================== */}

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

          <button
            className="ai-button"
            onClick={() => navigate("/ai-assistant")}
          >
            Ask AI
            <FaArrowUp />
          </button>
        </section>

        {/* =====================================================
            BOTTOM GRID
        ===================================================== */}

        <section className="bottom-dashboard-grid">
          {/* =================================================
              MARKET
          ================================================= */}

          <div className="dashboard-card market-dashboard-card" id="market">
            <div className="card-header">
              <div>
                <span>MARKET ANALYSIS</span>
                <h2>Market Prices</h2>
              </div>

              <button>View Market →</button>
            </div>

            <div className="market-list">
              {/* WHEAT */}

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

              {/* RICE */}

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

              {/* COTTON */}

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

          {/* =================================================
              ACTIVITY
          ================================================= */}

          <div className="dashboard-card activity-card">
            <div className="card-header">
              <div>
                <span>ACTIVITY</span>
                <h2>Recent Activity</h2>
              </div>

              <button>See All</button>
            </div>

            <div className="activity-list">
              {/* ACTIVITY 1 */}

              <div className="activity-item">
                <div className="activity-icon success">
                  <FaCheckCircle />
                </div>

                <div>
                  <strong>Crop health checked</strong>

                  <span>Today · 10:30 AM</span>
                </div>
              </div>

              {/* ACTIVITY 2 */}

              <div className="activity-item">
                <div className="activity-icon weather">
                  <FaCloudSun />
                </div>

                <div>
                  <strong>Weather updated</strong>

                  <span>Today · 09:15 AM</span>
                </div>
              </div>

              {/* ACTIVITY 3 */}

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

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="dashboard-footer">
          © 2026 FarmVerse · Smart Farming Powered by AI
        </footer>
      </main>

      {/* =====================================================
          MOBILE + TABLET BOTTOM NAV
      ===================================================== */}

      <nav className="mobile-bottom-nav">
        <button
          className="mobile-nav-item active"
          onClick={() => scrollToSection("dashboard")}
        >
          <FaHome />
          <span>Home</span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => scrollToSection("farm")}
        >
          <FaLeaf />
          <span>Field</span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => scrollToSection("market")}
        >
          <FaChartLine />
          <span>Market</span>
        </button>

        <button className="mobile-nav-item" onClick={goToProfile}>
          <FaUser />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
