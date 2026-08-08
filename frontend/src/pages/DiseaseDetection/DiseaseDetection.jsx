import React, { useRef, useState } from "react";
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
} from "react-icons/fa";

import "./DiseaseDetection.css";

const DiseaseDetection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setImageName(file.name);
    setSelectedImage(URL.createObjectURL(file));
    setShowResult(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please drop a valid image file.");
      return;
    }

    setImageName(file.name);
    setSelectedImage(URL.createObjectURL(file));
    setShowResult(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      alert("Please upload a crop image first.");
      return;
    }

    setIsAnalyzing(true);

    /*
      TEMPORARY UI DEMO

      Later your teammates can replace this section
      with the actual disease-detection API/model.
    */

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 1800);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageName("");
    setShowResult(false);
    setIsAnalyzing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="disease-page">

      {/* =========================================
          TOP NAVIGATION
          ========================================= */}

      <header className="disease-navbar">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          <span>Back to FarmVerse</span>
        </button>

        <div className="disease-logo">
          <div className="disease-logo-icon">
            <FaLeaf />
          </div>

          <span>FarmVerse</span>
        </div>

        <button
          className="ai-nav-button"
          onClick={() => navigate("/ai-farming-assistant")}
        >
          <FaRobot />
          <span>AI Assistant</span>
        </button>

      </header>


      {/* =========================================
          HERO
          ========================================= */}

      <main className="disease-main">

        <section className="disease-hero">

          <div className="disease-hero-badge">
            <FaShieldAlt />
            <span>AI CROP HEALTH INTELLIGENCE</span>
          </div>

          <h1>
            Protect Your Crops
            <br />
            With <span>Intelligent Diagnosis</span>
          </h1>

          <p>
            Upload a clear image of your crop leaf and get an
            AI-powered health assessment with actionable insights.
          </p>

        </section>


        {/* =========================================
            ANALYSIS WORKSPACE
            ========================================= */}

        <section className="diagnosis-workspace">

          {/* =====================================
              UPLOAD PANEL
              ===================================== */}

          <div className="upload-panel">

            <div className="panel-heading">
              <div>
                <span className="panel-label">STEP 01</span>
                <h2>Upload Crop Image</h2>
              </div>

              <div className="panel-icon">
                <FaCloudUploadAlt />
              </div>
            </div>


            <div
              className={`upload-area ${
                selectedImage ? "has-image" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                    <span>Change Image</span>
                  </div>

                </div>
              ) : (
                <>

                  <div className="upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <h3>Upload a crop leaf image</h3>

                  <p>
                    Drag &amp; drop your image here or
                    <span> browse files</span>
                  </p>

                  <small>
                    JPG, JPEG or PNG • Clear images give better results
                  </small>

                </>
              )}

            </div>


            {imageName && (
              <div className="selected-file">

                <div className="file-info">
                  <FaCheckCircle />

                  <div>
                    <strong>{imageName}</strong>
                    <span>Image ready for analysis</span>
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


            <button
              className={`analyze-button ${
                isAnalyzing ? "analyzing" : ""
              }`}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >

              {isAnalyzing ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing Crop...
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


          {/* =====================================
              RESULT PANEL
              ===================================== */}

          <div className="result-panel">

            <div className="panel-heading">

              <div>
                <span className="panel-label">STEP 02</span>
                <h2>AI Diagnosis</h2>
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
                  Upload a crop image and start the analysis
                  to receive disease detection results.
                </p>

                <div className="result-features">

                  <div>
                    <FaCheckCircle />
                    <span>Disease identification</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Confidence score</span>
                  </div>

                  <div>
                    <FaCheckCircle />
                    <span>Severity assessment</span>
                  </div>

                </div>

              </div>
            ) : (
              <div className="diagnosis-result">

                <div className="diagnosis-status">
                  <div className="status-icon">
                    <FaExclamationTriangle />
                  </div>

                  <div>
                    <span>DETECTED CONDITION</span>
                    <h3>Early Blight</h3>
                  </div>
                </div>


                <div className="diagnosis-stats">

                  <div className="diagnosis-stat">
                    <span>Confidence</span>
                    <strong>92%</strong>
                  </div>

                  <div className="diagnosis-stat">
                    <span>Severity</span>
                    <strong className="severity">
                      Moderate
                    </strong>
                  </div>

                </div>


                <div className="diagnosis-progress">

                  <div className="progress-header">
                    <span>AI Confidence</span>
                    <strong>92%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: "92%" }}
                    ></div>
                  </div>

                </div>


                <div className="result-section">

                  <h4>What we found</h4>

                  <p>
                    The image shows visual patterns commonly
                    associated with early blight. Brown spots
                    and leaf discoloration may indicate the
                    beginning of an infection.
                  </p>

                </div>


                <div className="result-section">

                  <h4>Recommended actions</h4>

                  <ul>

                    <li>
                      <FaCheckCircle />
                      Remove heavily affected leaves.
                    </li>

                    <li>
                      <FaCheckCircle />
                      Avoid excessive moisture on foliage.
                    </li>

                    <li>
                      <FaCheckCircle />
                      Monitor nearby plants for symptoms.
                    </li>

                  </ul>

                </div>


                <div className="result-actions">

                  <button
                    className="ask-ai-button"
                    onClick={() =>
                      navigate("/ai-farming-assistant")
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


        {/* =========================================
            HOW IT WORKS
            ========================================= */}

        <section className="detection-guide">

          <div className="guide-heading">

            <span>HOW IT WORKS</span>

            <h2>
              From Image to Insight
            </h2>

            <p>
              A simple three-step process designed for
              quick and understandable crop health checks.
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

              <h3>Upload</h3>

              <p>
                Take a clear photo of the affected crop leaf
                and upload it for analysis.
              </p>

            </div>


            <div className="guide-card">

              <div className="guide-number">
                02
              </div>

              <div className="guide-icon">
                <FaRobot />
              </div>

              <h3>AI Analysis</h3>

              <p>
                FarmVerse analyzes visual patterns to identify
                potential crop health problems.
              </p>

            </div>


            <div className="guide-card">

              <div className="guide-number">
                03
              </div>

              <div className="guide-icon">
                <FaShieldAlt />
              </div>

              <h3>Take Action</h3>

              <p>
                Understand the result and get practical next
                steps to protect your crop.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            AI ASSISTANT CTA
            ========================================= */}

        <section className="disease-ai-cta">

          <div className="cta-ai-icon">
            <FaRobot />
          </div>

          <div className="cta-ai-content">

            <span>NEED MORE HELP?</span>

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
              navigate("/ai-farming-assistant")
            }
          >
            Open AI Assistant
            <FaArrowRight />
          </button>

        </section>


        {/* =========================================
            RECENT SCANS
            ========================================= */}

        <section className="recent-scans">

          <div className="recent-heading">

            <div>
              <span>YOUR ACTIVITY</span>
              <h2>Recent Crop Scans</h2>
            </div>

            <p>
              Your latest crop health checks will appear here.
            </p>

          </div>


          <div className="scan-placeholder">

            <div className="scan-placeholder-icon">
              <FaLeaf />
            </div>

            <div>
              <h3>No recent scans yet</h3>
              <p>
                Your analyzed crop images will be shown here
                for quick reference.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* =========================================
          FOOTER
          ========================================= */}

      <footer className="disease-footer">

        <div className="footer-brand">
          <FaLeaf />
          <span>FarmVerse</span>
        </div>

        <p>
          Smart farming powered by artificial intelligence.
        </p>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>

      </footer>

    </div>
  );
};

export default DiseaseDetection;