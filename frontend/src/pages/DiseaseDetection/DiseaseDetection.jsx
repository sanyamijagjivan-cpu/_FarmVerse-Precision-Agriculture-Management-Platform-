
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCloudUploadAlt,
  FaLeaf,
  FaRobot,
  FaSearch,
  FaShieldAlt,
  FaRedo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaTimes,
  FaHistory,
} from "react-icons/fa";

import "./DiseaseDetection.css";

const API_BASE_URL = "http://localhost:8080";

const DiseaseDetection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const [cropName, setCropName] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // =========================================================
  // JWT TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("jwtToken") ||
      localStorage.getItem("accessToken")
    );
  };

  // =========================================================
  // LOAD HISTORY
  // =========================================================

  const loadScanHistory = async () => {
    try {
      setHistoryLoading(true);

      const token = getToken();

      if (!token) {
        setScanHistory([]);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/disease-detection/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to load scan history: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Scan history:", data);

      setScanHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Scan history error:", error);
      setScanHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadScanHistory();
  }, []);

  // =========================================================
  // IMAGE VALIDATION
  // =========================================================

  const validateImage = (file) => {
    if (!file) {
      return false;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return false;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Please select an image smaller than 10 MB.");
      return false;
    }

    return true;
  };

  // =========================================================
  // SET IMAGE
  // =========================================================

  const setImageFile = (file) => {
    if (!validateImage(file)) {
      return;
    }

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setSelectedImage(previewUrl);
    setImageName(file.name);

    setShowResult(false);
    setDiagnosis(null);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      setImageFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // =========================================================
  // ANALYZE
  // =========================================================

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload a crop image first.");
      return;
    }

    if (!cropName.trim()) {
      alert("Please enter the crop name.");
      return;
    }

    if (!symptoms.trim()) {
      alert("Please enter the symptoms.");
      return;
    }

    const token = getToken();

    if (!token) {
      alert(
        "Your login session was not found. Please login again."
      );

      navigate("/login");
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);
    setDiagnosis(null);

    try {
      const formData = new FormData();

      formData.append("image", selectedFile);
      formData.append("cropName", cropName.trim());
      formData.append("symptoms", symptoms.trim());

      console.log("Sending disease detection request...");

      const response = await fetch(
        `${API_BASE_URL}/api/disease-detection`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "Authentication failed. Please login again."
        );
      }

      if (!response.ok) {
        let errorMessage = "";

        try {
          errorMessage = await response.text();
        } catch {
          errorMessage = "";
        }

        throw new Error(
          `Disease detection failed with status ${response.status}${
            errorMessage ? `: ${errorMessage}` : ""
          }`
        );
      }

      const data = await response.json();

      console.log(
        "Disease detection response:",
        data
      );

      // -------------------------------------------------------
      // MAKE SURE OBSERVATIONS IS ALWAYS AN ARRAY
      // -------------------------------------------------------

      const normalizedData = {
        ...data,

        observations: Array.isArray(data.observations)
          ? data.observations
          : [],

        severity:
          data.severity || "Unknown",

        prevention:
          data.prevention ||
          "Maintain good crop hygiene and monitor the plant regularly.",
      };

      setDiagnosis(normalizedData);
      setShowResult(true);

      await loadScanHistory();

    } catch (error) {
      console.error(
        "Disease detection error:",
        error
      );

      if (
        error.message.includes(
          "Authentication failed"
        )
      ) {
        alert(
          "Your login session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("accessToken");

        navigate("/login");
      } else {
        alert(
          error.message ||
          "Unable to analyze the image. Please try again."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(null);
    setSelectedFile(null);
    setImageName("");

    setCropName("");
    setSymptoms("");

    setShowResult(false);
    setIsAnalyzing(false);
    setDiagnosis(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // CONFIDENCE
  // =========================================================

  const getConfidence = () => {
    const confidence =
      Number(diagnosis?.confidence);

    if (Number.isNaN(confidence)) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, confidence)
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="disease-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="disease-navbar">

        <button
          className="back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FaArrowLeft />

          <span>
            Back to FarmVerse
          </span>
        </button>

        <div className="disease-logo">

          <div className="disease-logo-icon">
            <FaLeaf />
          </div>

          <span>
            FarmVerse
          </span>

        </div>

        <button
          className="ai-nav-button"
          onClick={() =>
            navigate(
              "/ai-farming-assistant",
              {
                state: {
                  prompt:
                    "Based on my crop disease detection results, what treatment and farming practices should I follow?",
                },
              }
            )
          }
        >
          <FaRobot />

          <span>
            AI Assistant
          </span>
        </button>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="disease-main">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="disease-hero">

          <div className="disease-hero-badge">

            <FaShieldAlt />

            <span>
              AI CROP HEALTH INTELLIGENCE
            </span>

          </div>

          <h1>
            Protect Your Crops
            <br />
            With <span>Intelligent Diagnosis</span>
          </h1>

          <p>
            Upload a clear image of your crop leaf and provide
            the symptoms to receive an AI-powered disease
            assessment.
          </p>

        </section>

        {/* ===================================================
            WORKSPACE
        =================================================== */}

        <section className="diagnosis-workspace">

          {/* =================================================
              UPLOAD PANEL
          ================================================= */}

          <div className="upload-panel">

            <div className="panel-heading">

              <div>

                <span className="panel-label">
                  STEP 01
                </span>

                <h2>
                  Upload Crop Image
                </h2>

              </div>

              <div className="panel-icon">
                <FaCloudUploadAlt />
              </div>

            </div>

            {/* IMAGE UPLOAD */}

            <div
              className={`upload-area ${
                selectedImage
                  ? "has-image"
                  : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                hidden
              />

              {selectedImage ? (

                <div className="image-preview-wrapper">

                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="crop-preview"
                  />

                  <div className="image-overlay">

                    <span>
                      Change Image
                    </span>

                  </div>

                </div>

              ) : (

                <>

                  <div className="upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <h3>
                    Upload a crop leaf image
                  </h3>

                  <p>
                    Drag &amp; drop your image here or
                    <span>
                      {" "}browse files
                    </span>
                  </p>

                  <small>
                    JPG, JPEG, PNG or WEBP •
                    Clear images give better results
                  </small>

                </>

              )}

            </div>

            {/* FILE INFORMATION */}

            {imageName && (

              <div className="selected-file">

                <div className="file-info">

                  <FaCheckCircle />

                  <div>

                    <strong>
                      {imageName}
                    </strong>

                    <span>
                      Image ready for AI analysis
                    </span>

                  </div>

                </div>

                <button
                  className="remove-image"
                  onClick={(event) => {

                    event.stopPropagation();

                    handleReset();

                  }}
                  aria-label="Remove image"
                >
                  <FaTimes />
                </button>

              </div>

            )}

            {/* CROP NAME */}

            <div className="disease-input-group">

              <label>
                Crop Name
              </label>

              <input
                type="text"
                placeholder="Example: Tomato"
                value={cropName}
                onChange={(event) =>
                  setCropName(
                    event.target.value
                  )
                }
              />

            </div>

            {/* SYMPTOMS */}

            <div className="disease-input-group">

              <label>
                Symptoms
              </label>

              <textarea
                placeholder="Example: Brown spots on leaves, yellowing and leaf edges turning dark"
                value={symptoms}
                onChange={(event) =>
                  setSymptoms(
                    event.target.value
                  )
                }
                rows="3"
              />

            </div>

            {/* ANALYZE */}

            <button
              className={`analyze-button ${
                isAnalyzing
                  ? "analyzing"
                  : ""
              }`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >

              {isAnalyzing ? (

                <>

                  <span className="loading-spinner"></span>

                  AI Analyzing Image...

                </>

              ) : (

                <>

                  <FaSearch />

                  Analyze Crop

                  <FaArrowRight />

                </>

              )}

            </button>

          </div>

          {/* =================================================
              RESULT PANEL
          ================================================= */}

          <div className="result-panel">

            <div className="panel-heading">

              <div>

                <span className="panel-label">
                  STEP 02
                </span>

                <h2>
                  AI Diagnosis
                </h2>

              </div>

              <div className="panel-icon result-icon">
                <FaChartLine />
              </div>

            </div>

            {!showResult ? (

              <div className="empty-result">

                <div className="result-placeholder-icon">
                  <FaLeaf />
                </div>

                <h3>
                  Your diagnosis will appear here
                </h3>

                <p>
                  Upload a crop image, enter the crop
                  information and start the AI analysis.
                </p>

                <div className="result-features">

                  <div>
                    <FaCheckCircle />
                    <span>
                      Image-based disease identification
                    </span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>
                      AI confidence score
                    </span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>
                      Treatment recommendation
                    </span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>
                      Prevention guidance
                    </span>
                  </div>

                </div>

              </div>

            ) : (

              <div className="diagnosis-result">

                {/* =================================================
                    DIAGNOSIS STATUS
                ================================================= */}

                <div className="diagnosis-status">

                  <div className="status-icon">

                    {getConfidence() >= 60 ? (
                      <FaExclamationTriangle />
                    ) : (
                      <FaSearch />
                    )}

                  </div>

                  <div>

                    <span>
                      AI DETECTED CONDITION
                    </span>

                    <h3>
                      {diagnosis?.disease ||
                        "Unable to determine"}
                    </h3>

                  </div>

                </div>

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="diagnosis-stats">

                  <div className="diagnosis-stat">

                    <span>
                      Crop
                    </span>

                    <strong>
                      {diagnosis?.cropName ||
                        cropName}
                    </strong>

                  </div>

                  <div className="diagnosis-stat">

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {getConfidence()}%
                    </strong>

                  </div>

                </div>

                {/* =================================================
                    CONFIDENCE
                ================================================= */}

                <div className="diagnosis-progress">

                  <div className="progress-header">

                    <span>
                      AI Confidence
                    </span>

                    <strong>
                      {getConfidence()}%
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${getConfidence()}%`,
                      }}
                    />

                  </div>

                </div>

                {/* =================================================
                    WHAT AI FOUND
                ================================================= */}

                <div className="result-section">

                  <h4>
                    What the AI found
                  </h4>

                  <p>
                    FarmVerse AI analyzed the uploaded
                    crop image together with the symptoms
                    you provided.
                  </p>

                </div>

                {/* =================================================
                    OBSERVATIONS
                ================================================= */}

                {diagnosis?.observations?.length > 0 && (

                  <div className="result-section">

                    <h4>
                      Observations
                    </h4>

                    <ul className="observations-list">

                      {diagnosis.observations.map(
                        (observation, index) => (

                          <li key={index}>

                            <FaCheckCircle />

                            <span>
                              {observation}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                )}

                {/* =================================================
                    SEVERITY
                ================================================= */}

                <div className="result-section">

                  <h4>
                    Severity
                  </h4>

                  <p>
                    {diagnosis?.severity ||
                      "Unknown"}
                  </p>

                </div>

                {/* =================================================
                    RECOMMENDATION
                ================================================= */}

                <div className="result-section">

                  <h4>
                    Recommended action
                  </h4>

                  <p>
                    {diagnosis?.recommendation ||
                      "Please consult a local agricultural expert if symptoms continue."}
                  </p>

                </div>

                {/* =================================================
                    PREVENTION
                ================================================= */}

                <div className="result-section">

                  <h4>
                    Prevention
                  </h4>

                  <p>
                    {diagnosis?.prevention ||
                      "Maintain good crop hygiene and monitor the plant regularly."}
                  </p>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="result-actions">

                  <button
                    className="ask-ai-button"
                    onClick={() =>
                      navigate(
                        "/ai-farming-assistant",
                        {
                          state: {
                            prompt: `I analyzed my ${cropName} crop using FarmVerse AI disease detection. The result was ${diagnosis?.disease || "Unable to determine"} with ${getConfidence()}% confidence. Severity: ${diagnosis?.severity || "Unknown"}. Observations: ${diagnosis?.observations?.join(", ") || "None available"}. Recommendation: ${diagnosis?.recommendation || "None available"}. Prevention: ${diagnosis?.prevention || "None available"}. Please explain what I should do next.`,
                          },
                        }
                      )
                    }
                  >

                    <FaRobot />

                    Ask FarmVerse AI

                    <FaArrowRight />

                  </button>

                  <button
                    className="new-analysis-button"
                    onClick={handleReset}
                  >

                    <FaRedo />

                    New Analysis

                  </button>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <section className="detection-guide">

          <div className="guide-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              From Image to Insight
            </h2>

            <p>
              A simple AI-powered process designed to
              provide understandable crop health insights.
            </p>

          </div>

          <div className="guide-grid">

            <div className="guide-card">

              <div className="guide-number">
                01
              </div>

              <div className="guide-icon">
                <FaCloudUploadAlt />
              </div>

              <h3>
                Upload
              </h3>

              <p>
                Upload a clear photo of the affected
                crop leaf for AI image analysis.
              </p>

            </div>

            <div className="guide-card">

              <div className="guide-number">
                02
              </div>

              <div className="guide-icon">
                <FaRobot />
              </div>

              <h3>
                AI Analysis
              </h3>

              <p>
                FarmVerse AI analyzes the actual image
                together with the reported symptoms.
              </p>

            </div>

            <div className="guide-card">

              <div className="guide-number">
                03
              </div>

              <div className="guide-icon">
                <FaShieldAlt />
              </div>

              <h3>
                Take Action
              </h3>

              <p>
                Review the diagnosis, treatment and
                prevention recommendations.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            AI CTA
        =================================================== */}

        <section className="disease-ai-cta">

          <div className="cta-ai-icon">
            <FaRobot />
          </div>

          <div className="cta-ai-content">

            <span>
              NEED MORE HELP?
            </span>

            <h2>
              Talk to FarmVerse AI
            </h2>

            <p>
              Have questions about your crop, treatment,
              weather, or farming decisions? Ask our AI
              farming assistant.
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
          >

            Open AI Assistant

            <FaArrowRight />

          </button>

        </section>

        {/* ===================================================
            SCAN HISTORY
        =================================================== */}

        <section className="recent-scans">

          <div className="recent-heading">

            <div>

              <span>
                YOUR ACTIVITY
              </span>

              <h2>
                Recent Crop Scans
              </h2>

            </div>

            <p>
              Your latest AI crop health checks are
              saved automatically for quick reference.
            </p>

          </div>

          {historyLoading ? (

            <div className="scan-placeholder">

              <div className="scan-placeholder-icon">
                <FaHistory />
              </div>

              <div>

                <h3>
                  Loading scan history...
                </h3>

                <p>
                  Fetching your recent crop health checks.
                </p>

              </div>

            </div>

          ) : scanHistory.length === 0 ? (

            <div className="scan-placeholder">

              <div className="scan-placeholder-icon">
                <FaLeaf />
              </div>

              <div>

                <h3>
                  No recent scans yet
                </h3>

                <p>
                  Your analyzed crop scans will appear
                  here automatically.
                </p>

              </div>

            </div>

          ) : (

            <div className="scan-history-list">

              {scanHistory.map(
                (scan, index) => (

                  <div
                    className="scan-history-card"
                    key={
                      scan.id ??
                      index
                    }
                  >

                    <div className="scan-history-icon">
                      <FaLeaf />
                    </div>

                    <div className="scan-history-main">

                      <div className="scan-history-top">

                        <div>

                          <span className="scan-crop">
                            {scan.cropName ||
                              "Unknown Crop"}
                          </span>

                          <h3>
                            {scan.disease ||
                              "Unable to determine"}
                          </h3>

                        </div>

                        <span className="scan-confidence">

                          {scan.confidence ?? 0}
                          % confidence

                        </span>

                      </div>

                      <p>
                        {scan.recommendation ||
                          "No recommendation available."}
                      </p>

                      <span className="scan-date">
                        {formatDate(
                          scan.scannedAt
                        )}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="disease-footer">

        <div className="footer-brand">

          <FaLeaf />

          <span>
            FarmVerse
          </span>

        </div>

        <p>
          Smart farming powered by artificial intelligence.
        </p>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Home
        </button>

      </footer>

    </div>
  );
};

export default DiseaseDetection;
