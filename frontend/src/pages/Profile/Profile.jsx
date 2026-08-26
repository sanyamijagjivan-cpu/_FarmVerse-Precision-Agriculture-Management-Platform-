
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserCircle,
  FaLeaf,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTie,
  FaLanguage,
  FaBriefcase,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Profile.css";

const API_URL = "http://localhost:8080/api/users/profile";

const Profile = () => {
  const navigate = useNavigate();

  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const [profile, setProfile] = React.useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    village: "",
    farmerType: "",
    farmingExperience: "",
    preferredLanguage: "",
  });

  const [tempProfile, setTempProfile] = React.useState(profile);

  /* =====================================================
     GET JWT TOKEN
  ===================================================== */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken") ||
      localStorage.getItem("accessToken")
    );
  };

  /* =====================================================
     LOAD LOGGED-IN USER PROFILE
  ===================================================== */

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("accessToken");

          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load profile");
        }

        const data = await response.json();

        setProfile(data);
        setTempProfile(data);
      } catch (err) {
        console.error("Profile loading error:", err);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setError("");
    setSaved(false);
    setEditing(true);
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (field, value) => {
    setTempProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tempProfile.name,
          phone: tempProfile.phone,
          state: tempProfile.state,
          district: tempProfile.district,
          village: tempProfile.village,
          farmerType: tempProfile.farmerType,
          farmingExperience: tempProfile.farmingExperience,
          preferredLanguage: tempProfile.preferredLanguage,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const updatedProfile = await response.json();

      setProfile(updatedProfile);
      setTempProfile(updatedProfile);
      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Unable to update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setError("");
    setEditing(false);
  };

  /* =====================================================
     DASHBOARD
  ===================================================== */

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  /* =====================================================
     SETTINGS
  ===================================================== */

  const goToSettings = () => {
    navigate("/settings");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("farmverseUser");

    navigate("/login");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="profile-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            color: "#4b9962",
          }}
        >
          Loading your profile...
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="profile-page">

      {/* ================= HEADER ================= */}

      <header className="profile-header">

        <div className="profile-header-left">

          <button
            className="profile-back-btn"
            onClick={goToDashboard}
          >
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

        <button
          className="profile-settings-btn"
          onClick={goToSettings}
        >
          Settings
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main className="profile-container">

        {/* TITLE */}

        <div className="profile-title">

          <span>ACCOUNT</span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account details.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div
            className="profile-success"
            style={{
              background: "#fff5f5",
              borderColor: "#f0cccc",
              color: "#c34848",
            }}
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}

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
                  value={tempProfile.name || ""}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="Your name"
                />
              ) : (
                <h2>
                  {profile.name || "Your Name"}
                </h2>
              )}

              <span>
                {profile.farmerType
                  ? `${profile.farmerType} · FarmVerse`
                  : "Farm Owner · FarmVerse"}
              </span>

            </div>

            {!editing && (
              <button
                className="profile-edit-btn"
                onClick={handleEdit}
              >
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

                <strong>
                  {profile.email || "Not available"}
                </strong>

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
                    value={tempProfile.phone || ""}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                  />
                ) : (
                  <strong>
                    {profile.phone || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* STATE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div>

                <span>State</span>

                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.state || ""}
                    onChange={(e) =>
                      handleChange("state", e.target.value)
                    }
                    placeholder="Enter state"
                  />
                ) : (
                  <strong>
                    {profile.state || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* DISTRICT */}

            <div className="profile-field">

              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div>

                <span>District</span>

                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.district || ""}
                    onChange={(e) =>
                      handleChange("district", e.target.value)
                    }
                    placeholder="Enter district"
                  />
                ) : (
                  <strong>
                    {profile.district || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* VILLAGE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaMapMarkerAlt />
              </div>

              <div>

                <span>Village / Town</span>

                {editing ? (
                  <input
                    type="text"
                    value={tempProfile.village || ""}
                    onChange={(e) =>
                      handleChange("village", e.target.value)
                    }
                    placeholder="Enter village or town"
                  />
                ) : (
                  <strong>
                    {profile.village || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* FARMER TYPE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaUserTie />
              </div>

              <div>

                <span>Farmer Type</span>

                {editing ? (
                  <select
                    value={tempProfile.farmerType || ""}
                    onChange={(e) =>
                      handleChange("farmerType", e.target.value)
                    }
                  >
                    <option value="">
                      Select farmer type
                    </option>

                    <option value="Farm Owner">
                      Farm Owner
                    </option>

                    <option value="Tenant Farmer">
                      Tenant Farmer
                    </option>

                    <option value="Agricultural Worker">
                      Agricultural Worker
                    </option>

                    <option value="Farmer Producer">
                      Farmer Producer
                    </option>
                  </select>
                ) : (
                  <strong>
                    {profile.farmerType || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaBriefcase />
              </div>

              <div>

                <span>Farming Experience</span>

                {editing ? (
                  <select
                    value={tempProfile.farmingExperience || ""}
                    onChange={(e) =>
                      handleChange(
                        "farmingExperience",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select experience
                    </option>

                    <option value="Less than 1 year">
                      Less than 1 year
                    </option>

                    <option value="1 - 5 years">
                      1 - 5 years
                    </option>

                    <option value="5 - 10 years">
                      5 - 10 years
                    </option>

                    <option value="10 - 20 years">
                      10 - 20 years
                    </option>

                    <option value="More than 20 years">
                      More than 20 years
                    </option>
                  </select>
                ) : (
                  <strong>
                    {profile.farmingExperience || "Not added"}
                  </strong>
                )}

              </div>

            </div>

            {/* LANGUAGE */}

            <div className="profile-field">

              <div className="field-icon">
                <FaLanguage />
              </div>

              <div>

                <span>Preferred Language</span>

                {editing ? (
                  <select
                    value={tempProfile.preferredLanguage || ""}
                    onChange={(e) =>
                      handleChange(
                        "preferredLanguage",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select language
                    </option>

                    <option value="Tamil">
                      Tamil
                    </option>

                    <option value="English">
                      English
                    </option>

                    <option value="Hindi">
                      Hindi
                    </option>

                    <option value="Malayalam">
                      Malayalam
                    </option>

                    <option value="Telugu">
                      Telugu
                    </option>

                    <option value="Kannada">
                      Kannada
                    </option>
                  </select>
                ) : (
                  <strong>
                    {profile.preferredLanguage || "Not added"}
                  </strong>
                )}

              </div>

            </div>

          </div>

          {/* ACTIONS */}

          {editing && (
            <div className="profile-actions">

              <button
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <FaSave />

                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          )}

        </section>

        {/* ================= PROFILE SUMMARY ================= */}

        <section className="profile-summary">

          <div className="summary-item">

            <div className="summary-icon green">
              <FaMapMarkerAlt />
            </div>

            <div>

              <span>Location</span>

              <strong>
                {profile.district
                  ? `${profile.district}${
                      profile.state
                        ? `, ${profile.state}`
                        : ""
                    }`
                  : "Not added"}
              </strong>

            </div>

          </div>

          <div className="summary-item">

            <div className="summary-icon blue">
              <FaBriefcase />
            </div>

            <div>

              <span>Experience</span>

              <strong>
                {profile.farmingExperience || "Not added"}
              </strong>

            </div>

          </div>

          <div className="summary-item">

            <div className="summary-icon water">
              <FaLanguage />
            </div>

            <div>

              <span>Language</span>

              <strong>
                {profile.preferredLanguage || "Not added"}
              </strong>

            </div>

          </div>

        </section>

        {/* ================= ACCOUNT ================= */}

        <section className="account-actions-card">

          <div>

            <h3>Account</h3>

            <p>
              Manage your FarmVerse account.
            </p>

          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>

        </section>

        {/* FOOTER */}

        <footer className="profile-footer">
          © 2026 FarmVerse · Smart Farming Powered by AI
        </footer>

      </main>

    </div>
  );
};

export default Profile;
