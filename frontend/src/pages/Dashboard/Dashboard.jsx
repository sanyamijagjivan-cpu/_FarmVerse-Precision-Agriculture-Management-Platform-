
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
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaSpinner,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaCloudRain,
  FaWind,
  FaArrowRight,
} from "react-icons/fa";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  /* =====================================================
     UI STATE
  ===================================================== */

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    React.useState(false);

  /* =====================================================
     DASHBOARD DATA
  ===================================================== */

  const [farms, setFarms] = React.useState([]);
  const [farmData, setFarmData] = React.useState(null);

  const [cropData, setCropData] = React.useState([]);

  const [weatherData, setWeatherData] =
    React.useState(null);

  const [marketPrices, setMarketPrices] =
    React.useState([]);

  const [dashboardLoading, setDashboardLoading] =
    React.useState(true);

  const [dashboardError, setDashboardError] =
    React.useState("");

  /* =====================================================
     CROP PREDICTION
  ===================================================== */

  const [cropForm, setCropForm] = React.useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    ph: "",
  });

  const [prediction, setPrediction] =
    React.useState(null);

  const [predictionLoading, setPredictionLoading] =
    React.useState(false);

  const [predictionError, setPredictionError] =
    React.useState("");

  const handleCropInputChange = (e) => {
    const { name, value } = e.target;

    setCropForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCropPrediction = async (e) => {
    e.preventDefault();

    setPredictionError("");
    setPrediction(null);
    setPredictionLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/crops/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nitrogen: Number(cropForm.nitrogen),
            phosphorus: Number(cropForm.phosphorus),
            potassium: Number(cropForm.potassium),
            temperature: Number(cropForm.temperature),
            humidity: Number(cropForm.humidity),
            rainfall: Number(cropForm.rainfall),
            ph: Number(cropForm.ph),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Crop prediction failed");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (error) {
      console.error("Crop prediction error:", error);

      setPredictionError(
        "Unable to get crop prediction. Please make sure the backend is running."
      );
    } finally {
      setPredictionLoading(false);
    }
  };

  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  const loadDashboardData = async () => {
    const token = getToken();

    if (!token) {
      setDashboardLoading(false);
      setDashboardError("Please login again.");
      return;
    }

    try {
      setDashboardLoading(true);
      setDashboardError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      /* =================================================
         1. LOAD FARMS
      ================================================= */

      const farmResponse = await fetch(
        "http://localhost:8080/api/farms",
        {
          method: "GET",
          headers,
        }
      );

      if (!farmResponse.ok) {
        throw new Error(
          `Farm API failed with status ${farmResponse.status}`
        );
      }

      const farmList = await farmResponse.json();

      console.log("Dashboard farms:", farmList);

      const availableFarms = Array.isArray(farmList)
        ? farmList
        : [];

      setFarms(availableFarms);

      /* =================================================
         2. FIND SELECTED FARM
      ================================================= */

      const storedFarmId =
        localStorage.getItem("selectedFarmId");

      let selectedFarm = null;

      if (storedFarmId) {
        selectedFarm = availableFarms.find(
          (farm) =>
            String(farm.id) === String(storedFarmId)
        );
      }

      /*
       * If no selected farm exists,
       * use the first farm.
       */
      if (!selectedFarm && availableFarms.length > 0) {
        selectedFarm = availableFarms[0];

        localStorage.setItem(
          "selectedFarmId",
          String(selectedFarm.id)
        );
      }

      setFarmData(selectedFarm);

      /* =================================================
         3. LOAD CROPS
      ================================================= */

      const cropResponse = await fetch(
        "http://localhost:8080/api/crops",
        {
          method: "GET",
          headers,
        }
      );

      if (!cropResponse.ok) {
        throw new Error(
          `Crop API failed with status ${cropResponse.status}`
        );
      }

      const crops = await cropResponse.json();

      console.log("Dashboard crops:", crops);

      const allCrops = Array.isArray(crops)
        ? crops
        : [];

      /*
       * Show only crops belonging to selected farm.
       *
       * Different backend field names are supported:
       * farm.id
       * farmId
       */

      const selectedFarmCrops =
        selectedFarm && selectedFarm.id
          ? allCrops.filter((crop) => {
              const cropFarmId =
                crop?.farm?.id ??
                crop?.farmId ??
                crop?.farm?.farmId;

              return (
                cropFarmId != null &&
                String(cropFarmId) ===
                  String(selectedFarm.id)
              );
            })
          : [];

      /*
       * If backend doesn't include farm information
       * in the crop response, keep the API result.
       */
      setCropData(
        selectedFarmCrops.length > 0
          ? selectedFarmCrops
          : allCrops
      );

      /* =================================================
         4. WEATHER
      ================================================= */

      /*
       * Weather uses the selected farm location.
       */

      const weatherLocation =
        selectedFarm?.location || "Nagercoil";

      const weatherResponse = await fetch(
        `http://localhost:8080/api/weather?city=${encodeURIComponent(
          weatherLocation
        )}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!weatherResponse.ok) {
        throw new Error(
          `Weather API failed with status ${weatherResponse.status}`
        );
      }

      const weather = await weatherResponse.json();

      console.log(
        "Dashboard weather:",
        weather
      );

      setWeatherData(weather);

      /* =================================================
         5. MARKET PRICES
      ================================================= */

      /*
       * IMPORTANT:
       * Market prices are requested using the
       * selected farm location.
       */

      const marketLocation =
        selectedFarm?.location || "Nagercoil";

      const marketResponse = await fetch(
        `http://localhost:8080/api/market-prices?location=${encodeURIComponent(
          marketLocation
        )}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!marketResponse.ok) {
        throw new Error(
          `Market API failed with status ${marketResponse.status}`
        );
      }

      const markets =
        await marketResponse.json();

      console.log(
        "Dashboard market location:",
        marketLocation
      );

      console.log(
        "Dashboard market prices:",
        markets
      );

      setMarketPrices(
        Array.isArray(markets)
          ? markets
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setDashboardError(
        error.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setDashboardLoading(false);
    }
  };

  /* =====================================================
     SELECT FARM
  ===================================================== */

  const handleFarmChange = (e) => {
    const farmId = e.target.value;

    if (!farmId) {
      return;
    }

    localStorage.setItem(
      "selectedFarmId",
      farmId
    );

    /*
     * Reload dashboard data so every section
     * belongs to the newly selected farm.
     */
    loadDashboardData();
  };

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const [notifications, setNotifications] =
    React.useState([]);

  const [notificationLoading, setNotificationLoading] =
    React.useState(true);

  const [notificationError, setNotificationError] =
    React.useState("");

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "WEATHER":
        return "🌧️";

      case "CROP":
      case "CROP_HEALTH":
        return "🌱";

      case "MARKET":
        return "📈";

      case "IRRIGATION":
        return "💧";

      case "DISEASE":
        return "⚠️";

      case "SYSTEM":
        return "📢";

      default:
        return "🔔";
    }
  };

  const formatNotificationTime = (
    createdAt
  ) => {
    if (!createdAt) {
      return "";
    }

    const notificationDate =
      new Date(createdAt);

    const now = new Date();

    const difference = Math.floor(
      (now.getTime() -
        notificationDate.getTime()) /
        1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      const minutes = Math.floor(
        difference / 60
      );

      return `${minutes} ${
        minutes === 1
          ? "minute"
          : "minutes"
      } ago`;
    }

    if (difference < 86400) {
      const hours = Math.floor(
        difference / 3600
      );

      return `${hours} ${
        hours === 1
          ? "hour"
          : "hours"
      } ago`;
    }

    if (difference < 172800) {
      return "Yesterday";
    }

    return notificationDate.toLocaleDateString();
  };

  const formatNotification = (
    notification
  ) => {
    return {
      id: notification.id,
      icon: getNotificationIcon(
        notification.type
      ),
      title: notification.title,
      message: notification.message,
      time: formatNotificationTime(
        notification.createdAt
      ),
      unread: !notification.read,
    };
  };

  const loadNotifications = async () => {
    const token = getToken();

    if (!token) {
      setNotificationLoading(false);
      return;
    }

    try {
      setNotificationError("");

      const response = await fetch(
        "http://localhost:8080/api/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load notifications"
        );
      }

      const data =
        await response.json();

      setNotifications(
        Array.isArray(data)
          ? data.map(formatNotification)
          : []
      );
    } catch (error) {
      console.error(
        "Notification loading error:",
        error
      );

      setNotificationError(
        "Unable to load notifications."
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  React.useEffect(() => {
    loadNotifications();
    loadDashboardData();

    const handleVisibility = () => {
      if (!document.hidden) {
        loadDashboardData();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.unread
    ).length;

  const markNotificationAsRead =
    async (id) => {
      const token = getToken();

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications/${id}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to mark notification as read"
          );
        }

        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification.id === id
                  ? {
                      ...notification,
                      unread: false,
                    }
                  : notification
            )
        );
      } catch (error) {
        console.error(
          "Mark notification read error:",
          error
        );
      }
    };

  const markAllAsRead = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to mark all notifications as read"
        );
      }

      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              unread: false,
            })
          )
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  /* =====================================================
     SIDEBAR
  ===================================================== */

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

  /* =====================================================
     SCROLL
  ===================================================== */

  const scrollToSection = (id) => {
    closeSidebar();

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* =====================================================
     NOTIFICATION PANEL
  ===================================================== */

  const NotificationPanel = () => (
    <div className="notification-dropdown">

      <div className="notification-header">

        <div>
          <h3>Notifications</h3>

          <span>
            {notificationLoading
              ? "Loading..."
              : unreadCount === 0
              ? "All caught up"
              : `${unreadCount} unread`}
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-read-btn"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-list">

        {notificationLoading && (
          <div className="notification-empty">
            <span>
              Loading notifications...
            </span>
          </div>
        )}

        {!notificationLoading &&
          notificationError && (
            <div className="notification-empty">

              <span>
                {notificationError}
              </span>

              <button
                type="button"
                onClick={loadNotifications}
                className="notification-retry-btn"
              >
                Try again
              </button>

            </div>
          )}

        {!notificationLoading &&
          !notificationError &&
          notifications.length === 0 && (
            <div className="notification-empty">

              <div className="notification-empty-icon">
                🔔
              </div>

              <strong>
                No notifications
              </strong>

              <span>
                You're all caught up!
              </span>

            </div>
          )}

        {!notificationLoading &&
          !notificationError &&
          notifications.length > 0 &&
          notifications.map(
            (notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.unread
                    ? "unread"
                    : ""
                }`}
                onClick={() =>
                  notification.unread &&
                  markNotificationAsRead(
                    notification.id
                  )
                }
              >

                <div className="notification-icon">
                  {notification.icon}
                </div>

                <div className="notification-content">

                  <div className="notification-title-row">

                    <strong>
                      {notification.title}
                    </strong>

                    {notification.unread && (
                      <span className="unread-dot"></span>
                    )}

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <small>
                    {notification.time}
                  </small>

                </div>

              </div>
            )
          )}

      </div>
    </div>
  );

  /* =====================================================
     REAL VALUES
  ===================================================== */

  const totalCrops = cropData.length;

  const totalFarmArea =
    farmData?.area != null
      ? farmData.area
      : null;

  const farmLocation =
    farmData?.location || null;

  const soilType =
    farmData?.soilType || null;

  const farmName =
    farmData?.farmName || "My Farm";

  const temperature =
    weatherData?.temperature != null
      ? `${weatherData.temperature}°C`
      : "--";

  const humidity =
    weatherData?.humidity != null
      ? `${weatherData.humidity}%`
      : "--";

  const windSpeed =
    weatherData?.windSpeed != null
      ? `${weatherData.windSpeed} km/h`
      : "--";

  const condition =
    weatherData?.condition || "Unavailable";

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="dashboard-layout">

      <header className="mobile-topbar">

        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
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
            onClick={() =>
              setNotificationsOpen(
                (previous) => !previous
              )
            }
            aria-label="Notifications"
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {notificationsOpen && (
            <NotificationPanel />
          )}

        </div>

      </header>

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        <div className="dashboard-logo">
          <FaLeaf />
          <span>FarmVerse</span>
        </div>

        <div className="sidebar-menu">

          <p className="menu-label">
            MAIN MENU
          </p>

          <button
            className="sidebar-link active"
            onClick={() =>
              scrollToSection("dashboard")
            }
          >
            <FaHome />
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              navigate("/my-farm")
            }
          >
            <FaSeedling />
            <span>My Farm</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              scrollToSection(
                "crop-prediction"
              )
            }
          >
            <FaSeedling />
            <span>Crop Prediction</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              navigate(
                "/disease-detection"
              )
            }
          >
            <FaVirus />
            <span>
              Disease Detection
            </span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/weather");
            }}
          >
            <FaCloudSun />
            <span>Weather</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate(
                "/market-analysis"
              );
            }}
          >
            <FaChartLine />
            <span>
              Market Analysis
            </span>
          </button>

          <p className="menu-label second-label">
            TOOLS
          </p>

          <button
            className="sidebar-link"
            onClick={() => {
              closeSidebar();
              navigate("/ai-assistant");
            }}
          >
            <FaRobot />
            <span>
              AI Assistant
            </span>
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <FaRobot />

            <div>
              <strong>
                Need Help?
              </strong>

              <span>
                Ask FarmVerse AI
              </span>
            </div>

          </div>

          <button
            className="sidebar-bottom-link"
            onClick={goToProfile}
          >
            <FaUserCircle />

            <div>
              <strong>
                Profile
              </strong>

              <span>
                My Account
              </span>
            </div>

          </button>

          <button
            className="sidebar-bottom-link"
            onClick={goToSettings}
          >
            <FaCog />

            <div>
              <strong>
                Settings
              </strong>

              <span>
                Preferences
              </span>
            </div>

          </button>

        </div>

      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>

            <span className="dashboard-greeting">
              GOOD MORNING 👋
            </span>

            <h1>
              Welcome to FarmVerse
            </h1>

            <p>
              Monitor your farm and make
              smarter farming decisions
              with AI.
            </p>

          </div>

          <div className="header-actions">

            <div className="notification-wrapper">

              <button
                className="notification-btn"
                onClick={() =>
                  setNotificationsOpen(
                    (previous) => !previous
                  )
                }
                aria-label="Notifications"
              >
                <FaBell />

                {unreadCount > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>

              {notificationsOpen && (
                <NotificationPanel />
              )}

            </div>

            <button
              className="profile-box"
              onClick={goToProfile}
            >

              <FaUserCircle />

              <div>
                <strong>
                  Farmer
                </strong>

                <small>
                  Farm Owner
                </small>
              </div>

            </button>

          </div>

        </div>

        <section
          className="dashboard-section"
          id="dashboard"
        >

          <div className="section-heading">

            <div>
              <span>
                SELECTED FARM
              </span>

              <h2>
                {farmName}
              </h2>
            </div>

            <div
              style={{
                minWidth: "180px",
              }}
            >

              <select
                value={
                  farmData?.id
                    ? String(farmData.id)
                    : ""
                }
                onChange={
                  handleFarmChange
                }
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >

                {farms.length === 0 && (
                  <option value="">
                    No farms
                  </option>
                )}

                {farms.map((farm) => (
                  <option
                    key={farm.id}
                    value={farm.id}
                  >
                    {farm.farmName ||
                      `Farm ${farm.id}`}
                  </option>
                ))}

              </select>

            </div>

          </div>

          <div className="overview-grid">

            <div className="overview-card">

              <div className="overview-icon green">
                <FaSeedling />
              </div>

              <div className="overview-info">

                <span>
                  Total Crops
                </span>

                <h3>
                  {dashboardLoading
                    ? "..."
                    : totalCrops}
                </h3>

                <small>
                  Crops in selected farm
                </small>

              </div>

            </div>

            <div className="overview-card">

              <div className="overview-icon blue">
                <FaRulerCombined />
              </div>

              <div className="overview-info">

                <span>
                  Farm Area
                </span>

                <h3>
                  {dashboardLoading
                    ? "..."
                    : totalFarmArea != null
                    ? `${totalFarmArea}`
                    : "--"}
                </h3>

                <small>
                  Acres
                </small>

              </div>

            </div>

            <div className="overview-card">

              <div className="overview-icon orange">
                <FaTemperatureHigh />
              </div>

              <div className="overview-info">

                <span>
                  Temperature
                </span>

                <h3>
                  {dashboardLoading
                    ? "..."
                    : temperature}
                </h3>

                <small>
                  {condition}
                </small>

              </div>

            </div>

            <div className="overview-card">

              <div className="overview-icon purple">
                <FaChartLine />
              </div>

              <div className="overview-info">

                <span>
                  Market Price
                </span>

                <h3>
                  {marketPrices.length > 0
                    ? `₹${Number(
                        marketPrices[0]
                          .price
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    : dashboardLoading
                    ? "..."
                    : "₹--"}
                </h3>

                <small>
                  {marketPrices.length > 0
                    ? marketPrices[0]
                        .cropName
                    : "No market data"}
                </small>

              </div>

            </div>

          </div>

        </section>

        <section
          className="dashboard-section"
          id="farm"
        >

          <div className="section-heading">

            <div>

              <span>
                MY FARM
              </span>

              <h2>
                Farm Information
              </h2>

            </div>

          </div>

          <div className="farm-summary-grid">

            <div className="farm-summary-card">

              <FaLeaf />

              <div>

                <span>
                  Farm Name
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : farmName}
                </strong>

              </div>

            </div>

            <div className="farm-summary-card">

              <FaMapMarkerAlt />

              <div>

                <span>
                  Farm Location
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : farmLocation ||
                      "Not available"}
                </strong>

              </div>

            </div>

            <div className="farm-summary-card">

              <FaRulerCombined />

              <div>

                <span>
                  Farm Area
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : totalFarmArea != null
                    ? `${totalFarmArea} Acres`
                    : "Not available"}
                </strong>

              </div>

            </div>

            <div className="farm-summary-card">

              <FaTint />

              <div>

                <span>
                  Soil Type
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : soilType ||
                      "Not available"}
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <span>
                FARM CROPS
              </span>

              <h2>
                Crops in {farmName}
              </h2>

            </div>

          </div>

          <div
            className="dashboard-card"
            style={{
              padding: "24px",
            }}
          >

            {dashboardLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "25px",
                }}
              >
                Loading crops...
              </div>
            )}

            {!dashboardLoading &&
              cropData.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "25px",
                    color: "#777",
                  }}
                >
                  <FaSeedling
                    style={{
                      fontSize: "30px",
                      marginBottom: "10px",
                    }}
                  />

                  <p>
                    No crops added to this
                    farm yet.
                  </p>
                </div>
              )}

            {!dashboardLoading &&
              cropData.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                  }}
                >

                  {cropData.map(
                    (crop, index) => (
                      <div
                        key={
                          crop.id ||
                          index
                        }
                        style={{
                          padding: "18px",
                          borderRadius: "14px",
                          background:
                            "#f7faf7",
                          border:
                            "1px solid #e6eee6",
                        }}
                      >

                        <FaSeedling
                          style={{
                            fontSize:
                              "22px",
                            marginBottom:
                              "8px",
                          }}
                        />

                        <strong
                          style={{
                            display:
                              "block",
                            fontSize:
                              "16px",
                          }}
                        >
                          {crop.cropName ||
                            crop.name ||
                            "Crop"}
                        </strong>

                        {crop.quantity !=
                          null && (
                          <small>
                            Quantity:{" "}
                            {
                              crop.quantity
                            }
                          </small>
                        )}

                        {crop.area !=
                          null && (
                          <small
                            style={{
                              display:
                                "block",
                            }}
                          >
                            Area:{" "}
                            {crop.area}{" "}
                            Acres
                          </small>
                        )}

                      </div>
                    )
                  )}

                </div>
              )}

          </div>

        </section>

        <section
          className="dashboard-section crop-prediction-section"
          id="crop-prediction"
        >

          <div className="section-heading">

            <div>

              <span>
                CROP INTELLIGENCE
              </span>

              <h2>
                Crop Prediction
              </h2>

              <p>
                Enter your soil and weather
                conditions to get a suitable
                crop recommendation.
              </p>

            </div>

          </div>

          <div className="crop-prediction-container">

            <form
              className="crop-prediction-form"
              onSubmit={
                handleCropPrediction
              }
            >

              <div className="prediction-input-grid">

                <div className="prediction-input-group">

                  <label htmlFor="nitrogen">
                    Nitrogen (N)
                  </label>

                  <input
                    id="nitrogen"
                    type="number"
                    step="0.1"
                    name="nitrogen"
                    value={
                      cropForm.nitrogen
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter nitrogen"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="phosphorus">
                    Phosphorus (P)
                  </label>

                  <input
                    id="phosphorus"
                    type="number"
                    step="0.1"
                    name="phosphorus"
                    value={
                      cropForm.phosphorus
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter phosphorus"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="potassium">
                    Potassium (K)
                  </label>

                  <input
                    id="potassium"
                    type="number"
                    step="0.1"
                    name="potassium"
                    value={
                      cropForm.potassium
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter potassium"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="temperature">
                    Temperature (°C)
                  </label>

                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={
                      cropForm.temperature
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter temperature"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="humidity">
                    Humidity (%)
                  </label>

                  <input
                    id="humidity"
                    type="number"
                    step="0.1"
                    name="humidity"
                    value={
                      cropForm.humidity
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter humidity"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="rainfall">
                    Rainfall (mm)
                  </label>

                  <input
                    id="rainfall"
                    type="number"
                    step="0.1"
                    name="rainfall"
                    value={
                      cropForm.rainfall
                    }
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter rainfall"
                    required
                  />

                </div>

                <div className="prediction-input-group">

                  <label htmlFor="ph">
                    Soil pH
                  </label>

                  <input
                    id="ph"
                    type="number"
                    step="0.1"
                    name="ph"
                    value={cropForm.ph}
                    onChange={
                      handleCropInputChange
                    }
                    placeholder="Enter soil pH"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="predict-crop-btn"
                disabled={
                  predictionLoading
                }
              >

                {predictionLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Predict Suitable Crop
                  </>
                )}

              </button>

            </form>

            {predictionError && (
              <div className="prediction-error">
                {predictionError}
              </div>
            )}

            {prediction && (
              <div className="prediction-result">

                <div className="prediction-result-icon">
                  <FaSeedling />
                </div>

                <div className="prediction-result-content">

                  <span>
                    RECOMMENDED CROP
                  </span>

                  <h3>
                    {
                      prediction.recommendedCrop
                    }
                  </h3>

                  <p>
                    {prediction.message}
                  </p>

                </div>

                <div className="prediction-confidence">

                  <strong>
                    {prediction.confidence}%
                  </strong>

                  <span>
                    Confidence
                  </span>

                </div>

              </div>
            )}

          </div>

        </section>

        <section
          className="dashboard-section simple-feature-section"
          id="disease"
        >

          <div className="feature-placeholder">

            <div className="feature-placeholder-icon red">
              <FaVirus />
            </div>

            <div>

              <span>
                CROP HEALTH
              </span>

              <h2>
                Disease Detection
              </h2>

              <p>
                Detect possible crop diseases
                using AI-powered analysis.
              </p>

            </div>

          </div>

        </section>

        <section
          className="dashboard-content-grid"
        >

          <div
            className="dashboard-card weather-dashboard-card"
            id="weather"
          >

            <div className="card-header">

              <div>

                <span>
                  WEATHER INTELLIGENCE
                </span>

                <h2>
                  {farmName} Weather
                </h2>

              </div>

              <FaCloudSun className="weather-title-icon" />

            </div>

            <div className="weather-main">

              <div>

                <FaCloudSun className="big-weather-icon" />

                <strong>
                  {dashboardLoading
                    ? "..."
                    : temperature}
                </strong>

                <span>
                  {condition}
                </span>

              </div>

              <div className="location">

                <strong>
                  {weatherData?.location ||
                    farmLocation ||
                    "Location unavailable"}
                </strong>

                <span>
                  Selected farm location
                </span>

              </div>

            </div>

            <div className="weather-details">

              <div>

                <FaTint />

                <span>
                  Humidity
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : humidity}
                </strong>

              </div>

              <div>

                <FaCloudRain />

                <span>
                  Rain Chance
                </span>

                <strong>
                  --
                </strong>

              </div>

              <div>

                <FaWind />

                <span>
                  Wind
                </span>

                <strong>
                  {dashboardLoading
                    ? "..."
                    : windSpeed}
                </strong>

              </div>

            </div>

          </div>

        </section>

        <section
          className="ai-recommendation"
          id="ai"
        >

          <div className="ai-icon-box">
            <FaRobot />
          </div>

          <div className="ai-content">

            <span>
              FARMVERSE AI ASSISTANT
            </span>

            <h2>
              Get smart farming assistance
            </h2>

            <p>
              Ask the FarmVerse AI Assistant
              about crops, farming practices,
              weather, diseases and market
              information.
            </p>

          </div>

          <button
            className="ai-button"
            onClick={() =>
              navigate("/ai-assistant")
            }
          >
            Ask AI
            <FaArrowRight />
          </button>

        </section>

        <section
          className="bottom-dashboard-grid"
        >

          <div
            className="dashboard-card market-dashboard-card"
            id="market"
          >

            <div className="card-header">

              <div>

                <span>
                  MARKET ANALYSIS
                </span>

                <h2>
                  Market Prices
                </h2>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/market-analysis"
                  )
                }
              >
                View Market →
              </button>

            </div>

            <div className="market-list">

              {dashboardLoading && (
                <div className="market-item">

                  <div className="crop-name">

                    <div className="crop-small-icon">
                      <FaSeedling />
                    </div>

                    <div>

                      <strong>
                        Loading...
                      </strong>

                      <span>
                        Fetching market prices
                      </span>

                    </div>

                  </div>

                </div>
              )}

              {!dashboardLoading &&
                marketPrices.length ===
                  0 && (

                  <div className="market-item">

                    <div className="crop-name">

                      <div className="crop-small-icon">
                        <FaSeedling />
                      </div>

                      <div>

                        <strong>
                          No market data
                        </strong>

                        <span>
                          No prices available
                        </span>

                      </div>

                    </div>

                  </div>
                )}

              {!dashboardLoading &&
                marketPrices
                  .slice(0, 3)
                  .map((market) => (

                    <div
                      className="market-item"
                      key={market.id}
                    >

                      <div className="crop-name">

                        <div className="crop-small-icon">
                          <FaSeedling />
                        </div>

                        <div>

                          <strong>
                            {market.cropName}
                          </strong>

                          <span>
                            {market.marketName}
                          </span>

                        </div>

                      </div>

                      <div className="market-price">

                        <strong>
                          ₹
                          {Number(
                            market.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                  ))}

            </div>

          </div>

          <div className="dashboard-card activity-card">

            <div className="card-header">

              <div>

                <span>
                  ACTIVITY
                </span>

                <h2>
                  Recent Activity
                </h2>

              </div>

              <button>
                See All
              </button>

            </div>

            <div className="activity-list">

              {notifications.length > 0 ? (
                notifications
                  .slice(0, 3)
                  .map((notification) => (

                    <div
                      className="activity-item"
                      key={notification.id}
                    >

                      <div className="activity-icon success">
                        {notification.icon}
                      </div>

                      <div>

                        <strong>
                          {notification.title}
                        </strong>

                        <span>
                          {notification.time}
                        </span>

                      </div>

                    </div>

                  ))
              ) : (
                <div
                  style={{
                    padding: "20px 0",
                    color: "#777",
                  }}
                >
                  No recent activity
                </div>
              )}

            </div>

          </div>

        </section>

        {dashboardError && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fff3f3",
              color: "#c62828",
              fontSize: "14px",
            }}
          >
            Dashboard data error:{" "}
            {dashboardError}
          </div>
        )}

        <footer className="dashboard-footer">
          © 2026 FarmVerse · Smart Farming
          Powered by AI
        </footer>

      </main>

      <nav className="mobile-bottom-nav">

        <button
          className="mobile-nav-item active"
          onClick={() =>
            scrollToSection(
              "dashboard"
            )
          }
        >
          <FaHome />
          <span>
            Home
          </span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() =>
            navigate("/my-farm")
          }
        >
          <FaLeaf />
          <span>
            Farm
          </span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={() =>
            scrollToSection(
              "market"
            )
          }
        >
          <FaChartLine />
          <span>
            Market
          </span>
        </button>

        <button
          className="mobile-nav-item"
          onClick={goToProfile}
        >
          <FaUser />
          <span>
            Profile
          </span>
        </button>

      </nav>

    </div>
  );
};

export default Dashboard;
