import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaLeaf,
  FaCalendarAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8080";

const CropManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================
  // FARM INFORMATION RECEIVED FROM MY FARM
  // =====================================================

  const farmId = location.state?.farmId;
  const farmName = location.state?.farmName;

  // =====================================================
  // STATES
  // =====================================================

  const [crops, setCrops] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [addingCrop, setAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);

  const [cropForm, setCropForm] = useState({
    cropName: "",
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
  });

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // LOAD CROPS
  // =====================================================

  useEffect(() => {
    if (!farmId) {
      setLoading(false);
      return;
    }

    fetchCrops();
  }, [farmId]);

  // =====================================================
  // FETCH CROPS
  // =====================================================

  const fetchCrops = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/crops/farm/${farmId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }

      const data = await response.json();

      console.log("Crop Management data:", data);

      setCrops(data);
    } catch (error) {
      console.error("Error fetching crops:", error);
      alert("Unable to load crops");
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setCropForm({
      ...cropForm,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setCropForm({
      cropName: "",
      cropType: "",
      plantingDate: "",
      expectedHarvestDate: "",
    });

    setAddingCrop(false);
    setEditingCropId(null);
  };

  // =====================================================
  // START ADD
  // =====================================================

  const startAddCrop = () => {
    resetForm();
    setAddingCrop(true);
  };

  // =====================================================
  // SAVE CROP
  // =====================================================

  const saveCrop = async () => {
    if (!farmId) {
      alert("Farm information is missing");
      return;
    }

    if (
      !cropForm.cropName ||
      !cropForm.cropType ||
      !cropForm.plantingDate ||
      !cropForm.expectedHarvestDate
    ) {
      alert("Please fill all crop details");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/crops`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cropName: cropForm.cropName,
            cropType: cropForm.cropType,
            plantingDate: cropForm.plantingDate,
            expectedHarvestDate:
              cropForm.expectedHarvestDate,
            farmId: Number(farmId),
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));

        alert(
          errorData.message ||
            "Failed to add crop"
        );

        return;
      }

      const newCrop = await response.json();

      console.log("New crop:", newCrop);

      setCrops((previous) => [
        ...previous,
        newCrop,
      ]);

      resetForm();

      alert("Crop added successfully!");
    } catch (error) {
      console.error("Error adding crop:", error);
      alert("Unable to connect to backend");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEditCrop = (crop) => {
    setEditingCropId(crop.id);

    setCropForm({
      cropName: crop.cropName || "",
      cropType: crop.cropType || "",
      plantingDate: crop.plantingDate || "",
      expectedHarvestDate:
        crop.expectedHarvestDate || "",
    });

    setAddingCrop(false);
  };

  // =====================================================
  // UPDATE CROP
  // =====================================================

  const updateCrop = async () => {
    if (!editingCropId) {
      return;
    }

    if (
      !cropForm.cropName ||
      !cropForm.cropType ||
      !cropForm.plantingDate ||
      !cropForm.expectedHarvestDate
    ) {
      alert("Please fill all crop details");
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/crops/${editingCropId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cropName: cropForm.cropName,
            cropType: cropForm.cropType,
            plantingDate: cropForm.plantingDate,
            expectedHarvestDate:
              cropForm.expectedHarvestDate,
            farmId: Number(farmId),
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));

        alert(
          errorData.message ||
            "Failed to update crop"
        );

        return;
      }

      const updatedCrop = await response.json();

      console.log(
        "Updated crop:",
        updatedCrop
      );

      setCrops((previous) =>
        previous.map((crop) =>
          crop.id === updatedCrop.id
            ? updatedCrop
            : crop
        )
      );

      resetForm();

      alert("Crop updated successfully!");
    } catch (error) {
      console.error(
        "Error updating crop:",
        error
      );

      alert("Unable to connect to backend");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CROP
  // =====================================================

  const deleteCrop = async (crop) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${crop.cropName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/crops/${crop.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}));

        alert(
          errorData.message ||
            "Failed to delete crop"
        );

        return;
      }

      setCrops((previous) =>
        previous.filter(
          (item) => item.id !== crop.id
        )
      );

      if (editingCropId === crop.id) {
        resetForm();
      }

      alert("Crop deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting crop:",
        error
      );

      alert("Unable to connect to backend");
    }
  };

  // =====================================================
  // FARM ID MISSING
  // =====================================================

  if (!farmId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "40px",
          background: "#f5f8f6",
        }}
      >
        <button
          onClick={() => navigate("/my-farm")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <FaArrowLeft /> Back to My Farm
        </button>

        <h2>
          Farm information not found
        </h2>

        <p>
          Please open Crop Management from
          the My Farm page.
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8f6",
        paddingBottom: "60px",
      }}
    >

      {/* HEADER */}

      <header
        style={{
          background: "#ffffff",
          borderBottom:
            "1px solid #e1e8e3",
          padding: "18px 6%",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >

        <button
          onClick={() => navigate("/my-farm")}
          style={{
            border: "1px solid #dce5df",
            background: "#ffffff",
            borderRadius: "10px",
            padding: "12px 15px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          <FaArrowLeft />
        </button>

        <div>
          <span
            style={{
              color: "#20883e",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
            }}
          >
            FARMVERSE
          </span>

          <h1
            style={{
              margin: "3px 0 0",
              color: "#18231d",
            }}
          >
            Crop Management
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: "#68736c",
            }}
          >
            Farm: {farmName || `Farm #${farmId}`}
          </p>
        </div>

      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 25px",
        }}
      >

        {/* TITLE */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #dfe8e2",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >

          <div>
            <span
              style={{
                color: "#20883e",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "2px",
              }}
            >
              CROP MANAGEMENT
            </span>

            <h2
              style={{
                margin: "8px 0",
                fontSize: "32px",
                color: "#172019",
              }}
            >
              Current Crops
            </h2>

            <p
              style={{
                margin: 0,
                color: "#68736c",
              }}
            >
              Add and manage crops for this
              farm.
            </p>
          </div>

          {!addingCrop &&
            !editingCropId && (
              <button
                onClick={startAddCrop}
                style={{
                  border: "none",
                  background: "#16863c",
                  color: "#ffffff",
                  padding:
                    "12px 20px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaPlus />
                Add Crop
              </button>
            )}

        </div>

        {/* FORM */}

        {(addingCrop || editingCropId) && (
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #dfe8e2",
              borderRadius: "18px",
              padding: "30px",
              marginBottom: "25px",
            }}
          >

            <span
              style={{
                color: "#20883e",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "2px",
              }}
            >
              {editingCropId
                ? "UPDATE CROP"
                : "NEW CROP"}
            </span>

            <h2
              style={{
                marginTop: "8px",
              }}
            >
              {editingCropId
                ? "Edit Crop"
                : "Add Crop"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "20px",
                marginTop: "25px",
              }}
            >

              <div>
                <label>Crop Name</label>

                <input
                  name="cropName"
                  value={cropForm.cropName}
                  onChange={handleChange}
                  placeholder="Example: Tomato"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Crop Type</label>

                <input
                  name="cropType"
                  value={cropForm.cropType}
                  onChange={handleChange}
                  placeholder="Example: Vegetable"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Planting Date</label>

                <input
                  type="date"
                  name="plantingDate"
                  value={cropForm.plantingDate}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>
                  Expected Harvest Date
                </label>

                <input
                  type="date"
                  name="expectedHarvestDate"
                  value={
                    cropForm.expectedHarvestDate
                  }
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
              }}
            >

              <button
                onClick={resetForm}
                style={cancelButtonStyle}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                onClick={
                  editingCropId
                    ? updateCrop
                    : saveCrop
                }
                disabled={saving}
                style={saveButtonStyle}
              >
                <FaSave />

                {saving
                  ? "Saving..."
                  : editingCropId
                  ? "Update Crop"
                  : "Save Crop"}
              </button>

            </div>

          </section>
        )}

        {/* LOADING */}

        {loading && (
          <div
            style={emptyCardStyle}
          >
            <h3>
              Loading crops...
            </h3>
          </div>
        )}

        {/* NO CROPS */}

        {!loading &&
          crops.length === 0 &&
          !addingCrop &&
          !editingCropId && (
            <div
              style={emptyCardStyle}
            >
              <FaLeaf
                style={{
                  fontSize: "45px",
                  color: "#29924a",
                }}
              />

              <h2>
                No Crops Added
              </h2>

              <p>
                Add your first crop to this
                farm.
              </p>

              <button
                onClick={startAddCrop}
                style={saveButtonStyle}
              >
                <FaPlus />
                Add Crop
              </button>
            </div>
          )}

        {/* CROP LIST */}

        {!loading &&
          crops.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "20px",
              }}
            >

              {crops.map((crop) => (
                <div
                  key={crop.id}
                  style={{
                    background: "#ffffff",
                    border:
                      "1px solid #dfe8e2",
                    borderRadius: "18px",
                    padding: "25px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "18px",
                    }}
                  >

                    <div
                      style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "14px",
                        background: "#e8f7ec",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#16863c",
                        fontSize: "24px",
                      }}
                    >
                      <FaLeaf />
                    </div>

                    <div style={{ flex: 1 }}>

                      <span
                        style={{
                          color: "#29924a",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {crop.cropType}
                      </span>

                      <h2
                        style={{
                          margin:
                            "5px 0 12px",
                        }}
                      >
                        {crop.cropName}
                      </h2>

                      <p>
                        <FaCalendarAlt />{" "}
                        Planting:{" "}
                        {crop.plantingDate}
                      </p>

                      <p>
                        <FaCalendarAlt />{" "}
                        Harvest:{" "}
                        {
                          crop.expectedHarvestDate
                        }
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "18px",
                        }}
                      >

                        <button
                          onClick={() =>
                            startEditCrop(
                              crop
                            )
                          }
                          style={
                            editButtonStyle
                          }
                        >
                          <FaEdit />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteCrop(
                              crop
                            )
                          }
                          style={
                            deleteButtonStyle
                          }
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginTop: "7px",
  border: "1px solid #d8e2dc",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const saveButtonStyle = {
  border: "none",
  background: "#16863c",
  color: "#ffffff",
  padding: "11px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const cancelButtonStyle = {
  border: "1px solid #d8e2dc",
  background: "#ffffff",
  padding: "11px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const editButtonStyle = {
  border: "1px solid #d8e2dc",
  background: "#ffffff",
  padding: "9px 14px",
  borderRadius: "7px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const deleteButtonStyle = {
  border: "none",
  background: "#d93636",
  color: "#ffffff",
  padding: "9px 14px",
  borderRadius: "7px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const emptyCardStyle = {
  background: "#ffffff",
  border: "1px solid #dfe8e2",
  borderRadius: "18px",
  padding: "50px",
  textAlign: "center",
};

export default CropManagement;