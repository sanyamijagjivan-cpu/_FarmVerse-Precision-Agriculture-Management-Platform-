import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLeaf,
  FaRobot,
  FaMapMarkerAlt,
  FaCloudSun,
  FaTint,
  FaWind,
  FaCloudRain,
  FaSun,
  FaSeedling,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";

import "./Weather.css";

const Weather = () => {
  const navigate = useNavigate();

  const hourlyData = [
    { time: "Now", temp: "27°", rain: "10%", icon: <FaCloudSun /> },
    { time: "01 PM", temp: "28°", rain: "12%", icon: <FaCloudSun /> },
    { time: "02 PM", temp: "29°", rain: "15%", icon: <FaSun /> },
    { time: "03 PM", temp: "28°", rain: "18%", icon: <FaCloudSun /> },
    { time: "04 PM", temp: "27°", rain: "22%", icon: <FaCloudRain /> },
    { time: "05 PM", temp: "26°", rain: "25%", icon: <FaCloudRain /> },
  ];

  const weeklyData = [
    {
      day: "TODAY",
      condition: "Mostly Cloudy",
      high: "29°",
      low: "23°",
      rain: "20%",
      icon: <FaCloudSun />,
    },
    {
      day: "SAT",
      condition: "Partly Cloudy",
      high: "30°",
      low: "23°",
      rain: "15%",
      icon: <FaCloudSun />,
    },
    {
      day: "SUN",
      condition: "Light Rain",
      high: "27°",
      low: "22°",
      rain: "45%",
      icon: <FaCloudRain />,
    },
    {
      day: "MON",
      condition: "Cloudy",
      high: "28°",
      low: "22°",
      rain: "30%",
      icon: <FaCloudSun />,
    },
    {
      day: "TUE",
      condition: "Sunny",
      high: "30°",
      low: "23°",
      rain: "10%",
      icon: <FaSun />,
    },
    {
      day: "WED",
      condition: "Mostly Cloudy",
      high: "29°",
      low: "22°",
      rain: "18%",
      icon: <FaCloudSun />,
    },
    {
      day: "THU",
      condition: "Light Rain",
      high: "27°",
      low: "21°",
      rain: "40%",
      icon: <FaCloudRain />,
    },
  ];

  return (
    <div className="weather-page">
      {/* NAVBAR */}
      <header className="weather-navbar">
        <button
          className="weather-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>

        <div className="weather-logo">
          <div className="weather-logo-icon">
            <FaLeaf />
          </div>
          <span>FarmVerse</span>
        </div>

        <button
          className="weather-ai-nav-button"
          onClick={() => navigate("/ai-assistant")}
        >
          <FaRobot />
          <span>AI Assistant</span>
        </button>
      </header>

      {/* MAIN */}
      <main className="weather-main">
        {/* HERO */}
        <section className="weather-hero">
          <div className="weather-hero-badge">
            <FaCloudSun />
            LIVE WEATHER INTELLIGENCE
          </div>

          <h1>
            Weather for
            <span>Smarter Farming</span>
          </h1>

          <p>
            Get accurate weather insights, forecasts and farming recommendations
            to make better decisions for your crops.
          </p>
        </section>

        {/* LOCATION */}
        <section className="farm-location-card">
          <div className="location-left">
            <div className="location-icon">
              <FaMapMarkerAlt />
            </div>

            <div>
              <span>FARM LOCATION</span>
              <h3>Pune, Maharashtra, India</h3>
            </div>
          </div>

          <button className="change-location-button">Change Location</button>
        </section>

        {/* CURRENT WEATHER */}
        <section className="current-weather-section">
          <div className="current-weather-card">
            <div className="current-weather-main">
              <span className="section-mini-label">CURRENT CONDITIONS</span>

              <div className="temperature-row">
                <div className="main-weather-icon">
                  <FaCloudSun />
                </div>

                <div>
                  <div className="main-temperature">
                    27<span>°C</span>
                  </div>

                  <p>Mostly Cloudy</p>
                </div>
              </div>

              <span className="feels-like">Feels like 28°C</span>
            </div>

            <div className="weather-condition">
              <div className="condition-status">
                <span className="status-dot"></span>
                GOOD CONDITIONS
              </div>

              <p>
                Current weather conditions are suitable for normal farm
                activities and crop monitoring.
              </p>
            </div>
          </div>

          {/* METRICS */}
          <div className="weather-metrics">
            <div className="weather-metric-card">
              <div className="metric-icon temperature-icon">
                <FaSun />
              </div>

              <div>
                <span>Temperature</span>
                <strong>27°C</strong>
              </div>
            </div>

            <div className="weather-metric-card">
              <div className="metric-icon humidity-icon">
                <FaTint />
              </div>

              <div>
                <span>Humidity</span>
                <strong>65%</strong>
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
                <strong>12 km/h</strong>
              </div>
            </div>
          </div>
        </section>

        {/* FARM ALERT */}
        <section className="farm-weather-alert">
          <div className="alert-icon">
            <FaExclamationTriangle />
          </div>

          <div className="alert-content">
            <span>FARM WEATHER ALERT</span>

            <h3>Good conditions for field activities</h3>

            <p>
              Weather conditions are currently favorable. Continue regular crop
              monitoring and irrigation based on soil moisture levels.
            </p>
          </div>

          <button className="alert-details-button">
            View Details
            <FaArrowRight />
          </button>
        </section>

        {/* HOURLY FORECAST */}
        <section className="forecast-section">
          <div className="section-heading">
            <div>
              <span>HOURLY FORECAST</span>
              <h2>Today's Weather</h2>
            </div>

            <p>Monitor temperature and rainfall changes throughout the day.</p>
          </div>

          <div className="hourly-forecast">
            {hourlyData.map((item, index) => (
              <div
                className={`hour-card ${index === 0 ? "hour-card-active" : ""}`}
                key={index}
              >
                <span className="hour-time">{item.time}</span>

                <div className="hour-icon">{item.icon}</div>

                <strong>{item.temp}</strong>

                <span className="hour-rain">
                  <FaCloudRain />
                  {item.rain}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* WEEKLY */}
        <section className="forecast-section">
          <div className="section-heading">
            <div>
              <span>7 DAY FORECAST</span>
              <h2>Weekly Outlook</h2>
            </div>

            <p>
              Plan your farming activities with the upcoming weather forecast.
            </p>
          </div>

          <div className="weekly-forecast">
            {weeklyData.map((item, index) => (
              <div
                className={`day-card ${index === 0 ? "day-card-active" : ""}`}
                key={index}
              >
                <span className="day-name">{item.day}</span>

                <div className="day-icon">{item.icon}</div>

                <span className="day-condition">{item.condition}</span>

                <div className="day-temperature">
                  <strong>{item.high}</strong>
                  <span>{item.low}</span>
                </div>

                <span className="day-rain">
                  <FaCloudRain />
                  {item.rain}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FARMING INTELLIGENCE */}
        <section className="farming-intelligence">
          <div className="section-heading centered-heading">
            <div>
              <span>FARMING INTELLIGENCE</span>
              <h2>Weather-Based Recommendations</h2>
            </div>

            <p>
              Smart recommendations to help you manage your farm according to
              current conditions.
            </p>
          </div>

          <div className="intelligence-grid">
            <div className="intelligence-card">
              <div className="intelligence-top">
                <div className="intelligence-icon">
                  <FaTint />
                </div>

                <span className="recommendation-status good">RECOMMENDED</span>
              </div>

              <h3>Irrigation</h3>

              <p>
                Soil moisture conditions are currently moderate. Normal
                irrigation is recommended.
              </p>

              <div className="recommendation-footer">
                <span>Recommendation</span>
                <strong>Normal irrigation</strong>
              </div>
            </div>

            <div className="intelligence-card">
              <div className="intelligence-top">
                <div className="intelligence-icon">
                  <FaSeedling />
                </div>

                <span className="recommendation-status good">GOOD</span>
              </div>

              <h3>Crop Monitoring</h3>

              <p>
                Weather conditions are suitable for regular crop inspection and
                field monitoring.
              </p>

              <div className="recommendation-footer">
                <span>Recommendation</span>
                <strong>Monitor crops</strong>
              </div>
            </div>

            <div className="intelligence-card">
              <div className="intelligence-top">
                <div className="intelligence-icon">
                  <FaCalendarAlt />
                </div>

                <span className="recommendation-status moderate">MODERATE</span>
              </div>

              <h3>Field Activities</h3>

              <p>
                Plan important field activities during the daytime when weather
                remains stable.
              </p>

              <div className="recommendation-footer">
                <span>Recommendation</span>
                <strong>Suitable today</strong>
              </div>
            </div>
          </div>
        </section>

        {/* RISK */}
        <section className="risk-section">
          <div className="section-heading centered-heading">
            <div>
              <span>WEATHER RISK</span>
              <h2>Farm Risk Overview</h2>
            </div>
          </div>

          <div className="risk-card">
            <div className="risk-row">
              <div className="risk-name">
                <span>Rainfall Risk</span>
                <strong>20%</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill rain-risk"
                  style={{ width: "20%" }}
                ></div>
              </div>
            </div>

            <div className="risk-row">
              <div className="risk-name">
                <span>Wind Risk</span>
                <strong>25%</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill wind-risk"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>

            <div className="risk-row">
              <div className="risk-name">
                <span>Humidity Risk</span>
                <strong>35%</strong>
              </div>

              <div className="risk-track">
                <div
                  className="risk-fill humidity-risk"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* AI CTA */}
        <section className="weather-ai-cta">
          <div className="weather-ai-icon">
            <FaRobot />
          </div>

          <div className="weather-ai-content">
            <span>FARMVERSE AI</span>

            <h2>Need help understanding today's weather?</h2>

            <p>
              Ask FarmVerse AI for personalized farming recommendations based on
              weather conditions.
            </p>
          </div>

          <button onClick={() => navigate("/ai-assistant")}>
            Ask AI
            <FaArrowRight />
          </button>
        </section>

        {/* FOOTER */}
        <footer className="weather-footer">
          <div className="weather-footer-brand">
            <FaLeaf />
            <strong>FarmVerse</strong>
          </div>

          <p>Smart weather intelligence for smarter farming.</p>

          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </footer>
      </main>
    </div>
  );
};

export default Weather;
