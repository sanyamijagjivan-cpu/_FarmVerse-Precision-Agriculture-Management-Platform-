import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserCircle,
  FaLeaf,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSeedling,
  FaRulerCombined,
  FaTint,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [editing, setEditing] = React.useState(false);

  const [profile, setProfile] = React.useState({
    name: "Farmer",
    email: "farmer@farmverse.com",
    phone: "+91 98765 43210",
    location: "Pune, Maharashtra",
    farmArea: "2.5",
    mainCrop: "Cotton",
    irrigation: "Drip Irrigation",
  });

  const [tempProfile, setTempProfile] = React.useState(profile);

  const [saved, setSaved] = React.useState(false);

  /* ===============================
     LOAD PROFILE
  =============================== */

  React.useEffect(() => {
    const savedProfile = localStorage.getItem("farmverseProfile");

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);

        setProfile(parsed);
        setTempProfile(parsed);
      } catch (error) {
        console.log("Profile loading error:", error);
      }
    }
  }, []);

  /* ===============================
     EDIT
  =============================== */

  const handleEdit = () => {
    setTempProfile(profile);
    setEditing(true);
  };

  /* ===============================
     INPUT CHANGE
  =============================== */

  const handleChange = (field, value) => {
    setTempProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* ===============================
     SAVE
  =============================== */

  const handleSave = () => {
    setProfile(tempProfile);

    localStorage.setItem("farmverseProfile", JSON.stringify(tempProfile));

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* ===============================
     CANCEL
  =============================== */

  const handleCancel = () => {
    setTempProfile(profile);
    setEditing(false);
  };

  /* ===============================
     DASHBOARD
  =============================== */

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  /* ===============================
     SETTINGS
  =============================== */

  const goToSettings = () => {
    navigate("/settings");
  };

  /* ===============================
     LOGOUT
  =============================== */

  const handleLogout = () => {
    localStorage.removeItem("farmverseUser");

    navigate("/login");
  };

  return (
    <div className="profile-page">
      {/* ================= HEADER ================= */}

      <header className="profile-header">
        <div className="profile-header-left">
          <button className="profile-back-btn" onClick={goToDashboard}>
            <FaArrowLeft />
          </button>

          <div className="profile-brand">
            <div className="profile-brand-icon">
              <FaLeaf />
            </div>

            <div>
              <strong>FarmVerse</strong>
              <span>My Profile</span>
            </div>
          </div>
        </div>

        <button className="profile-settings-btn" onClick={goToSettings}>
          Settings
        </button>
      </header>

      {/* ================= MAIN ================= */}

      <main className="profile-container">
        {/* PAGE TITLE */}

        <div className="profile-title">
          <span>ACCOUNT</span>

          <h1>My Profile</h1>

          <p>Manage your personal information and farm details.</p>
        </div>

        {/* SUCCESS MESSAGE */}

        {saved && (
          <div className="profile-success">
            <FaSave />
            Profile updated successfully.
          </div>
        )}

        {/* ================= PROFILE CARD ================= */}

        <section className="profile-main-card">
          {/* TOP */}

          <div className="profile-card-top">
            <div className="profile-avatar">
              <FaUserCircle />
            </div>

            <div className="profile-user-info">
              {editing ? (
                <input
                  className="profile-name-input"
                  value={tempProfile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your name"
                />
              ) : (
                <h2>{profile.name}</h2>
              )}

              <span>Farm Owner · FarmVerse</span>
            </div>

            {!editing && (
              <button className="profile-edit-btn" onClick={handleEdit}>
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>

          {/* ================= DETAILS ================= */}

          <div className="profile-details">
            {/* EMAIL */}

            <div className="profile-field">
              <div className="field-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>Email Address</span>

                {editing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <strong>{profile.email}</strong>
                )}
              </div>
            </div>

            {/* PHONE */}

            <div className="profile-field">
              <div className="field-icon">
                <FaPhone />
              </div>

              <div>
                <span>Phone Number</span>

                {editing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                ) : (
                  <strong>{profile.phone}</strong>
                )}
              </div>
            </div>

            {/* LOCATION */}

            <div className="profile-field">
              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>Location</span>

                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                ) : (
                  <strong>{profile.location}</strong>
                )}
              </div>
            </div>

            {/* FARM AREA */}

            <div className="profile-field">
              <div className="field-icon">
                <FaRulerCombined />
              </div>

              <div>
                <span>Farm Area</span>

                {editing ? (
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={tempProfile.farmArea}
                    onChange={(e) => handleChange("farmArea", e.target.value)}
                  />
                ) : (
                  <strong>{profile.farmArea} Acres</strong>
                )}
              </div>
            </div>

            {/* MAIN CROP */}

            <div className="profile-field">
              <div className="field-icon">
                <FaSeedling />
              </div>

              <div>
                <span>Main Crop</span>

                {editing ? (
                  <select
                    value={tempProfile.mainCrop}
                    onChange={(e) => handleChange("mainCrop", e.target.value)}
                  >
                    <option>Cotton</option>
                    <option>Wheat</option>
                    <option>Rice</option>
                    <option>Sugarcane</option>
                    <option>Soybean</option>
                    <option>Maize</option>
                  </select>
                ) : (
                  <strong>{profile.mainCrop}</strong>
                )}
              </div>
            </div>

            {/* IRRIGATION */}

            <div className="profile-field">
              <div className="field-icon">
                <FaTint />
              </div>

              <div>
                <span>Irrigation</span>

                {editing ? (
                  <select
                    value={tempProfile.irrigation}
                    onChange={(e) => handleChange("irrigation", e.target.value)}
                  >
                    <option>Drip Irrigation</option>

                    <option>Sprinkler Irrigation</option>

                    <option>Flood Irrigation</option>

                    <option>Rainfed</option>
                  </select>
                ) : (
                  <strong>{profile.irrigation}</strong>
                )}
              </div>
            </div>
          </div>

          {/* ================= ACTIONS ================= */}

          {editing && (
            <div className="profile-actions">
              <button className="cancel-profile-btn" onClick={handleCancel}>
                <FaTimes />
                Cancel
              </button>

              <button className="save-profile-btn" onClick={handleSave}>
                <FaSave />
                Save Changes
              </button>
            </div>
          )}
        </section>

        {/* ================= FARM SUMMARY ================= */}

        <section className="profile-summary">
          <div className="summary-item">
            <div className="summary-icon green">
              <FaSeedling />
            </div>

            <div>
              <span>Main Crop</span>
              <strong>{profile.mainCrop}</strong>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon blue">
              <FaRulerCombined />
            </div>

            <div>
              <span>Total Area</span>
              <strong>{profile.farmArea} Acres</strong>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon water">
              <FaTint />
            </div>

            <div>
              <span>Irrigation</span>
              <strong>{profile.irrigation}</strong>
            </div>
          </div>
        </section>

        {/* ================= ACCOUNT ACTIONS ================= */}

        <section className="account-actions-card">
          <div>
            <h3>Account</h3>

            <p>Manage your FarmVerse account.</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="profile-footer">
          © 2026 FarmVerse · Smart Farming Powered by AI
        </footer>
      </main>
    </div>
  );
};

export default Profile;
