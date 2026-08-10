import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaLeaf,
  FaLock,
  FaGlobe,
  FaPalette,
  FaSeedling,
  FaTint,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";

import "./Settings.css";

const defaultSettings = {
  notifications: true,
  weatherAlerts: true,
  marketAlerts: true,
  cropAlerts: true,
  language: "English",
  theme: "Light",
  mainCrop: "Cotton",
  farmArea: "2.5",
  irrigation: "Drip Irrigation",
};

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = React.useState(() => {
    try {
      const saved = localStorage.getItem("farmverseSettings");

      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [message, setMessage] = React.useState("");

  /* =====================================================
     APPLY GLOBAL THEME
  ===================================================== */

  React.useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === "Dark") {
      root.classList.add("dark-theme");
    } else if (settings.theme === "Light") {
      root.classList.remove("dark-theme");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.toggle("dark-theme", prefersDark);
    }
  }, [settings.theme]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =====================================================
     SAVE SETTINGS
  ===================================================== */

  const handleSave = () => {
    if (password && password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    localStorage.setItem("farmverseSettings", JSON.stringify(settings));

    if (password) {
      localStorage.setItem("farmversePassword", password);

      setPassword("");
      setConfirmPassword("");
    }

    setMessage("Settings saved successfully ✓");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setSettings(defaultSettings);

    setPassword("");
    setConfirmPassword("");

    localStorage.setItem("farmverseSettings", JSON.stringify(defaultSettings));

    document.documentElement.classList.remove("dark-theme");

    setMessage("Settings restored to default.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="settings-page">
      {/* ================= HEADER ================= */}

      <header className="settings-header">
        <div className="settings-header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft />
          </button>

          <div className="settings-brand">
            <div className="settings-logo">
              <FaLeaf />
            </div>

            <div>
              <strong>FarmVerse</strong>
              <span>Settings</span>
            </div>
          </div>
        </div>

        <button className="profile-btn" onClick={() => navigate("/profile")}>
          <FaUser />
          <span>Profile</span>
        </button>
      </header>

      {/* ================= MAIN ================= */}

      <main className="settings-container">
        <div className="settings-title">
          <span>ACCOUNT & PREFERENCES</span>

          <h1>Settings</h1>

          <p>
            Manage your FarmVerse preferences and personalize your farming
            experience.
          </p>
        </div>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="settings-message">
            <FaSave />
            {message}
          </div>
        )}

        {/* =====================================================
            NOTIFICATIONS
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon green">
              <FaBell />
            </div>

            <div>
              <h2>Notifications</h2>

              <p>Control the alerts you receive from FarmVerse.</p>
            </div>
          </div>

          <div className="settings-options">
            {/* MASTER */}

            <div className="setting-row">
              <div className="setting-info">
                <strong>Notifications</strong>

                <span>Receive FarmVerse alerts and updates.</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    handleChange("notifications", e.target.checked)
                  }
                />

                <span className="slider"></span>
              </label>
            </div>

            {/* WEATHER */}

            <div
              className={`setting-row ${
                !settings.notifications ? "disabled-row" : ""
              }`}
            >
              <div className="setting-info">
                <strong>Weather Alerts</strong>

                <span>Get alerts about rain and weather changes.</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.weatherAlerts}
                  disabled={!settings.notifications}
                  onChange={(e) =>
                    handleChange("weatherAlerts", e.target.checked)
                  }
                />

                <span className="slider"></span>
              </label>
            </div>

            {/* MARKET */}

            <div
              className={`setting-row ${
                !settings.notifications ? "disabled-row" : ""
              }`}
            >
              <div className="setting-info">
                <strong>Market Alerts</strong>

                <span>Receive crop price updates.</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.marketAlerts}
                  disabled={!settings.notifications}
                  onChange={(e) =>
                    handleChange("marketAlerts", e.target.checked)
                  }
                />

                <span className="slider"></span>
              </label>
            </div>

            {/* CROP */}

            <div
              className={`setting-row ${
                !settings.notifications ? "disabled-row" : ""
              }`}
            >
              <div className="setting-info">
                <strong>Crop Health Alerts</strong>

                <span>Get notifications about crop health.</span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.cropAlerts}
                  disabled={!settings.notifications}
                  onChange={(e) => handleChange("cropAlerts", e.target.checked)}
                />

                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* =====================================================
            FARM PREFERENCES
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon green">
              <FaSeedling />
            </div>

            <div>
              <h2>Farm Preferences</h2>

              <p>Update your farm information.</p>
            </div>
          </div>

          <div className="form-grid">
            {/* CROP */}

            <div className="form-group">
              <label>
                <FaLeaf />
                Main Crop
              </label>

              <select
                value={settings.mainCrop}
                onChange={(e) => handleChange("mainCrop", e.target.value)}
              >
                <option value="Cotton">Cotton</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Soybean">Soybean</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            {/* AREA */}

            <div className="form-group">
              <label>
                <FaSeedling />
                Farm Area
              </label>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={settings.farmArea}
                  onChange={(e) => handleChange("farmArea", e.target.value)}
                />

                <span>Acres</span>
              </div>
            </div>

            {/* IRRIGATION */}

            <div className="form-group">
              <label>
                <FaTint />
                Irrigation Method
              </label>

              <select
                value={settings.irrigation}
                onChange={(e) => handleChange("irrigation", e.target.value)}
              >
                <option value="Drip Irrigation">Drip Irrigation</option>

                <option value="Sprinkler Irrigation">
                  Sprinkler Irrigation
                </option>

                <option value="Flood Irrigation">Flood Irrigation</option>

                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
          </div>
        </section>

        {/* =====================================================
            APPEARANCE
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon purple">
              <FaPalette />
            </div>

            <div>
              <h2>Appearance & Language</h2>

              <p>Customize how FarmVerse looks.</p>
            </div>
          </div>

          <div className="form-grid">
            {/* LANGUAGE */}

            <div className="form-group">
              <label>
                <FaGlobe />
                Language
              </label>

              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <option value="English">English</option>

                <option value="Marathi">Marathi</option>

                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* THEME */}

            <div className="form-group">
              <label>
                <FaPalette />
                Appearance
              </label>

              <select
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
              >
                <option value="Light">Light</option>

                <option value="Dark">Dark</option>

                <option value="System">System Default</option>
              </select>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon orange">
              <FaLock />
            </div>

            <div>
              <h2>Security</h2>

              <p>Update your account password.</p>
            </div>
          </div>

          <div className="password-grid">
            {/* PASSWORD */}

            <div className="form-group">
              <label>
                <FaLock />
                New Password
              </label>

              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* CONFIRM */}

            <div className="form-group">
              <label>
                <FaLock />
                Confirm Password
              </label>

              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="settings-actions">
          <button className="reset-settings-btn" onClick={handleReset}>
            <FaUndo />
            Reset
          </button>

          <button className="save-settings-btn" onClick={handleSave}>
            <FaSave />
            Save Changes
          </button>
        </div>

        <footer className="settings-footer">
          © 2026 FarmVerse · Smart Farming Powered by AI
        </footer>
      </main>
    </div>
  );
};

export default Settings;
