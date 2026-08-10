import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaSeedling,
  FaRulerCombined,
  FaTint,
  FaFlask,
  FaCalendarAlt,
  FaSave,
  FaTimes,
  FaWater,
  FaTractor,
  FaWarehouse,
  FaPlus,
  FaCheckCircle,
  FaChartLine,
  FaLeaf,
  FaClock,
  FaHistory,
} from "react-icons/fa";

import "./MyFarm.css";

const MyFarm = () => {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [farm, setFarm] = useState({
    name: "Green Valley Farm",
    location: "Pune, Maharashtra",
    area: "2.5",
    soil: "Black Soil",
    crop: "Cotton",
    sowingDate: "15 June 2026",
    harvestDate: "20 October 2026",
    irrigation: "Drip Irrigation",
    waterSource: "Borewell",
    farmType: "Crop Farm",
  });

  const [form, setForm] = useState(farm);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveFarm = () => {
    setFarm(form);
    setEditing(false);
  };

  const cancelEdit = () => {
    setForm(farm);
    setEditing(false);
  };

  return (
    <div className="myfarm-page">
      {/* HEADER */}
      <header className="myfarm-header">
        <div className="myfarm-header-left">
          <button
            className="myfarm-back"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
          </button>

          <div>
            <span>FARMVERSE</span>
            <h1>My Farm</h1>
          </div>
        </div>

        {!editing && (
          <button className="edit-farm-btn" onClick={() => setEditing(true)}>
            <FaEdit />
            Edit Farm
          </button>
        )}
      </header>

      <main className="myfarm-container">
        {/* FARM HERO */}
        <section className="farm-hero">
          <div className="farm-hero-icon">
            <FaSeedling />
          </div>

          <div className="farm-hero-info">
            <span>MY FARM</span>
            <h2>{farm.name}</h2>

            <p>
              <FaMapMarkerAlt />
              {farm.location}
            </p>
          </div>

          <div className="farm-type">
            <span>FARM TYPE</span>
            <strong>{farm.farmType}</strong>
          </div>
        </section>

        {/* FARM OVERVIEW */}
        <section className="section-block">
          <div className="section-title">
            <div>
              <span>OVERVIEW</span>
              <h2>Farm Overview</h2>
            </div>
          </div>

          <div className="farm-stats">
            <div className="farm-stat-card">
              <div className="stat-icon">
                <FaRulerCombined />
              </div>

              <div>
                <span>Farm Area</span>
                <strong>{farm.area} Acres</strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="stat-icon">
                <FaSeedling />
              </div>

              <div>
                <span>Current Crop</span>
                <strong>{farm.crop}</strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="stat-icon">
                <FaFlask />
              </div>

              <div>
                <span>Soil Type</span>
                <strong>{farm.soil}</strong>
              </div>
            </div>

            <div className="farm-stat-card">
              <div className="stat-icon">
                <FaTint />
              </div>

              <div>
                <span>Irrigation</span>
                <strong>{farm.irrigation}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* FARM DETAILS */}
        <section className="farm-details-card">
          <div className="section-title">
            <div>
              <span>FARM INFORMATION</span>
              <h2>Farm Details</h2>
            </div>
          </div>

          {!editing ? (
            <div className="details-grid">
              <div className="detail-item">
                <span>Farm Name</span>
                <strong>{farm.name}</strong>
              </div>

              <div className="detail-item">
                <span>Location</span>
                <strong>{farm.location}</strong>
              </div>

              <div className="detail-item">
                <span>Farm Area</span>
                <strong>{farm.area} Acres</strong>
              </div>

              <div className="detail-item">
                <span>Soil Type</span>
                <strong>{farm.soil}</strong>
              </div>

              <div className="detail-item">
                <span>Water Source</span>
                <strong>{farm.waterSource}</strong>
              </div>

              <div className="detail-item">
                <span>Irrigation Method</span>
                <strong>{farm.irrigation}</strong>
              </div>
            </div>
          ) : (
            <div className="farm-form">
              <div className="form-field">
                <label>Farm Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Farm Area (Acres)</label>
                <input name="area" value={form.area} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Farm Type</label>
                <select
                  name="farmType"
                  value={form.farmType}
                  onChange={handleChange}
                >
                  <option>Crop Farm</option>
                  <option>Organic Farm</option>
                  <option>Mixed Farm</option>
                  <option>Commercial Farm</option>
                </select>
              </div>

              <div className="form-field">
                <label>Soil Type</label>
                <select name="soil" value={form.soil} onChange={handleChange}>
                  <option>Black Soil</option>
                  <option>Loamy Soil</option>
                  <option>Clay Soil</option>
                  <option>Sandy Soil</option>
                  <option>Red Soil</option>
                </select>
              </div>

              <div className="form-field">
                <label>Current Crop</label>
                <input name="crop" value={form.crop} onChange={handleChange} />
              </div>

              <div className="form-field">
                <label>Water Source</label>
                <select
                  name="waterSource"
                  value={form.waterSource}
                  onChange={handleChange}
                >
                  <option>Borewell</option>
                  <option>Well</option>
                  <option>Canal</option>
                  <option>Rainwater</option>
                  <option>River</option>
                </select>
              </div>

              <div className="form-field">
                <label>Irrigation Method</label>
                <select
                  name="irrigation"
                  value={form.irrigation}
                  onChange={handleChange}
                >
                  <option>Drip Irrigation</option>
                  <option>Sprinkler Irrigation</option>
                  <option>Flood Irrigation</option>
                  <option>Rainfed</option>
                </select>
              </div>

              <div className="form-field">
                <label>Sowing Date</label>
                <input
                  name="sowingDate"
                  value={form.sowingDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Expected Harvest</label>
                <input
                  name="harvestDate"
                  value={form.harvestDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button className="cancel-btn" onClick={cancelEdit}>
                  <FaTimes />
                  Cancel
                </button>

                <button className="save-btn" onClick={saveFarm}>
                  <FaSave />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </section>

        {/* CURRENT CROP */}
        <section className="crop-section">
          <div className="section-title">
            <div>
              <span>CROP MANAGEMENT</span>
              <h2>Current Crop</h2>
            </div>

            <button className="small-action">
              <FaPlus />
              Add Crop
            </button>
          </div>

          <div className="crop-card">
            <div className="crop-icon">
              <FaLeaf />
            </div>

            <div className="crop-main">
              <span>CURRENT CROP</span>
              <h2>{farm.crop}</h2>

              <p>
                <FaCalendarAlt />
                Sown on {farm.sowingDate}
              </p>
            </div>

            <div className="crop-info">
              <span>Expected Harvest</span>
              <strong>{farm.harvestDate}</strong>
            </div>

            <div className="crop-info">
              <span>Growth Stage</span>
              <strong>Flowering</strong>
            </div>
          </div>

          <div className="growth-box">
            <div className="growth-heading">
              <span>Crop Growth Progress</span>
              <strong>65%</strong>
            </div>

            <div className="growth-bar">
              <div style={{ width: "65%" }}></div>
            </div>

            <div className="growth-stages">
              <span className="active">Sowing</span>
              <span className="active">Germination</span>
              <span className="active">Vegetative</span>
              <span className="active">Flowering</span>
              <span>Harvest</span>
            </div>
          </div>
        </section>

        {/* HEALTH SCORE */}
        <section className="health-section">
          <div className="section-title">
            <div>
              <span>FARM CONDITION</span>
              <h2>Farm Health Score</h2>
            </div>
          </div>

          <div className="health-grid">
            <div className="health-score-card">
              <div className="score-circle">
                <div>
                  <strong>82</strong>
                  <span>/100</span>
                </div>
              </div>

              <div>
                <h3>Good Condition</h3>
                <p>Your farm is currently in a healthy condition.</p>
              </div>
            </div>

            <div className="health-item">
              <div>
                <span>Soil Health</span>
                <strong>85%</strong>
              </div>

              <div className="health-progress">
                <div style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="health-item">
              <div>
                <span>Crop Health</span>
                <strong>88%</strong>
              </div>

              <div className="health-progress">
                <div style={{ width: "88%" }}></div>
              </div>
            </div>

            <div className="health-item">
              <div>
                <span>Water Status</span>
                <strong>72%</strong>
              </div>

              <div className="health-progress">
                <div style={{ width: "72%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* FARM RESOURCES */}
        <section className="resources-section">
          <div className="section-title">
            <div>
              <span>RESOURCES</span>
              <h2>Farm Resources</h2>
            </div>
          </div>

          <div className="resource-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <FaWater />
              </div>

              <div>
                <span>Water Source</span>
                <strong>{farm.waterSource}</strong>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <FaTint />
              </div>

              <div>
                <span>Irrigation</span>
                <strong>{farm.irrigation}</strong>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <FaTractor />
              </div>

              <div>
                <span>Equipment</span>
                <strong>4 Available</strong>
              </div>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <FaWarehouse />
              </div>

              <div>
                <span>Storage</span>
                <strong>Good Capacity</strong>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="actions-section">
          <div className="section-title">
            <div>
              <span>QUICK ACTIONS</span>
              <h2>Manage Your Farm</h2>
            </div>
          </div>

          <div className="action-grid">
            <button className="action-card">
              <FaSeedling />
              <div>
                <strong>Add Crop</strong>
                <span>Manage farm crops</span>
              </div>
            </button>

            <button className="action-card">
              <FaFlask />
              <div>
                <strong>Update Soil</strong>
                <span>Record soil information</span>
              </div>
            </button>

            <button className="action-card">
              <FaTint />
              <div>
                <strong>Schedule Irrigation</strong>
                <span>Manage water usage</span>
              </div>
            </button>

            <button className="action-card">
              <FaCalendarAlt />
              <div>
                <strong>Farm Activity</strong>
                <span>Add new activity</span>
              </div>
            </button>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="activity-section">
          <div className="section-title">
            <div>
              <span>FARM ACTIVITY</span>
              <h2>Recent Activities</h2>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon completed">
                <FaCheckCircle />
              </div>

              <div className="activity-content">
                <strong>Irrigation completed</strong>
                <span>Drip irrigation was completed for the cotton field.</span>
              </div>

              <div className="activity-time">
                <FaClock />
                Today
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <FaFlask />
              </div>

              <div className="activity-content">
                <strong>Soil monitoring</strong>
                <span>Soil moisture and nutrient levels were checked.</span>
              </div>

              <div className="activity-time">
                <FaClock />
                Yesterday
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <FaSeedling />
              </div>

              <div className="activity-content">
                <strong>Crop monitoring</strong>
                <span>Cotton crop growth stage was updated.</span>
              </div>

              <div className="activity-time">
                <FaClock />2 days ago
              </div>
            </div>
          </div>
        </section>

        {/* FARM HISTORY */}
        <section className="history-section">
          <div className="section-title">
            <div>
              <span>PREVIOUS SEASONS</span>
              <h2>Farm History</h2>
            </div>

            <FaHistory className="section-icon" />
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Crop</th>
                  <th>Area</th>
                  <th>Yield</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>2025 - Kharif</td>
                  <td>Soybean</td>
                  <td>2.5 Acres</td>
                  <td>18 Quintals</td>
                  <td>
                    <span className="status-good">Completed</span>
                  </td>
                </tr>

                <tr>
                  <td>2025 - Rabi</td>
                  <td>Wheat</td>
                  <td>2.5 Acres</td>
                  <td>21 Quintals</td>
                  <td>
                    <span className="status-good">Completed</span>
                  </td>
                </tr>

                <tr>
                  <td>2024 - Kharif</td>
                  <td>Cotton</td>
                  <td>2 Acres</td>
                  <td>14 Quintals</td>
                  <td>
                    <span className="status-good">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyFarm;
