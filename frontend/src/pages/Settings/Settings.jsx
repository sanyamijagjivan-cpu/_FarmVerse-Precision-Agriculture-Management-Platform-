
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBell,
  FaLeaf,
  FaLock,
  FaGlobe,
  FaPalette,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaCloudSun,
  FaSeedling,
  FaChartLine,
  FaBullhorn,
} from "react-icons/fa";

import "./Settings.css";

const API_URL = "http://localhost:8080/api";

const defaultSettings = {
  notificationsEnabled: true,
  weatherAlerts: true,
  cropAlerts: true,
  marketAlerts: true,
  systemUpdates: true,
  language: "English",
  theme: "Light",
};

const languages = [
  "English",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Telugu",
  "Kannada",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
];

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = React.useState(defaultSettings);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    React.useState(false);

  const [showPassword, setShowPassword] =
    React.useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState(false);

  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // MESSAGE
  // =====================================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  React.useEffect(() => {
    const loadSettings = async () => {
      const token = getToken();

      if (!token) {
        showMessage("Please login again.", "error");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/users/settings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load settings");
        }

        const data = await response.json();

        setSettings({
          ...defaultSettings,
          ...data,
        });
      } catch (error) {
        console.error("Settings loading error:", error);

        showMessage(
          "Unable to load your settings.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // =====================================================
  // APPLY THEME
  // =====================================================

  React.useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === "Dark") {
      root.classList.add("dark-theme");
    } else if (settings.theme === "Light") {
      root.classList.remove("dark-theme");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.classList.toggle(
        "dark-theme",
        prefersDark
      );
    }
  }, [settings.theme]);

  // =====================================================
  // HANDLE SETTING CHANGE
  // =====================================================

  const handleChange = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const saveSettings = async () => {
    const token = getToken();

    if (!token) {
      showMessage("Please login again.", "error");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_URL}/users/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save settings"
        );
      }

      setSettings({
        ...defaultSettings,
        ...data,
      });

      showMessage(
        "Settings saved successfully ✓"
      );
    } catch (error) {
      console.error(
        "Settings save error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to save settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET SETTINGS
  // =====================================================

  const resetSettings = async () => {
    const defaultData = {
      ...defaultSettings,
    };

    setSettings(defaultData);

    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(defaultData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setSettings({
          ...defaultSettings,
          ...data,
        });

        showMessage(
          "Settings restored to default."
        );
      }
    } catch (error) {
      console.error(
        "Reset settings error:",
        error
      );

      showMessage(
        "Unable to reset settings.",
        "error"
      );
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const changePassword = async () => {
    if (
      !currentPassword &&
      !password &&
      !confirmPassword
    ) {
      return true;
    }

    if (!currentPassword) {
      showMessage(
        "Enter your current password.",
        "error"
      );

      return false;
    }

    if (!password) {
      showMessage(
        "Enter your new password.",
        "error"
      );

      return false;
    }

    if (password.length < 6) {
      showMessage(
        "New password must contain at least 6 characters.",
        "error"
      );

      return false;
    }

    if (password !== confirmPassword) {
      showMessage(
        "New passwords do not match.",
        "error"
      );

      return false;
    }

    const token = getToken();

    if (!token) {
      showMessage(
        "Please login again.",
        "error"
      );

      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/users/change-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          data.message ||
            "Password change failed.",
          "error"
        );

        return false;
      }

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      showMessage(
        "Password changed successfully ✓"
      );

      return true;
    } catch (error) {
      console.error(
        "Password error:",
        error
      );

      showMessage(
        "Unable to change password.",
        "error"
      );

      return false;
    }
  };

  // =====================================================
  // SAVE EVERYTHING
  // =====================================================

  const handleSave = async () => {
    setMessage("");
    setSaving(true);

    try {
      const hasPasswordInput =
        currentPassword ||
        password ||
        confirmPassword;

      if (hasPasswordInput) {
        const passwordChanged =
          await changePassword();

        if (!passwordChanged) {
          return;
        }
      }

      const token = getToken();

      if (!token) {
        showMessage(
          "Please login again.",
          "error"
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/users/settings`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save settings"
        );
      }

      setSettings({
        ...defaultSettings,
        ...data,
      });

      showMessage(
        "Settings saved successfully ✓"
      );
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to save settings.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="settings-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          Loading your settings...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="settings-page">

      {/* HEADER */}

      <header className="settings-header">

        <div className="settings-header-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
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

        <button
          className="profile-btn"
          onClick={() =>
            navigate("/profile")
          }
        >
          <FaUser />
          <span>Profile</span>
        </button>

      </header>

      <main className="settings-container">

        {/* TITLE */}

        <div className="settings-title">

          <span>
            ACCOUNT & PREFERENCES
          </span>

          <h1>Settings</h1>

          <p>
            Manage your FarmVerse preferences
            and personalize your experience.
          </p>

        </div>

        {/* MESSAGE */}

        {message && (
          <div
            className={`settings-message ${
              messageType === "error"
                ? "error-message"
                : ""
            }`}
          >
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

              <p>
                Choose the FarmVerse alerts you
                want to receive.
              </p>
            </div>

          </div>

          <div className="settings-options">

            {/* ALL NOTIFICATIONS */}

            <div className="setting-row">

              <div className="setting-info">

                <strong>
                  All Notifications
                </strong>

                <span>
                  Enable or disable all FarmVerse
                  notifications.
                </span>

              </div>

              <div className="setting-control">

                <FaBell />

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.notificationsEnabled
                    }
                    onChange={(e) =>
                      handleChange(
                        "notificationsEnabled",
                        e.target.checked
                      )
                    }
                  />

                  <span className="slider" />

                </label>

              </div>

            </div>

            {/* WEATHER */}

            <div
              className={`setting-row ${
                !settings.notificationsEnabled
                  ? "disabled-row"
                  : ""
              }`}
            >

              <div className="setting-info">

                <strong>
                  Weather Alerts
                </strong>

                <span>
                  Rain, temperature and severe
                  weather alerts.
                </span>

              </div>

              <div className="setting-control">

                <FaCloudSun />

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.weatherAlerts
                    }
                    disabled={
                      !settings.notificationsEnabled
                    }
                    onChange={(e) =>
                      handleChange(
                        "weatherAlerts",
                        e.target.checked
                      )
                    }
                  />

                  <span className="slider" />

                </label>

              </div>

            </div>

            {/* CROP */}

            <div
              className={`setting-row ${
                !settings.notificationsEnabled
                  ? "disabled-row"
                  : ""
              }`}
            >

              <div className="setting-info">

                <strong>
                  Crop Health Alerts
                </strong>

                <span>
                  Important crop health,
                  disease and pest alerts.
                </span>

              </div>

              <div className="setting-control">

                <FaSeedling />

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.cropAlerts
                    }
                    disabled={
                      !settings.notificationsEnabled
                    }
                    onChange={(e) =>
                      handleChange(
                        "cropAlerts",
                        e.target.checked
                      )
                    }
                  />

                  <span className="slider" />

                </label>

              </div>

            </div>

            {/* MARKET */}

            <div
              className={`setting-row ${
                !settings.notificationsEnabled
                  ? "disabled-row"
                  : ""
              }`}
            >

              <div className="setting-info">

                <strong>
                  Market Price Alerts
                </strong>

                <span>
                  Important crop price and
                  market updates.
                </span>

              </div>

              <div className="setting-control">

                <FaChartLine />

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.marketAlerts
                    }
                    disabled={
                      !settings.notificationsEnabled
                    }
                    onChange={(e) =>
                      handleChange(
                        "marketAlerts",
                        e.target.checked
                      )
                    }
                  />

                  <span className="slider" />

                </label>

              </div>

            </div>

            {/* SYSTEM */}

            <div
              className={`setting-row ${
                !settings.notificationsEnabled
                  ? "disabled-row"
                  : ""
              }`}
            >

              <div className="setting-info">

                <strong>
                  System Updates
                </strong>

                <span>
                  FarmVerse announcements,
                  features and important updates.
                </span>

              </div>

              <div className="setting-control">

                <FaBullhorn />

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.systemUpdates
                    }
                    disabled={
                      !settings.notificationsEnabled
                    }
                    onChange={(e) =>
                      handleChange(
                        "systemUpdates",
                        e.target.checked
                      )
                    }
                  />

                  <span className="slider" />

                </label>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            LANGUAGE + APPEARANCE
        ===================================================== */}

        <section className="settings-card">

          <div className="settings-card-heading">

            <div className="settings-heading-icon purple">
              <FaPalette />
            </div>

            <div>

              <h2>
                Appearance & Language
              </h2>

              <p>
                Customize the look and language
                of FarmVerse.
              </p>

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
                onChange={(e) =>
                  handleChange(
                    "language",
                    e.target.value
                  )
                }
              >

                {languages.map(
                  (language) => (
                    <option
                      key={language}
                      value={language}
                    >
                      {language}
                    </option>
                  )
                )}

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
                onChange={(e) =>
                  handleChange(
                    "theme",
                    e.target.value
                  )
                }
              >

                <option value="Light">
                  Light
                </option>

                <option value="Dark">
                  Dark
                </option>

                <option value="System">
                  System Default
                </option>

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

              <p>
                Change your FarmVerse account
                password.
              </p>

            </div>

          </div>

          <div className="password-grid">

            {/* CURRENT PASSWORD */}

            <div className="form-group">

              <label>
                <FaLock />
                Current Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* NEW PASSWORD */}

            <div className="form-group">

              <label>
                <FaLock />
                New Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                <FaLock />
                Confirm Password
              </label>

              <div className="password-input">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="settings-actions">

          <button
            className="reset-settings-btn"
            onClick={resetSettings}
            disabled={saving}
          >
            <FaUndo />
            Reset
          </button>

          <button
            className="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

        {/* FOOTER */}

        <footer className="settings-footer">
          © 2026 FarmVerse · Smart Farming
          Powered by AI
        </footer>

      </main>

    </div>
  );
};

export default Settings;
