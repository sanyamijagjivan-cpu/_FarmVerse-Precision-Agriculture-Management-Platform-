import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaRobot,
  FaMapMarkerAlt,
  FaTint,
  FaWind,
  FaCloudRain,
  FaSun,
  FaSeedling,
  FaFlask,
  FaTractor,
  FaExclamationTriangle,
  FaLeaf,
  FaArrowRight,
  FaCloudSun,
} from "react-icons/fa";

import "./Weather.css";

function Weather() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Kurnool, Andhra Pradesh");

  const hourlyForecast = [
    { time: "06 AM", icon: <FaSun />, temp: "24°", rain: "10%" },
    { time: "09 AM", icon: <FaSun />, temp: "27°", rain: "10%" },
    { time: "12 PM", icon: <FaCloudSun />, temp: "30°", rain: "20%" },
    { time: "03 PM", icon: <FaCloudRain />, temp: "31°", rain: "65%" },
    { time: "06 PM", icon: <FaCloudRain />, temp: "28°", rain: "72%" },
    { time: "09 PM", icon: <FaCloudSun />, temp: "25°", rain: "30%" },
  ];

  const weeklyForecast = [
    {
      day: "TODAY",
      icon: <FaSun />,
      condition: "Sunny",
      high: "29°",
      low: "23°",
      rain: "20%",
    },
    {
      day: "MON",
      icon: <FaCloudSun />,
      condition: "Partly Cloudy",
      high: "30°",
      low: "24°",
      rain: "30%",
    },
    {
      day: "TUE",
      icon: <FaCloudRain />,
      condition: "Rain",
      high: "28°",
      low: "23°",
      rain: "75%",
    },
    {
      day: "WED",
      icon: <FaCloudRain />,
      condition: "Rain",
      high: "27°",
      low: "22°",
      rain: "80%",
    },
    {
      day: "THU",
      icon: <FaCloudSun />,
      condition: "Cloudy",
      high: "28°",
      low: "23°",
      rain: "50%",
    },
    {
      day: "FRI",
      icon: <FaSun />,
      condition: "Sunny",
      high: "31°",
      low: "24°",
      rain: "15%",
    },
    {
      day: "SAT",
      icon: <FaSun />,
      condition: "Sunny",
      high: "32°",
      low: "25°",
      rain: "10%",
    },
  ];

  const changeLocation = () => {
    const newLocation = window.prompt(
      "Enter your farm location:",
      location
    );

    if (newLocation && newLocation.trim() !== "") {
      setLocation(newLocation.trim());
    }
  };

  return (
    <div className="weather-page">

      {/* =========================================
          NAVBAR
          ========================================= */}

      <nav className="weather-navbar">

        <button
          className="weather-back-button"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          <span>Back to FarmVerse</span>
        </button>

        <div className="weather-logo">
          <div className="weather-logo-icon">
            <FaSeedling />
          </div>

          <span>FarmVerse</span>
        </div>

        <button
          className="weather-ai-nav-button"
          onClick={() => navigate("/ai-farming-assistant")}
        >
          <FaRobot />
          <span>AI Assistant</span>
        </button>

      </nav>


      {/* =========================================
          MAIN
          ========================================= */}

      <main className="weather-main">

        {/* =========================================
            HERO
            ========================================= */}

        <section className="weather-hero">

          <div className="weather-hero-badge">
            <FaCloudSun />
            FARM WEATHER INTELLIGENCE
          </div>

          <h1>
            Weather That Works
            <span> For Your Farm</span>
          </h1>

          <p>
            Understand local weather conditions and turn forecasts
            into smarter farming decisions for irrigation, spraying,
            sowing, and field activities.
          </p>

        </section>


        {/* =========================================
            LOCATION
            ========================================= */}

        <section className="farm-location-card">

          <div className="location-left">

            <div className="location-icon">
              <FaMapMarkerAlt />
            </div>

            <div>
              <span>FARM LOCATION</span>
              <h3>{location}</h3>
            </div>

          </div>

          <button
            className="change-location-button"
            onClick={changeLocation}
          >
            Change Location
          </button>

        </section>


        {/* =========================================
            CURRENT WEATHER
            ========================================= */}

        <section className="current-weather-section">

          <div className="current-weather-card">

            <div className="current-weather-main">

              <span className="section-mini-label">
                CURRENT WEATHER
              </span>

              <div className="temperature-row">

                <div className="main-weather-icon">
                  <FaSun />
                </div>

                <div>
                  <div className="main-temperature">
                    29°
                    <span>C</span>
                  </div>

                  <p>Mostly Sunny</p>
                </div>

              </div>

              <span className="feels-like">
                Feels like 31°C • Updated 10 minutes ago
              </span>

            </div>


            <div className="weather-condition">

              <div className="condition-status">
                <span className="status-dot"></span>
                GOOD CONDITIONS
              </div>

              <p>
                Suitable conditions for most outdoor
                farming activities.
              </p>

            </div>

          </div>


          {/* WEATHER METRICS */}

          <div className="weather-metrics">

            <div className="weather-metric-card">

              <div className="metric-icon temperature-icon">
                <FaSun />
              </div>

              <div>
                <span>Temperature</span>
                <strong>29°C</strong>
              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon humidity-icon">
                <FaTint />
              </div>

              <div>
                <span>Humidity</span>
                <strong>68%</strong>
              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon rain-icon">
                <FaCloudRain />
              </div>

              <div>
                <span>Rain Chance</span>
                <strong>20%</strong>
              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon wind-icon">
                <FaWind />
              </div>

              <div>
                <span>Wind Speed</span>
                <strong>14 km/h</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            FARM WEATHER ALERT
            ========================================= */}

        <section className="farm-weather-alert">

          <div className="alert-icon">
            <FaExclamationTriangle />
          </div>

          <div className="alert-content">

            <span>FARM WEATHER ALERT</span>

            <h3>
              Heavy rainfall expected tomorrow afternoon
            </h3>

            <p>
              Rain probability is expected to increase significantly.
              Consider delaying fertilizer or spray application
              and check field drainage before the rainfall.
            </p>

          </div>

          <button className="alert-details-button">
            View Details
            <FaArrowRight />
          </button>

        </section>


        {/* =========================================
            HOURLY FORECAST
            ========================================= */}

        <section className="forecast-section">

          <div className="section-heading">

            <div>
              <span>HOURLY CONDITIONS</span>

              <h2>Today's Weather</h2>
            </div>

            <p>
              Plan your field activities around today's
              weather conditions.
            </p>

          </div>


          <div className="hourly-forecast">

            {hourlyForecast.map((item, index) => (

              <div
                className={`hour-card ${
                  index === 3 ? "hour-card-active" : ""
                }`}
                key={item.time}
              >

                <span className="hour-time">
                  {item.time}
                </span>

                <div className="hour-icon">
                  {item.icon}
                </div>

                <strong>{item.temp}</strong>

                <span className="hour-rain">
                  <FaCloudRain />
                  {item.rain}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* =========================================
            7 DAY FORECAST
            ========================================= */}

        <section className="forecast-section weekly-section">

          <div className="section-heading">

            <div>
              <span>EXTENDED FORECAST</span>

              <h2>7-Day Farm Forecast</h2>
            </div>

            <p>
              Get a broader view of upcoming weather
              before planning farm operations.
            </p>

          </div>


          <div className="weekly-forecast">

            {weeklyForecast.map((day, index) => (

              <div
                className={`day-card ${
                  index === 0 ? "day-card-active" : ""
                }`}
                key={day.day}
              >

                <span className="day-name">
                  {day.day}
                </span>

                <div className="day-icon">
                  {day.icon}
                </div>

                <span className="day-condition">
                  {day.condition}
                </span>

                <div className="day-temperature">
                  <strong>{day.high}</strong>
                  <span>{day.low}</span>
                </div>

                <div className="day-rain">
                  <FaCloudRain />
                  {day.rain}
                </div>

              </div>

            ))}

          </div>

        </section>


        {/* =========================================
            FARMING INTELLIGENCE
            ========================================= */}

        <section className="farming-intelligence">

          <div className="section-heading centered-heading">

            <div>
              <span>WEATHER → FARMING DECISIONS</span>

              <h2>Farming Intelligence</h2>
            </div>

            <p>
              Weather data translated into practical
              recommendations for your farm.
            </p>

          </div>


          <div className="intelligence-grid">

            {/* IRRIGATION */}

            <div className="intelligence-card irrigation-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaTint />
                </div>

                <span className="recommendation-status moderate">
                  MODERATE
                </span>

              </div>

              <h3>Irrigation</h3>

              <p>
                Rain is expected tomorrow. Consider reducing
                today's irrigation to avoid unnecessary water use.
              </p>

              <div className="recommendation-footer">
                <span>Water requirement</span>
                <strong>Medium</strong>
              </div>

            </div>


            {/* SPRAYING */}

            <div className="intelligence-card spraying-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaFlask />
                </div>

                <span className="recommendation-status avoid">
                  NOT IDEAL
                </span>

              </div>

              <h3>Spraying</h3>

              <p>
                High rainfall probability may reduce spray
                effectiveness. Consider postponing application.
              </p>

              <div className="recommendation-footer">
                <span>Recommended time</span>
                <strong>After rain</strong>
              </div>

            </div>


            {/* FIELD WORK */}

            <div className="intelligence-card field-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaTractor />
                </div>

                <span className="recommendation-status good">
                  GOOD
                </span>

              </div>

              <h3>Field Work</h3>

              <p>
                Morning conditions are suitable for general
                field activities and routine crop inspection.
              </p>

              <div className="recommendation-footer">
                <span>Best time</span>
                <strong>6 AM – 11 AM</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            CROP WEATHER RISK
            ========================================= */}

        <section className="risk-section">

          <div className="section-heading">

            <div>
              <span>FARM RISK MONITORING</span>

              <h2>Crop Weather Risk</h2>
            </div>

            <p>
              A quick view of the weather factors that
              may affect your crops.
            </p>

          </div>


          <div className="risk-card">

            <div className="risk-row">

              <div className="risk-name">
                <span>Heat Stress</span>
                <strong>Low</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill heat-risk"
                  style={{ width: "35%" }}
                ></div>
              </div>

            </div>


            <div className="risk-row">

              <div className="risk-name">
                <span>Rain Risk</span>
                <strong>Moderate</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill rain-risk"
                  style={{ width: "68%" }}
                ></div>
              </div>

            </div>


            <div className="risk-row">

              <div className="risk-name">
                <span>Wind Risk</span>
                <strong>Low</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill wind-risk"
                  style={{ width: "22%" }}
                ></div>
              </div>

            </div>


            <div className="risk-row">

              <div className="risk-name">
                <span>Humidity Risk</span>
                <strong>Moderate</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill humidity-risk"
                  style={{ width: "58%" }}
                ></div>
              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            AI CTA
            ========================================= */}

        <section className="weather-ai-cta">

          <div className="weather-ai-icon">
            <FaRobot />
          </div>

          <div className="weather-ai-content">

            <span>WEATHER + AI</span>

            <h2>
              Not sure what today's weather means for your farm?
            </h2>

            <p>
              Ask FarmVerse AI about irrigation, spraying,
              sowing, harvesting, crop protection, and more.
            </p>

          </div>

          <button
            onClick={() => navigate("/ai-farming-assistant")}
          >
            Ask FarmVerse AI
            <FaArrowRight />
          </button>

        </section>


        {/* =========================================
            FOOTER
            ========================================= */}

        <footer className="weather-footer">

          <div className="weather-footer-brand">
            <FaLeaf />
            <span>FarmVerse</span>
          </div>

          <p>
            Smart agriculture • Better decisions • Better harvests
          </p>

          <button onClick={() => navigate("/")}>
            Back to Home
          </button>

        </footer>

      </main>

    </div>
  );
}

export default Weather;