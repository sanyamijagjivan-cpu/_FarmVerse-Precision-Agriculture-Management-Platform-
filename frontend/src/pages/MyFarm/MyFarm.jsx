
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaSeedling,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaFlask,
  FaTint,
  FaTractor,
  FaWarehouse,
  FaCalendarAlt,
  FaHistory,
  FaCheckCircle,
  FaClock,
  FaLeaf,
  FaWater,
  FaChartLine,
  FaChevronRight,
  FaSprayCan,
  FaTemperatureHigh,
  FaCloudRain,
  FaVial,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./MyFarm.css";

const API_BASE = "http://localhost:8080/api";

const MyFarm = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // =====================================================
  // FARM
  // =====================================================

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const [addingFarm, setAddingFarm] = useState(false);
  const [farmEditing, setFarmEditing] = useState(false);
  const [farmSaving, setFarmSaving] = useState(false);

  const [farmForm, setFarmForm] = useState({
    farmName: "",
    location: "",
    area: "",
    soilType: "",
  });

  // =====================================================
  // CROP
  // =====================================================

  const [crops, setCrops] = useState([]);
  const [addingCrop, setAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [cropSaving, setCropSaving] = useState(false);
  const [cropLoading, setCropLoading] = useState(false);

  const [cropForm, setCropForm] = useState({
    cropName: "",
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
  });

  // =====================================================
  // IRRIGATION
  // =====================================================

  const [irrigations, setIrrigations] = useState([]);
  const [addingIrrigation, setAddingIrrigation] = useState(false);
  const [editingIrrigationId, setEditingIrrigationId] = useState(null);
  const [irrigationSaving, setIrrigationSaving] = useState(false);
  const [irrigationLoading, setIrrigationLoading] = useState(false);

  const [irrigationForm, setIrrigationForm] = useState({
    irrigationType: "",
    waterAmount: "",
    scheduledDate: "",
    startTime: "",
    durationMinutes: "",
    status: "Scheduled",
  });

  // =====================================================
  // ACTIVITY
  // =====================================================

  const [activities, setActivities] = useState([]);
  const [addingActivity, setAddingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [activitySaving, setActivitySaving] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  const [activityForm, setActivityForm] = useState({
    activityName: "",
    activityDate: "",
    description: "",
  });

  // =====================================================
  // SOIL HEALTH
  // =====================================================

  const [soilRecords, setSoilRecords] = useState([]);
  const [soilLoading, setSoilLoading] = useState(false);
  const [soilSaving, setSoilSaving] = useState(false);

  const [addingSoil, setAddingSoil] = useState(false);
  const [editingSoilId, setEditingSoilId] = useState(null);

  const [soilForm, setSoilForm] = useState({
    soilType: "",
    phLevel: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    moisture: "",
    testedDate: "",
  });

  // =====================================================
  // UI
  // =====================================================

  const [activeSection, setActiveSection] = useState("overview");

  const farmDetailsRef = useRef(null);
  const cropSectionRef = useRef(null);
  const soilSectionRef = useRef(null);
  const irrigationSectionRef = useRef(null);
  const activitySectionRef = useRef(null);

  // =====================================================
  // LOAD FARMS
  // =====================================================

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/farms`,
        authConfig
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setFarms(data);

      if (data.length > 0) {
        setSelectedFarm(data[0]);
        setFarmForm({
          farmName: data[0].farmName || "",
          location: data[0].location || "",
          area: data[0].area || "",
          soilType: data[0].soilType || "",
        });
      }
    } catch (error) {
      console.error("Failed to load farms:", error);
    }
  };

  // =====================================================
  // LOAD FARM DATA
  // =====================================================

  useEffect(() => {
    if (selectedFarm?.id) {
      loadCrops();
      loadIrrigation();
      loadActivities();
      loadSoilHealth();
    }
  }, [selectedFarm]);

  // =====================================================
  // SELECT FARM
  // =====================================================

  const selectFarm = (farm) => {
    setSelectedFarm(farm);

    setFarmForm({
      farmName: farm.farmName || "",
      location: farm.location || "",
      area: farm.area || "",
      soilType: farm.soilType || "",
    });

    setAddingCrop(false);
    setEditingCropId(null);
    setAddingSoil(false);
    setEditingSoilId(null);
    setAddingIrrigation(false);
    setEditingIrrigationId(null);
    setAddingActivity(false);
    setEditingActivityId(null);
  };

  // =====================================================
  // FARM
  // =====================================================

  const handleFarmChange = (e) => {
    const { name, value } = e.target;

    setFarmForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveNewFarm = async () => {
    if (!farmForm.farmName || !farmForm.location) {
      alert("Please enter farm name and location.");
      return;
    }

    try {
      setFarmSaving(true);

      const response = await axios.post(
        `${API_BASE}/farms`,
        farmForm,
        authConfig
      );

      const farm = response.data;

      setFarms((prev) => [...prev, farm]);
      setSelectedFarm(farm);

      setAddingFarm(false);

      alert("Farm added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add farm.");
    } finally {
      setFarmSaving(false);
    }
  };

  const updateFarm = async () => {
    if (!selectedFarm?.id) return;

    try {
      setFarmSaving(true);

      const response = await axios.put(
        `${API_BASE}/farms/${selectedFarm.id}`,
        farmForm,
        authConfig
      );

      const updatedFarm = response.data;

      setSelectedFarm(updatedFarm);

      setFarms((prev) =>
        prev.map((farm) =>
          farm.id === updatedFarm.id
            ? updatedFarm
            : farm
        )
      );

      setFarmEditing(false);

      alert("Farm updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update farm.");
    } finally {
      setFarmSaving(false);
    }
  };

  const deleteFarm = async () => {
    if (!selectedFarm?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this farm?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE}/farms/${selectedFarm.id}`,
        authConfig
      );

      const remaining = farms.filter(
        (farm) => farm.id !== selectedFarm.id
      );

      setFarms(remaining);
      setSelectedFarm(
        remaining.length > 0 ? remaining[0] : null
      );

      alert("Farm deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete farm.");
    }
  };

  const cancelFarmEdit = () => {
    setFarmEditing(false);

    if (selectedFarm) {
      setFarmForm({
        farmName: selectedFarm.farmName || "",
        location: selectedFarm.location || "",
        area: selectedFarm.area || "",
        soilType: selectedFarm.soilType || "",
      });
    }
  };

  // =====================================================
  // CROP
  // =====================================================

  const loadCrops = async () => {
    if (!selectedFarm?.id) return;

    try {
      setCropLoading(true);

      const response = await axios.get(
        `${API_BASE}/crops/farm/${selectedFarm.id}`,
        authConfig
      );

      setCrops(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Failed to load crops:", error);
      setCrops([]);
    } finally {
      setCropLoading(false);
    }
  };

  const handleCropChange = (e) => {
    const { name, value } = e.target;

    setCropForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startAddCrop = () => {
    setAddingCrop(true);
    setEditingCropId(null);

    setCropForm({
      cropName: "",
      cropType: "",
      plantingDate: "",
      expectedHarvestDate: "",
    });

    setTimeout(() => {
      cropSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const startEditCrop = (crop) => {
  console.log("Editing crop:", crop);

  setEditingCropId(crop.id);
  setAddingCrop(false);

  setCropForm({
    cropName: crop.cropName || "",
    cropType: crop.cropType || "",
    plantingDate: crop.plantingDate || "",
    expectedHarvestDate:
      crop.expectedHarvestDate || "",
  });
};


  const resetCropForm = () => {
    setAddingCrop(false);
    setEditingCropId(null);

    setCropForm({
      cropName: "",
      cropType: "",
      plantingDate: "",
      expectedHarvestDate: "",
    });
  };

  const saveCrop = async () => {
    if (!selectedFarm?.id) return;

    try {
      setCropSaving(true);

      await axios.post(
        `${API_BASE}/crops`,
        {
          ...cropForm,
          farmId: selectedFarm.id,
        },
        authConfig
      );

      await loadCrops();

      resetCropForm();

      alert("Crop added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add crop.");
    } finally {
      setCropSaving(false);
    }
  };

  // UPDATE CROP
const updateCrop = async () => {
  try {
    setCropSaving(true);

    if (!editingCropId) {
      alert("Crop ID is missing.");
      return;
    }

    if (!selectedFarm?.id) {
      alert("Farm ID is missing. Please select a farm.");
      return;
    }

    const updateData = {
      farmId: selectedFarm.id,
      cropName: cropForm.cropName,
      cropType: cropForm.cropType,
      plantingDate: cropForm.plantingDate,
      expectedHarvestDate: cropForm.expectedHarvestDate,
    };

    console.log("Updating crop:", {
      cropId: editingCropId,
      request: updateData,
    });

    await axios.put(
      `${API_BASE}/crops/${editingCropId}`,
      updateData,
      authConfig
    );

    await loadCrops();

    resetCropForm();

    alert("Crop updated successfully.");

  } catch (error) {
    console.error("Crop update error:", error);

    console.error(
      "Backend response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Failed to update crop."
    );

  } finally {
    setCropSaving(false);
  }
};

  const deleteCrop = async (crop) => {
    const confirmed = window.confirm(
      `Delete ${crop.cropName}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE}/crops/${crop.id}`,
        authConfig
      );

      await loadCrops();
    } catch (error) {
      console.error(error);
      alert("Failed to delete crop.");
    }
  };

  // =====================================================
  // SOIL HEALTH
  // =====================================================

  const loadSoilHealth = async () => {
    if (!selectedFarm?.id) return;

    try {
      setSoilLoading(true);

      const response = await axios.get(
        `${API_BASE}/soil-health/farm/${selectedFarm.id}`,
        authConfig
      );

      setSoilRecords(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load soil health:",
        error
      );

      setSoilRecords([]);
    } finally {
      setSoilLoading(false);
    }
  };

  const handleSoilChange = (e) => {
    const { name, value } = e.target;

    setSoilForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startAddSoil = () => {
    setAddingSoil(true);
    setEditingSoilId(null);

    setSoilForm({
      soilType: selectedFarm?.soilType || "",
      phLevel: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      organicMatter: "",
      moisture: "",
      testedDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setTimeout(() => {
      soilSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const startEditSoil = (soil) => {
    setEditingSoilId(soil.id);
    setAddingSoil(false);

    setSoilForm({
      soilType: soil.soilType || "",
      phLevel: soil.phLevel ?? "",
      nitrogen: soil.nitrogen ?? "",
      phosphorus: soil.phosphorus ?? "",
      potassium: soil.potassium ?? "",
      organicMatter: soil.organicMatter ?? "",
      moisture: soil.moisture ?? "",
      testedDate: soil.testedDate || "",
    });
  };

  const resetSoilForm = () => {
    setAddingSoil(false);
    setEditingSoilId(null);

    setSoilForm({
      soilType: "",
      phLevel: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      organicMatter: "",
      moisture: "",
      testedDate: "",
    });
  };

  const saveSoilHealth = async () => {
    if (!selectedFarm?.id) return;

    if (!soilForm.soilType || !soilForm.testedDate) {
      alert("Please select soil type and tested date.");
      return;
    }

    try {
      setSoilSaving(true);

      await axios.post(
        `${API_BASE}/soil-health`,
        {
          farmId: selectedFarm.id,
          soilType: soilForm.soilType,
          phLevel: soilForm.phLevel
            ? Number(soilForm.phLevel)
            : null,
          nitrogen: soilForm.nitrogen
            ? Number(soilForm.nitrogen)
            : null,
          phosphorus: soilForm.phosphorus
            ? Number(soilForm.phosphorus)
            : null,
          potassium: soilForm.potassium
            ? Number(soilForm.potassium)
            : null,
          organicMatter: soilForm.organicMatter
            ? Number(soilForm.organicMatter)
            : null,
          moisture: soilForm.moisture
            ? Number(soilForm.moisture)
            : null,
          testedDate: soilForm.testedDate,
        },
        authConfig
      );

      await loadSoilHealth();

      resetSoilForm();

      alert("Soil health record saved successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to save soil health."
      );
    } finally {
      setSoilSaving(false);
    }
  };

  const updateSoilHealth = async () => {
    try {
      setSoilSaving(true);

      await axios.put(
        `${API_BASE}/soil-health/${editingSoilId}`,
        {
          farmId: selectedFarm.id,
          soilType: soilForm.soilType,
          phLevel: soilForm.phLevel
            ? Number(soilForm.phLevel)
            : null,
          nitrogen: soilForm.nitrogen
            ? Number(soilForm.nitrogen)
            : null,
          phosphorus: soilForm.phosphorus
            ? Number(soilForm.phosphorus)
            : null,
          potassium: soilForm.potassium
            ? Number(soilForm.potassium)
            : null,
          organicMatter: soilForm.organicMatter
            ? Number(soilForm.organicMatter)
            : null,
          moisture: soilForm.moisture
            ? Number(soilForm.moisture)
            : null,
          testedDate: soilForm.testedDate,
        },
        authConfig
      );

      await loadSoilHealth();

      resetSoilForm();

      alert("Soil health updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update soil health.");
    } finally {
      setSoilSaving(false);
    }
  };

  const deleteSoilHealth = async (soil) => {
    const confirmed = window.confirm(
      "Delete this soil health record?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE}/soil-health/${soil.id}`,
        authConfig
      );

      await loadSoilHealth();
    } catch (error) {
      console.error(error);
      alert("Failed to delete soil health record.");
    }
  };

  const latestSoil =
    soilRecords.length > 0
      ? soilRecords[soilRecords.length - 1]
      : null;

  // =====================================================
  // IRRIGATION
  // =====================================================

  const loadIrrigation = async () => {
    if (!selectedFarm?.id) return;

    try {
      setIrrigationLoading(true);

      const response = await axios.get(
        `${API_BASE}/irrigation/farm/${selectedFarm.id}`,
        authConfig
      );

      setIrrigations(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);
      setIrrigations([]);
    } finally {
      setIrrigationLoading(false);
    }
  };

  const handleIrrigationChange = (e) => {
    const { name, value } = e.target;

    setIrrigationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startAddIrrigation = () => {
    setAddingIrrigation(true);
    setEditingIrrigationId(null);

    setIrrigationForm({
      irrigationType: "",
      waterAmount: "",
      scheduledDate: "",
      startTime: "",
      durationMinutes: "",
      status: "Scheduled",
    });

    setTimeout(() => {
      irrigationSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const startEditIrrigation = (irrigation) => {
    setEditingIrrigationId(irrigation.id);
    setAddingIrrigation(false);

    setIrrigationForm({
      irrigationType:
        irrigation.irrigationType || "",
      waterAmount:
        irrigation.waterAmount ?? "",
      scheduledDate:
        irrigation.scheduledDate || "",
      startTime:
        irrigation.startTime
          ? irrigation.startTime.substring(0, 5)
          : "",
      durationMinutes:
        irrigation.durationMinutes ?? "",
      status:
        irrigation.status || "Scheduled",
    });
  };

  const resetIrrigationForm = () => {
    setAddingIrrigation(false);
    setEditingIrrigationId(null);

    setIrrigationForm({
      irrigationType: "",
      waterAmount: "",
      scheduledDate: "",
      startTime: "",
      durationMinutes: "",
      status: "Scheduled",
    });
  };

  const saveIrrigation = async () => {
    try {
      setIrrigationSaving(true);

      await axios.post(
        `${API_BASE}/irrigation`,
        {
          ...irrigationForm,
          farmId: selectedFarm.id,
          waterAmount: Number(
            irrigationForm.waterAmount
          ),
          durationMinutes: Number(
            irrigationForm.durationMinutes
          ),
        },
        authConfig
      );

      await loadIrrigation();
      resetIrrigationForm();

      alert("Irrigation schedule saved.");
    } catch (error) {
      console.error(error);
      alert("Failed to save irrigation.");
    } finally {
      setIrrigationSaving(false);
    }
  };

  // UPDATE IRRIGATION
const updateIrrigation = async () => {
  try {
    setIrrigationSaving(true);

    if (!editingIrrigationId) {
      alert("Irrigation ID is missing.");
      return;
    }

    if (!selectedFarm?.id) {
      alert("Farm ID is missing. Please select a farm.");
      return;
    }

    const updateData = {
      irrigationType:
        irrigationForm.irrigationType,

      waterAmount:
        irrigationForm.waterAmount === ""
          ? null
          : Number(irrigationForm.waterAmount),

      scheduledDate:
        irrigationForm.scheduledDate,

      startTime:
        irrigationForm.startTime,

      durationMinutes:
        irrigationForm.durationMinutes === ""
          ? null
          : Number(
              irrigationForm.durationMinutes
            ),

      status:
        irrigationForm.status,
    };

    console.log("Updating irrigation:", {
      irrigationId: editingIrrigationId,
      farmId: selectedFarm.id,
      request: updateData,
    });

    await axios.put(
      `${API_BASE}/irrigation/${editingIrrigationId}?farmId=${selectedFarm.id}`,
      updateData,
      authConfig
    );

    await loadIrrigation();

    resetIrrigationForm();

    alert(
      "Irrigation schedule updated successfully."
    );

  } catch (error) {
    console.error(
      "Irrigation update error:",
      error
    );

    console.error(
      "Backend response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      error.response?.data ||
      "Failed to update irrigation."
    );

  } finally {
    setIrrigationSaving(false);
  }
};


  const deleteIrrigation = async (irrigation) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await axios.delete(
        `${API_BASE}/irrigation/${irrigation.id}`,
        authConfig
      );

      await loadIrrigation();
    } catch (error) {
      console.error(error);
      alert("Failed to delete irrigation.");
    }
  };

  // =====================================================
  // ACTIVITY
  // =====================================================

  const loadActivities = async () => {
    if (!selectedFarm?.id) return;

    try {
      setActivityLoading(true);

      const response = await axios.get(
        `${API_BASE}/activities/farm/${selectedFarm.id}`,
        authConfig
      );

      setActivities(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;

    setActivityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startAddActivity = () => {
    setAddingActivity(true);
    setEditingActivityId(null);

    setActivityForm({
      activityName: "",
      activityDate: "",
      description: "",
    });

    setTimeout(() => {
      activitySectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const startEditActivity = (activity) => {
    setEditingActivityId(activity.id);
    setAddingActivity(false);

    setActivityForm({
      activityName:
        activity.activityName || "",
      activityDate:
        activity.activityDate || "",
      description:
        activity.description || "",
    });
  };

  const resetActivityForm = () => {
    setAddingActivity(false);
    setEditingActivityId(null);

    setActivityForm({
      activityName: "",
      activityDate: "",
      description: "",
    });
  };

  const saveActivity = async () => {
    try {
      setActivitySaving(true);

      await axios.post(
        `${API_BASE}/activities`,
        {
          ...activityForm,
          farmId: selectedFarm.id,
        },
        authConfig
      );

      await loadActivities();
      resetActivityForm();

      alert("Activity added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add activity.");
    } finally {
      setActivitySaving(false);
    }
  };

  // UPDATE ACTIVITY
const updateActivity = async () => {
  try {
    setActivitySaving(true);

    if (!editingActivityId) {
      alert("Activity ID is missing.");
      return;
    }

    if (!selectedFarm?.id) {
      alert("Farm ID is missing. Please select a farm.");
      return;
    }

    const updateData = {
      farmId: selectedFarm.id,
      activityName: activityForm.activityName.trim(),
      activityDate: activityForm.activityDate,
      description: activityForm.description.trim(),
    };

    console.log("Updating activity:", {
      activityId: editingActivityId,
      farmId: selectedFarm.id,
      request: updateData,
    });

    await axios.put(
      `${API_BASE}/activities/${editingActivityId}`,
      updateData,
      authConfig
    );

    await loadActivities();

    resetActivityForm();

    alert("Activity updated successfully.");

  } catch (error) {
    console.error("Activity update error:", error);
    console.error(
      "Backend response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      error.response?.data ||
      "Failed to update activity."
    );

  } finally {
    setActivitySaving(false);
  }
};

  const deleteActivity = async (activity) => {
    if (!window.confirm("Delete this activity?")) return;

    try {
      await axios.delete(
        `${API_BASE}/activities/${activity.id}`,
        authConfig
      );

      await loadActivities();
    } catch (error) {
      console.error(error);
      alert("Failed to delete activity.");
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const scrollToSection = (ref, section) => {
    setActiveSection(section);

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =====================================================
  // SOIL SCORE
  // =====================================================

  const getSoilStatus = () => {
    if (!latestSoil) return "No Test";

    const ph = Number(latestSoil.phLevel);

    if (ph >= 6 && ph <= 7.5) {
      return "Healthy";
    }

    if (ph >= 5.5 && ph <= 8) {
      return "Moderate";
    }

    return "Needs Attention";
  };

  const soilStatus = getSoilStatus();

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="myfarm-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="myfarm-topbar">

        <div className="topbar-brand">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
          </button>

          <div className="brand-mark">
            <FaSeedling />
          </div>

          <div>
            <span className="brand-name">
              FARMVERSE
            </span>

            <span className="brand-subtitle">
              Precision Agriculture
            </span>
          </div>

        </div>

        <div className="topbar-actions">

          {selectedFarm && (
            <div className="farm-status-pill">
              <span className="status-dot"></span>
              Farm Active
            </div>
          )}

          <button
            className="primary-button"
            onClick={() => {
              setAddingFarm(true);
              setFarmEditing(false);

              setFarmForm({
                farmName: "",
                location: "",
                area: "",
                soilType: "",
              });
            }}
          >
            <FaPlus />
            Add Farm
          </button>

        </div>

      </header>

      <main className="myfarm-content">

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <section className="page-heading">

          <div>
            <span className="eyebrow">
              FARM MANAGEMENT
            </span>

            <h1>
              My Farm
            </h1>

            <p>
              Manage your farm, crops, soil health,
              irrigation and daily activities from
              one place.
            </p>
          </div>

          {selectedFarm && (
            <div className="heading-location">
              <FaMapMarkerAlt />
              <span>
                {selectedFarm.location}
              </span>
            </div>
          )}

        </section>

        {/* =================================================
            FARM SELECTOR
        ================================================= */}

        {farms.length > 0 && !addingFarm && (

          <section className="farm-selector">

            <div className="section-heading compact">

              <div>
                <span className="eyebrow">
                  YOUR FARMS
                </span>

                <h2>
                  Select a Farm
                </h2>
              </div>

              <span className="farm-count">
                {farms.length} farm
                {farms.length > 1 ? "s" : ""}
              </span>

            </div>

            <div className="farm-selector-grid">

              {farms.map((farm) => (

                <button
                  key={farm.id}
                  className={`farm-selector-card ${
                    selectedFarm?.id === farm.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    selectFarm(farm)
                  }
                >

                  <div className="farm-selector-icon">
                    <FaSeedling />
                  </div>

                  <div className="farm-selector-info">

                    <strong>
                      {farm.farmName}
                    </strong>

                    <span>
                      <FaMapMarkerAlt />
                      {farm.location}
                    </span>

                  </div>

                  <FaChevronRight />

                </button>

              ))}

            </div>

          </section>
        )}

        {/* =================================================
            ADD FARM
        ================================================= */}

        {addingFarm && (

          <section className="modern-form-card">

            <div className="form-card-header">

              <div>
                <span className="eyebrow">
                  NEW FARM
                </span>

                <h2>
                  Add Your Farm
                </h2>

                <p>
                  Enter the basic information about
                  your farm.
                </p>
              </div>

              <div className="form-header-icon">
                <FaSeedling />
              </div>

            </div>

            <div className="form-grid">

              <div className="input-group">
                <label>Farm Name</label>
                <input
                  name="farmName"
                  value={farmForm.farmName}
                  onChange={handleFarmChange}
                  placeholder="Example: Green Valley Farm"
                />
              </div>

              <div className="input-group">
                <label>Location</label>
                <input
                  name="location"
                  value={farmForm.location}
                  onChange={handleFarmChange}
                  placeholder="Example: Nagercoil"
                />
              </div>

              <div className="input-group">
                <label>Farm Area</label>

                <div className="input-with-unit">
                  <input
                    type="number"
                    name="area"
                    value={farmForm.area}
                    onChange={handleFarmChange}
                    placeholder="10"
                  />

                  <span>Acres</span>
                </div>
              </div>

              <div className="input-group">
                <label>Soil Type</label>

                <select
                  name="soilType"
                  value={farmForm.soilType}
                  onChange={handleFarmChange}
                >
                  <option value="">
                    Select soil type
                  </option>

                  <option value="Black Soil">
                    Black Soil
                  </option>

                  <option value="Loamy Soil">
                    Loamy Soil
                  </option>

                  <option value="Clay Soil">
                    Clay Soil
                  </option>

                  <option value="Sandy Soil">
                    Sandy Soil
                  </option>

                  <option value="Red Soil">
                    Red Soil
                  </option>
                </select>
              </div>

            </div>

            <div className="form-footer">

              <button
                className="secondary-button"
                onClick={() => setAddingFarm(false)}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={saveNewFarm}
                disabled={farmSaving}
              >
                <FaSave />
                {farmSaving
                  ? "Saving..."
                  : "Save Farm"}
              </button>

            </div>

          </section>
        )}

        {/* =================================================
            SELECTED FARM
        ================================================= */}

        {selectedFarm && !addingFarm && (

          <>

            {/* =================================================
                HERO
            ================================================= */}

            <section className="farm-hero">

              <div className="hero-content">

                <div className="hero-icon">
                  <FaSeedling />
                </div>

                <div className="hero-info">

                  <span>
                    CURRENT FARM
                  </span>

                  <h2>
                    {selectedFarm.farmName}
                  </h2>

                  <p>
                    <FaMapMarkerAlt />
                    {selectedFarm.location}
                  </p>

                </div>

              </div>

              <div className="hero-meta">

                <div>
                  <span>AREA</span>
                  <strong>
                    {selectedFarm.area || 0}
                  </strong>
                  <small>Acres</small>
                </div>

                <div>
                  <span>SOIL</span>
                  <strong>
                    {selectedFarm.soilType
                      ? "Set"
                      : "—"}
                  </strong>
                  <small>
                    {selectedFarm.soilType ||
                      "Not added"}
                  </small>
                </div>

                <div>
                  <span>STATUS</span>
                  <strong>
                    Active
                  </strong>
                  <small>
                    Farm running
                  </small>
                </div>

              </div>

            </section>

            {/* =================================================
                QUICK NAVIGATION
            ================================================= */}

            <nav className="farm-navigation">

              <button
                className={
                  activeSection === "overview"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                Overview
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    cropSectionRef,
                    "crops"
                  )
                }
              >
                Crops
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    soilSectionRef,
                    "soil"
                  )
                }
              >
                Soil Health
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    irrigationSectionRef,
                    "irrigation"
                  )
                }
              >
                Irrigation
              </button>

              <button
                onClick={() =>
                  scrollToSection(
                    activitySectionRef,
                    "activity"
                  )
                }
              >
                Activities
              </button>

            </nav>

            {/* =================================================
                OVERVIEW
            ================================================= */}

            <section className="overview-section">

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    OVERVIEW
                  </span>

                  <h2>
                    Farm at a Glance
                  </h2>
                </div>

                <button
                  className="outline-button"
                  onClick={() =>
                    setFarmEditing(true)
                  }
                >
                  <FaEdit />
                  Edit Farm
                </button>

              </div>

              <div className="stats-grid">

                <div className="overview-stat">

                  <div className="stat-top">
                    <div className="stat-icon green">
                      <FaRulerCombined />
                    </div>

                    <span>
                      FARM AREA
                    </span>
                  </div>

                  <strong>
                    {selectedFarm.area || 0}
                    <small> Acres</small>
                  </strong>

                  <p>
                    Total cultivated area
                  </p>

                </div>

                <div className="overview-stat">

                  <div className="stat-top">
                    <div className="stat-icon leaf">
                      <FaLeaf />
                    </div>

                    <span>
                      CURRENT CROPS
                    </span>
                  </div>

                  <strong>
                    {crops.length}
                  </strong>

                  <p>
                    Crops currently managed
                  </p>

                </div>

                <div className="overview-stat">

                  <div className="stat-top">
                    <div className="stat-icon blue">
                      <FaTint />
                    </div>

                    <span>
                      IRRIGATION
                    </span>
                  </div>

                  <strong>
                    {irrigations.length}
                  </strong>

                  <p>
                    Active schedules
                  </p>

                </div>

                <div className="overview-stat">

                  <div className="stat-top">
                    <div className="stat-icon orange">
                      <FaFlask />
                    </div>

                    <span>
                      SOIL HEALTH
                    </span>
                  </div>

                  <strong className="status-text">
                    {soilStatus}
                  </strong>

                  <p>
                    Latest soil assessment
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                FARM DETAILS
            ================================================= */}

            {farmEditing && (

              <section
                ref={farmDetailsRef}
                className="modern-form-card"
              >

                <div className="form-card-header">

                  <div>
                    <span className="eyebrow">
                      FARM INFORMATION
                    </span>

                    <h2>
                      Edit Farm Details
                    </h2>
                  </div>

                  <div className="form-header-icon">
                    <FaEdit />
                  </div>

                </div>

                <div className="form-grid">

                  <div className="input-group">
                    <label>Farm Name</label>

                    <input
                      name="farmName"
                      value={farmForm.farmName}
                      onChange={handleFarmChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Location</label>

                    <input
                      name="location"
                      value={farmForm.location}
                      onChange={handleFarmChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Farm Area</label>

                    <div className="input-with-unit">

                      <input
                        type="number"
                        name="area"
                        value={farmForm.area}
                        onChange={handleFarmChange}
                      />

                      <span>Acres</span>

                    </div>
                  </div>

                  <div className="input-group">
                    <label>Soil Type</label>

                    <select
                      name="soilType"
                      value={farmForm.soilType}
                      onChange={handleFarmChange}
                    >
                      <option value="">
                        Select soil type
                      </option>

                      <option value="Black Soil">
                        Black Soil
                      </option>

                      <option value="Loamy Soil">
                        Loamy Soil
                      </option>

                      <option value="Clay Soil">
                        Clay Soil
                      </option>

                      <option value="Sandy Soil">
                        Sandy Soil
                      </option>

                      <option value="Red Soil">
                        Red Soil
                      </option>
                    </select>
                  </div>

                </div>

                <div className="form-footer">

                  <button
                    className="secondary-button"
                    onClick={cancelFarmEdit}
                  >
                    <FaTimes />
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={updateFarm}
                    disabled={farmSaving}
                  >
                    <FaSave />
                    {farmSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </section>
            )}

            {/* =================================================
                CROP MANAGEMENT
            ================================================= */}

            <section
              ref={cropSectionRef}
              className="management-section"
            >

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    CROP MANAGEMENT
                  </span>

                  <h2>
                    Current Crops
                  </h2>

                  <p>
                    Monitor and manage crops planted
                    on this farm.
                  </p>
                </div>

                {!addingCrop &&
                  !editingCropId && (

                    <button
                      className="primary-button"
                      onClick={startAddCrop}
                    >
                      <FaPlus />
                      Add Crop
                    </button>

                  )}

              </div>

              {(addingCrop ||
                editingCropId) && (

                <div className="inline-form-card">

                  <div className="inline-form-title">
                    <FaSeedling />

                    <div>
                      <span>
                        {editingCropId
                          ? "UPDATE CROP"
                          : "NEW CROP"}
                      </span>

                      <h3>
                        {editingCropId
                          ? "Edit Crop"
                          : "Add Crop"}
                      </h3>
                    </div>
                  </div>

                  <div className="form-grid">

                    <div className="input-group">
                      <label>Crop Name</label>

                      <input
                        name="cropName"
                        value={
                          cropForm.cropName
                        }
                        onChange={
                          handleCropChange
                        }
                        placeholder="Example: Tomato"
                      />
                    </div>

                    <div className="input-group">
                      <label>Crop Type</label>

                      <input
                        name="cropType"
                        value={
                          cropForm.cropType
                        }
                        onChange={
                          handleCropChange
                        }
                        placeholder="Example: Vegetable"
                      />
                    </div>

                    <div className="input-group">
                      <label>Planting Date</label>

                      <input
                        type="date"
                        name="plantingDate"
                        value={
                          cropForm.plantingDate
                        }
                        onChange={
                          handleCropChange
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Expected Harvest
                      </label>

                      <input
                        type="date"
                        name="expectedHarvestDate"
                        value={
                          cropForm.expectedHarvestDate
                        }
                        onChange={
                          handleCropChange
                        }
                      />
                    </div>

                  </div>

                  <div className="form-footer">

                    <button
                      className="secondary-button"
                      onClick={resetCropForm}
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={
                        editingCropId
                          ? updateCrop
                          : saveCrop
                      }
                      disabled={cropSaving}
                    >
                      <FaSave />

                      {cropSaving
                        ? "Saving..."
                        : editingCropId
                        ? "Update Crop"
                        : "Save Crop"}
                    </button>

                  </div>

                </div>
              )}

              {cropLoading ? (

                <div className="empty-state">
                  <div className="loading-spinner"></div>
                  <h3>
                    Loading crops...
                  </h3>
                </div>

              ) : crops.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    <FaLeaf />
                  </div>

                  <h3>
                    No Crops Added
                  </h3>

                  <p>
                    Add your first crop to start
                    managing production.
                  </p>

                  <button
                    className="primary-button"
                    onClick={startAddCrop}
                  >
                    <FaPlus />
                    Add First Crop
                  </button>

                </div>

              ) : (

                <div className="modern-card-grid">

                  {crops.map((crop) => (

                    <article
                      className="crop-modern-card"
                      key={crop.id}
                    >

                      <div className="crop-card-top">

                        <div className="crop-image-placeholder">
                          <FaLeaf />
                        </div>

                        <span className="crop-type">
                          {crop.cropType}
                        </span>

                      </div>

                      <div className="crop-card-body">

                        <h3>
                          {crop.cropName}
                        </h3>

                        <div className="crop-info-row">
                          <FaCalendarAlt />
                          <span>
                            Planted
                          </span>
                          <strong>
                            {crop.plantingDate ||
                              "—"}
                          </strong>
                        </div>

                        <div className="crop-info-row">
                          <FaCheckCircle />
                          <span>
                            Harvest
                          </span>
                          <strong>
                            {crop.expectedHarvestDate ||
                              "—"}
                          </strong>
                        </div>

                      </div>

                      <div className="card-actions">

                        <button
                          className="outline-button"
                          onClick={() =>
                            startEditCrop(crop)
                          }
                        >
                          <FaEdit />
                          Edit
                        </button>

                        <button
                          className="danger-outline-button"
                          onClick={() =>
                            deleteCrop(crop)
                          }
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>

            {/* =================================================
                SOIL HEALTH
            ================================================= */}

            <section
              ref={soilSectionRef}
              className="soil-section"
            >

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    SOIL INTELLIGENCE
                  </span>

                  <h2>
                    Soil Health
                  </h2>

                  <p>
                    Record and monitor the chemical
                    and physical condition of your soil.
                  </p>
                </div>

                {!addingSoil &&
                  !editingSoilId && (

                    <button
                      className="primary-button"
                      onClick={startAddSoil}
                    >
                      <FaPlus />
                      Add Soil Test
                    </button>

                  )}

              </div>

              {/* SOIL SUMMARY */}

              <div className="soil-summary">

                <div className="soil-health-main">

                  <div className="soil-health-icon">
                    <FaFlask />
                  </div>

                  <div>

                    <span>
                      LATEST SOIL STATUS
                    </span>

                    <h3>
                      {soilStatus}
                    </h3>

                    <p>
                      {latestSoil
                        ? `Last tested on ${latestSoil.testedDate}`
                        : "No soil test has been recorded yet."}
                    </p>

                  </div>

                </div>

                <div className="soil-summary-value">

                  <span>
                    pH LEVEL
                  </span>

                  <strong>
                    {latestSoil?.phLevel ??
                      "—"}
                  </strong>

                </div>

              </div>

              {/* SOIL METRICS */}

              {latestSoil && (

                <div className="soil-metrics-grid">

                  <div className="soil-metric">

                    <div className="metric-icon nitrogen">
                      <FaVial />
                    </div>

                    <span>
                      Nitrogen
                    </span>

                    <strong>
                      {latestSoil.nitrogen ??
                        "—"}
                    </strong>

                    <small>
                      mg/kg
                    </small>

                  </div>

                  <div className="soil-metric">

                    <div className="metric-icon phosphorus">
                      <FaFlask />
                    </div>

                    <span>
                      Phosphorus
                    </span>

                    <strong>
                      {latestSoil.phosphorus ??
                        "—"}
                    </strong>

                    <small>
                      mg/kg
                    </small>

                  </div>

                  <div className="soil-metric">

                    <div className="metric-icon potassium">
                      <FaSeedling />
                    </div>

                    <span>
                      Potassium
                    </span>

                    <strong>
                      {latestSoil.potassium ??
                        "—"}
                    </strong>

                    <small>
                      mg/kg
                    </small>

                  </div>

                  <div className="soil-metric">

                    <div className="metric-icon organic">
                      <FaLeaf />
                    </div>

                    <span>
                      Organic Matter
                    </span>

                    <strong>
                      {latestSoil.organicMatter ??
                        "—"}
                    </strong>

                    <small>
                      %
                    </small>

                  </div>

                  <div className="soil-metric">

                    <div className="metric-icon moisture">
                      <FaTint />
                    </div>

                    <span>
                      Moisture
                    </span>

                    <strong>
                      {latestSoil.moisture ??
                        "—"}
                    </strong>

                    <small>
                      %
                    </small>

                  </div>

                  <div className="soil-metric">

                    <div className="metric-icon ph">
                      <FaVial />
                    </div>

                    <span>
                      Soil pH
                    </span>

                    <strong>
                      {latestSoil.phLevel ??
                        "—"}
                    </strong>

                    <small>
                      pH
                    </small>

                  </div>

                </div>
              )}

              {/* SOIL FORM */}

              {(addingSoil ||
                editingSoilId) && (

                <div className="soil-form-card">

                  <div className="form-card-header">

                    <div>
                      <span className="eyebrow">
                        {editingSoilId
                          ? "UPDATE TEST"
                          : "NEW SOIL TEST"}
                      </span>

                      <h2>
                        {editingSoilId
                          ? "Edit Soil Health"
                          : "Record Soil Health"}
                      </h2>

                      <p>
                        Enter the latest soil
                        laboratory or field test values.
                      </p>
                    </div>

                    <div className="soil-form-icon">
                      <FaFlask />
                    </div>

                  </div>

                  <div className="form-grid soil-form-grid">

                    <div className="input-group">
                      <label>Soil Type</label>

                      <select
                        name="soilType"
                        value={
                          soilForm.soilType
                        }
                        onChange={
                          handleSoilChange
                        }
                      >
                        <option value="">
                          Select soil type
                        </option>

                        <option value="Black Soil">
                          Black Soil
                        </option>

                        <option value="Loamy Soil">
                          Loamy Soil
                        </option>

                        <option value="Clay Soil">
                          Clay Soil
                        </option>

                        <option value="Sandy Soil">
                          Sandy Soil
                        </option>

                        <option value="Red Soil">
                          Red Soil
                        </option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>
                        pH Level
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        name="phLevel"
                        value={
                          soilForm.phLevel
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="6.5"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Nitrogen (mg/kg)
                      </label>

                      <input
                        type="number"
                        name="nitrogen"
                        value={
                          soilForm.nitrogen
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="45"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Phosphorus (mg/kg)
                      </label>

                      <input
                        type="number"
                        name="phosphorus"
                        value={
                          soilForm.phosphorus
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="30"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Potassium (mg/kg)
                      </label>

                      <input
                        type="number"
                        name="potassium"
                        value={
                          soilForm.potassium
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="40"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Organic Matter (%)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        name="organicMatter"
                        value={
                          soilForm.organicMatter
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="3.2"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Moisture (%)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        name="moisture"
                        value={
                          soilForm.moisture
                        }
                        onChange={
                          handleSoilChange
                        }
                        placeholder="28"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Tested Date
                      </label>

                      <input
                        type="date"
                        name="testedDate"
                        value={
                          soilForm.testedDate
                        }
                        onChange={
                          handleSoilChange
                        }
                      />
                    </div>

                  </div>

                  <div className="form-footer">

                    <button
                      className="secondary-button"
                      onClick={resetSoilForm}
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={
                        editingSoilId
                          ? updateSoilHealth
                          : saveSoilHealth
                      }
                      disabled={soilSaving}
                    >
                      <FaSave />

                      {soilSaving
                        ? "Saving..."
                        : editingSoilId
                        ? "Update Soil Test"
                        : "Save Soil Test"}
                    </button>

                  </div>

                </div>
              )}

              {/* SOIL HISTORY */}

              <div className="soil-history">

                <div className="subsection-heading">

                  <div>
                    <h3>
                      Soil Test History
                    </h3>

                    <p>
                      Previous soil health records
                      for this farm.
                    </p>
                  </div>

                </div>

                {soilLoading ? (

                  <div className="empty-state small">
                    <div className="loading-spinner"></div>
                    <h3>
                      Loading soil records...
                    </h3>
                  </div>

                ) : soilRecords.length === 0 ? (

                  <div className="empty-state small">

                    <div className="empty-icon">
                      <FaFlask />
                    </div>

                    <h3>
                      No Soil Tests Yet
                    </h3>

                    <p>
                      Add your first soil test to
                      start tracking soil health.
                    </p>

                    <button
                      className="primary-button"
                      onClick={startAddSoil}
                    >
                      <FaPlus />
                      Add Soil Test
                    </button>

                  </div>

                ) : (

                  <div className="soil-record-list">

                    {soilRecords
                      .slice()
                      .reverse()
                      .map((soil) => (

                        <article
                          className="soil-record"
                          key={soil.id}
                        >

                          <div className="soil-record-icon">
                            <FaFlask />
                          </div>

                          <div className="soil-record-main">

                            <div className="soil-record-title">

                              <div>
                                <span>
                                  {soil.soilType}
                                </span>

                                <h3>
                                  Soil Health Test
                                </h3>
                              </div>

                              <strong>
                                {soil.testedDate}
                              </strong>

                            </div>

                            <div className="soil-record-values">

                              <span>
                                pH <strong>
                                  {soil.phLevel ?? "—"}
                                </strong>
                              </span>

                              <span>
                                N <strong>
                                  {soil.nitrogen ?? "—"}
                                </strong>
                              </span>

                              <span>
                                P <strong>
                                  {soil.phosphorus ?? "—"}
                                </strong>
                              </span>

                              <span>
                                K <strong>
                                  {soil.potassium ?? "—"}
                                </strong>
                              </span>

                              <span>
                                Organic <strong>
                                  {soil.organicMatter ?? "—"}%
                                </strong>
                              </span>

                              <span>
                                Moisture <strong>
                                  {soil.moisture ?? "—"}%
                                </strong>
                              </span>

                            </div>

                          </div>

                          <div className="record-actions">

                            <button
                              className="icon-button"
                              onClick={() =>
                                startEditSoil(soil)
                              }
                              title="Edit"
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="icon-button danger"
                              onClick={() =>
                                deleteSoilHealth(
                                  soil
                                )
                              }
                              title="Delete"
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </article>

                      ))}

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                IRRIGATION
            ================================================= */}

            <section
              ref={irrigationSectionRef}
              className="management-section"
            >

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    WATER MANAGEMENT
                  </span>

                  <h2>
                    Irrigation Schedule
                  </h2>

                  <p>
                    Plan and monitor water usage
                    across your farm.
                  </p>
                </div>

                {!addingIrrigation &&
                  !editingIrrigationId && (

                    <button
                      className="primary-button"
                      onClick={
                        startAddIrrigation
                      }
                    >
                      <FaPlus />
                      Add Schedule
                    </button>

                  )}

              </div>

              {(addingIrrigation ||
                editingIrrigationId) && (

                <div className="inline-form-card">

                  <div className="inline-form-title">
                    <FaTint />

                    <div>
                      <span>
                        {editingIrrigationId
                          ? "UPDATE SCHEDULE"
                          : "NEW SCHEDULE"}
                      </span>

                      <h3>
                        {editingIrrigationId
                          ? "Edit Irrigation"
                          : "Schedule Irrigation"}
                      </h3>
                    </div>
                  </div>

                  <div className="form-grid">

                    <div className="input-group">
                      <label>
                        Irrigation Type
                      </label>

                      <select
                        name="irrigationType"
                        value={
                          irrigationForm.irrigationType
                        }
                        onChange={
                          handleIrrigationChange
                        }
                      >
                        <option value="">
                          Select type
                        </option>

                        <option value="Drip Irrigation">
                          Drip Irrigation
                        </option>

                        <option value="Sprinkler Irrigation">
                          Sprinkler Irrigation
                        </option>

                        <option value="Flood Irrigation">
                          Flood Irrigation
                        </option>

                        <option value="Rain Gun">
                          Rain Gun
                        </option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>
                        Water Amount
                      </label>

                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="waterAmount"
                          value={
                            irrigationForm.waterAmount
                          }
                          onChange={
                            handleIrrigationChange
                          }
                          placeholder="500"
                        />

                        <span>Litres</span>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>
                        Scheduled Date
                      </label>

                      <input
                        type="date"
                        name="scheduledDate"
                        value={
                          irrigationForm.scheduledDate
                        }
                        onChange={
                          handleIrrigationChange
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Start Time
                      </label>

                      <input
                        type="time"
                        name="startTime"
                        value={
                          irrigationForm.startTime
                        }
                        onChange={
                          handleIrrigationChange
                        }
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Duration
                      </label>

                      <div className="input-with-unit">
                        <input
                          type="number"
                          name="durationMinutes"
                          value={
                            irrigationForm.durationMinutes
                          }
                          onChange={
                            handleIrrigationChange
                          }
                          placeholder="30"
                        />

                        <span>Minutes</span>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Status</label>

                      <select
                        name="status"
                        value={
                          irrigationForm.status
                        }
                        onChange={
                          handleIrrigationChange
                        }
                      >
                        <option value="Scheduled">
                          Scheduled
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="form-footer">

                    <button
                      className="secondary-button"
                      onClick={
                        resetIrrigationForm
                      }
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={
                        editingIrrigationId
                          ? updateIrrigation
                          : saveIrrigation
                      }
                      disabled={
                        irrigationSaving
                      }
                    >
                      <FaSave />

                      {irrigationSaving
                        ? "Saving..."
                        : editingIrrigationId
                        ? "Update Schedule"
                        : "Save Schedule"}
                    </button>

                  </div>

                </div>
              )}

              {irrigationLoading ? (

                <div className="empty-state">
                  <div className="loading-spinner"></div>
                  <h3>
                    Loading schedules...
                  </h3>
                </div>

              ) : irrigations.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon blue-icon">
                    <FaTint />
                  </div>

                  <h3>
                    No Irrigation Scheduled
                  </h3>

                  <p>
                    Create a schedule to manage
                    your farm's water usage.
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      startAddIrrigation
                    }
                  >
                    <FaPlus />
                    Schedule Irrigation
                  </button>

                </div>

              ) : (

                <div className="irrigation-list">

                  {irrigations.map(
                    (irrigation) => (

                      <article
                        className="irrigation-card"
                        key={irrigation.id}
                      >

                        <div className="irrigation-icon">
                          <FaTint />
                        </div>

                        <div className="irrigation-main">

                          <div className="irrigation-title">

                            <div>
                              <span>
                                {
                                  irrigation.irrigationType
                                }
                              </span>

                              <h3>
                                {
                                  irrigation.status ||
                                  "Scheduled"
                                }
                              </h3>
                            </div>

                            <span
                              className={`status-badge ${
                                (
                                  irrigation.status ||
                                  "Scheduled"
                                ).toLowerCase()
                              }`}
                            >
                              {
                                irrigation.status ||
                                "Scheduled"
                              }
                            </span>

                          </div>

                          <div className="irrigation-details">

                            <span>
                              <FaCalendarAlt />
                              {
                                irrigation.scheduledDate ||
                                "—"
                              }
                            </span>

                            <span>
                              <FaClock />
                              {irrigation.startTime
                                ? irrigation.startTime.substring(
                                    0,
                                    5
                                  )
                                : "—"}
                            </span>

                            <span>
                              <FaWater />
                              {
                                irrigation.waterAmount ??
                                "—"
                              }{" "}
                              L
                            </span>

                            <span>
                              <FaClock />
                              {
                                irrigation.durationMinutes ??
                                "—"
                              }{" "}
                              min
                            </span>

                          </div>

                        </div>

                        <div className="record-actions">

                          <button
                            className="icon-button"
                            onClick={() =>
                              startEditIrrigation(
                                irrigation
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="icon-button danger"
                            onClick={() =>
                              deleteIrrigation(
                                irrigation
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )}

            </section>

            {/* =================================================
                RESOURCES
            ================================================= */}

            <section className="resources-section">

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    FARM RESOURCES
                  </span>

                  <h2>
                    Resources
                  </h2>
                </div>

              </div>

              <div className="resource-modern-grid">

                <div className="resource-modern-card">

                  <div className="resource-modern-icon blue">
                    <FaWater />
                  </div>

                  <div>
                    <span>
                      Water Management
                    </span>

                    <strong>
                      {irrigations.length > 0
                        ? "Configured"
                        : "Not Configured"}
                    </strong>
                  </div>

                </div>

                <div className="resource-modern-card">

                  <div className="resource-modern-icon green">
                    <FaTractor />
                  </div>

                  <div>
                    <span>
                      Equipment
                    </span>

                    <strong>
                      Not Added
                    </strong>
                  </div>

                </div>

                <div className="resource-modern-card">

                  <div className="resource-modern-icon orange">
                    <FaWarehouse />
                  </div>

                  <div>
                    <span>
                      Storage
                    </span>

                    <strong>
                      Not Added
                    </strong>
                  </div>

                </div>

                <div className="resource-modern-card">

                  <div className="resource-modern-icon purple">
                    <FaChartLine />
                  </div>

                  <div>
                    <span>
                      Soil Records
                    </span>

                    <strong>
                      {soilRecords.length} Record
                      {soilRecords.length !== 1
                        ? "s"
                        : ""}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="quick-actions">

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    QUICK ACTIONS
                  </span>

                  <h2>
                    Manage Your Farm
                  </h2>
                </div>

              </div>

              <div className="quick-action-grid">

                <button
                  className="quick-action-card"
                  onClick={startAddCrop}
                >
                  <div className="quick-action-icon green">
                    <FaSeedling />
                  </div>

                  <div>
                    <strong>
                      Add Crop
                    </strong>

                    <span>
                      Register a new crop
                    </span>
                  </div>

                  <FaChevronRight />
                </button>

                <button
                  className="quick-action-card"
                  onClick={startAddSoil}
                >
                  <div className="quick-action-icon orange">
                    <FaFlask />
                  </div>

                  <div>
                    <strong>
                      Soil Health
                    </strong>

                    <span>
                      Record soil test
                    </span>
                  </div>

                  <FaChevronRight />
                </button>

                <button
                  className="quick-action-card"
                  onClick={
                    startAddIrrigation
                  }
                >
                  <div className="quick-action-icon blue">
                    <FaTint />
                  </div>

                  <div>
                    <strong>
                      Irrigation
                    </strong>

                    <span>
                      Schedule watering
                    </span>
                  </div>

                  <FaChevronRight />
                </button>

                <button
                  className="quick-action-card"
                  onClick={startAddActivity}
                >
                  <div className="quick-action-icon purple">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <strong>
                      Farm Activity
                    </strong>

                    <span>
                      Record farm work
                    </span>
                  </div>

                  <FaChevronRight />
                </button>

              </div>

            </section>

            {/* =================================================
                ACTIVITIES
            ================================================= */}

            <section
              ref={activitySectionRef}
              className="activity-section"
            >

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    FARM ACTIVITY
                  </span>

                  <h2>
                    Recent Activities
                  </h2>

                  <p>
                    Keep track of important work
                    performed on your farm.
                  </p>
                </div>

                {!addingActivity &&
                  !editingActivityId && (

                    <button
                      className="primary-button"
                      onClick={
                        startAddActivity
                      }
                    >
                      <FaPlus />
                      Add Activity
                    </button>

                  )}

              </div>

              {(addingActivity ||
                editingActivityId) && (

                <div className="inline-form-card">

                  <div className="inline-form-title">
                    <FaCalendarAlt />

                    <div>
                      <span>
                        {editingActivityId
                          ? "UPDATE ACTIVITY"
                          : "NEW ACTIVITY"}
                      </span>

                      <h3>
                        {editingActivityId
                          ? "Edit Activity"
                          : "Add Farm Activity"}
                      </h3>
                    </div>
                  </div>

                  <div className="form-grid">

                    <div className="input-group">
                      <label>
                        Activity Name
                      </label>

                      <input
                        name="activityName"
                        value={
                          activityForm.activityName
                        }
                        onChange={
                          handleActivityChange
                        }
                        placeholder="Example: Fertilizer application"
                      />
                    </div>

                    <div className="input-group">
                      <label>
                        Activity Date
                      </label>

                      <input
                        type="date"
                        name="activityDate"
                        value={
                          activityForm.activityDate
                        }
                        onChange={
                          handleActivityChange
                        }
                      />
                    </div>

                    <div className="input-group full-width">
                      <label>
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={
                          activityForm.description
                        }
                        onChange={
                          handleActivityChange
                        }
                        placeholder="Describe the farm activity..."
                        rows="4"
                      />
                    </div>

                  </div>

                  <div className="form-footer">

                    <button
                      className="secondary-button"
                      onClick={
                        resetActivityForm
                      }
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={
                        editingActivityId
                          ? updateActivity
                          : saveActivity
                      }
                      disabled={
                        activitySaving
                      }
                    >
                      <FaSave />

                      {activitySaving
                        ? "Saving..."
                        : editingActivityId
                        ? "Update Activity"
                        : "Save Activity"}
                    </button>

                  </div>

                </div>
              )}

              {activityLoading ? (

                <div className="empty-state small">
                  <div className="loading-spinner"></div>

                  <h3>
                    Loading activities...
                  </h3>
                </div>

              ) : activities.length === 0 ? (

                <div className="empty-state small">

                  <div className="empty-icon purple-icon">
                    <FaCalendarAlt />
                  </div>

                  <h3>
                    No Activities Recorded
                  </h3>

                  <p>
                    Record farm activities to keep
                    a useful history.
                  </p>

                  <button
                    className="primary-button"
                    onClick={startAddActivity}
                  >
                    <FaPlus />
                    Add Activity
                  </button>

                </div>

              ) : (

                <div className="timeline">

                  {activities.map(
                    (activity) => (

                      <article
                        className="timeline-item"
                        key={activity.id}
                      >

                        <div className="timeline-dot">
                          <FaCheckCircle />
                        </div>

                        <div className="timeline-content">

                          <div className="timeline-header">

                            <div>
                              <span>
                                {activity.activityDate}
                              </span>

                              <h3>
                                {
                                  activity.activityName
                                }
                              </h3>
                            </div>

                            <div className="timeline-actions">

                              <button
                                className="icon-button"
                                onClick={() =>
                                  startEditActivity(
                                    activity
                                  )
                                }
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="icon-button danger"
                                onClick={() =>
                                  deleteActivity(
                                    activity
                                  )
                                }
                              >
                                <FaTrash />
                              </button>

                            </div>

                          </div>

                          <p>
                            {activity.description ||
                              "Farm activity recorded."}
                          </p>

                        </div>

                      </article>

                    )
                  )}

                </div>

              )}

            </section>

            {/* =================================================
                FARM HISTORY
            ================================================= */}

            <section className="history-section">

              <div className="section-heading">

                <div>
                  <span className="eyebrow">
                    PREVIOUS SEASONS
                  </span>

                  <h2>
                    Farm History
                  </h2>
                </div>

                <FaHistory className="history-icon" />

              </div>

              <div className="history-empty">

                <FaHistory />

                <h3>
                  No Previous Season Data
                </h3>

                <p>
                  Historical crop yield information
                  will appear here when available.
                </p>

              </div>

            </section>

            {/* =================================================
                FARM DANGER AREA
            ================================================= */}

            <section className="danger-zone">

              <div>

                <span>
                  FARM SETTINGS
                </span>

                <h3>
                  Delete Farm
                </h3>

                <p>
                  Permanently remove this farm and
                  its associated information.
                </p>

              </div>

              <button
                className="danger-button"
                onClick={deleteFarm}
              >
                <FaTrash />
                Delete Farm
              </button>

            </section>

          </>
        )}

        {/* =================================================
            NO FARM
        ================================================= */}

        {farms.length === 0 &&
          !addingFarm && (

            <section className="no-farm-screen">

              <div className="no-farm-icon">
                <FaSeedling />
              </div>

              <span className="eyebrow">
                GET STARTED
              </span>

              <h2>
                Create Your First Farm
              </h2>

              <p>
                Start managing your crops, soil
                health, irrigation and farm activities
                with FarmVerse.
              </p>

              <button
                className="primary-button large"
                onClick={() => {
                  setAddingFarm(true);

                  setFarmForm({
                    farmName: "",
                    location: "",
                    area: "",
                    soilType: "",
                  });
                }}
              >
                <FaPlus />
                Add My First Farm
              </button>

            </section>

          )}

      </main>

    </div>
  );
};

export default MyFarm;

