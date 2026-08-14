import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCloudUploadAlt,
  FaLeaf,
  FaRobot,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";
import "./DiseaseDetection.css";
const DiseaseDetection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [recentScans, setRecentScans] = useState(() => {
    try {
      const saved = localStorage.getItem("farmverseRecentScans");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const processImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setImageName(file.name);
    setSelectedImage(URL.createObjectURL(file));
    setShowResult(false);
  };
  const handleImageSelect = (event) => {
    processImage(event.target.files?.[0]);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    processImage(event.dataTransfer.files?.[0]);
  };
  const handleAnalyze = () => {
    if (!selectedImage) {
      alert("Please scan or upload a crop image first.");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      const newScan = {
        id: Date.now(),
        image: selectedImage,
        name: imageName,
        disease: "Early Blight",
        confidence: "92%",
        severity: "Moderate",
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      setRecentScans((previous) => {
        const updated = [newScan, ...previous].slice(0, 5);
        localStorage.setItem("farmverseRecentScans", JSON.stringify(updated));
        return updated;
      });
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
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };
  const clearHistory = () => {
    localStorage.removeItem("farmverseRecentScans");
    setRecentScans([]);
  };
  return (
    <div className="disease-page">
      {" "}
      {/* NAVBAR */}{" "}
      <header className="disease-navbar">
        {" "}
        <button className="back-button" onClick={() => navigate("/")}>
          {" "}
          <FaArrowLeft /> <span>FarmVerse</span>{" "}
        </button>{" "}
        <div className="disease-logo">
          {" "}
          <div className="disease-logo-icon">
            {" "}
            <FaLeaf />{" "}
          </div>{" "}
          <strong>Crop Health</strong>{" "}
        </div>{" "}
        {/* AI ASSISTANT */}{" "}
        <button
          className="ai-nav-button"
          onClick={() => navigate("/ai-assistant")}
        >
          {" "}
          <FaRobot /> AI Assistant{" "}
        </button>{" "}
      </header>{" "}
      {/* MAIN */}{" "}
      <main className="disease-main">
        {" "}
        {/* PAGE HEADER */}{" "}
        <div className="page-header">
          {" "}
          <div>
            {" "}
            <span className="page-kicker">
              {" "}
              <FaShieldAlt /> CROP HEALTH{" "}
            </span>{" "}
            <h1>Crop Disease Detection</h1>{" "}
            <p>
              {" "}
              Scan or upload a crop leaf image to identify possible diseases and
              get practical recommendations.{" "}
            </p>{" "}
          </div>{" "}
          <div className="header-status">
            {" "}
            <span className="status-dot"></span> AI Detection Ready{" "}
          </div>{" "}
        </div>{" "}
        {/* WORKSPACE */}{" "}
        <section className="detection-workspace">
          {" "}
          {/* LEFT */}{" "}
          <div className="scan-section">
            {" "}
            <div className="section-top">
              {" "}
              <div>
                {" "}
                <span>STEP 01</span> <h2>Scan Crop Leaf</h2>{" "}
              </div>{" "}
              {selectedImage && (
                <button className="clear-button" onClick={handleReset}>
                  {" "}
                  <FaTimes /> Clear{" "}
                </button>
              )}{" "}
            </div>{" "}
            {!selectedImage ? (
              <div
                className="scan-area"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {" "}
                <div className="scan-icon">
                  {" "}
                  <FaLeaf />{" "}
                </div>{" "}
                <h3>Check your crop health</h3>{" "}
                <p>
                  {" "}
                  Take a photo of the affected leaf or upload an existing
                  image.{" "}
                </p>{" "}
                <div className="scan-actions">
                  {" "}
                  <button
                    className="camera-button"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    {" "}
                    <FaCamera /> Scan Leaf{" "}
                  </button>{" "}
                  <button
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {" "}
                    <FaCloudUploadAlt /> Upload Image{" "}
                  </button>{" "}
                </div>{" "}
                <div className="drop-info">
                  {" "}
                  Or drag & drop an image here <br />{" "}
                  <small>JPG, JPEG or PNG</small>{" "}
                </div>{" "}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />{" "}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={handleImageSelect}
                />{" "}
              </div>
            ) : (
              <div className="image-workspace">
                {" "}
                <div className="image-container">
                  {" "}
                  <img src={selectedImage} alt="Selected crop" />{" "}
                  <button className="image-remove" onClick={handleReset}>
                    {" "}
                    <FaTimes />{" "}
                  </button>{" "}
                </div>{" "}
                <div className="image-details">
                  {" "}
                  <div className="image-file-info">
                    {" "}
                    <FaCheckCircle />{" "}
                    <div>
                      {" "}
                      <strong>{imageName}</strong>{" "}
                      <span>Image ready for analysis</span>{" "}
                    </div>{" "}
                  </div>{" "}
                  <button onClick={() => fileInputRef.current?.click()}>
                    {" "}
                    Change{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* ANALYZE */}{" "}
            <button
              className={`analyze-button ${isAnalyzing ? "analyzing" : ""}`}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
            >
              {" "}
              {isAnalyzing ? (
                <>
                  {" "}
                  <span className="loading-spinner"></span> Analyzing
                  Crop...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <FaSearch /> Analyze Crop <FaArrowRight />{" "}
                </>
              )}{" "}
            </button>{" "}
          </div>{" "}
          {/* RIGHT */}{" "}
          <div className="diagnosis-section">
            {" "}
            <div className="section-top">
              {" "}
              <div>
                {" "}
                <span>STEP 02</span> <h2>Diagnosis</h2>{" "}
              </div>{" "}
            </div>{" "}
            {!showResult ? (
              <div className="waiting-state">
                {" "}
                <div className="waiting-icon">
                  {" "}
                  <FaRobot />{" "}
                </div>{" "}
                <h3>Waiting for crop image</h3>{" "}
                <p>
                  {" "}
                  Your AI diagnosis will appear here after you analyze a crop
                  image.{" "}
                </p>{" "}
                <div className="detection-list">
                  {" "}
                  <div>
                    {" "}
                    <FaCheckCircle /> Disease identification{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <FaCheckCircle /> Confidence level{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <FaCheckCircle /> Recommended action{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ) : (
              <div className="diagnosis-result">
                {" "}
                <div className="result-title">
                  {" "}
                  <div className="warning-icon">
                    {" "}
                    <FaExclamationTriangle />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span>DETECTED CONDITION</span> <h3>Early Blight</h3>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="confidence-row">
                  {" "}
                  <div>
                    {" "}
                    <span>AI Confidence</span> <strong>92%</strong>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <span>Severity</span>{" "}
                    <strong className="moderate"> Moderate </strong>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="confidence-bar">
                  {" "}
                  <div style={{ width: "92%" }}></div>{" "}
                </div>{" "}
                <div className="result-content">
                  {" "}
                  <span>OBSERVATION</span>{" "}
                  <p>
                    {" "}
                    Brown spots and leaf discoloration detected. The visual
                    pattern is commonly associated with early blight.{" "}
                  </p>{" "}
                </div>{" "}
                <div className="recommendation">
                  {" "}
                  <span>RECOMMENDED ACTION</span>{" "}
                  <ul>
                    {" "}
                    <li>
                      {" "}
                      <FaCheckCircle /> Remove heavily affected leaves.{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <FaCheckCircle /> Avoid excess moisture on foliage.{" "}
                    </li>{" "}
                    <li>
                      {" "}
                      <FaCheckCircle /> Monitor nearby plants regularly.{" "}
                    </li>{" "}
                  </ul>{" "}
                </div>{" "}
                {/* AI BUTTONS */}{" "}
                <div className="result-buttons">
                  {" "}
                  <button
                    className="ask-ai-button"
                    onClick={() => navigate("/ai-assistant")}
                  >
                    {" "}
                    <FaRobot /> Ask FarmVerse AI{" "}
                  </button>{" "}
                  <button className="new-analysis-button" onClick={handleReset}>
                    {" "}
                    <FaRedo /> New Scan{" "}
                  </button>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </section>{" "}
        {/* RECENT SCANS */}{" "}
        <section className="recent-scans">
          {" "}
          <div className="recent-header">
            {" "}
            <div>
              {" "}
              <span>ACTIVITY</span> <h2>Recent Scans</h2>{" "}
            </div>{" "}
            {recentScans.length > 0 && (
              <button onClick={clearHistory}> Clear History </button>
            )}{" "}
          </div>{" "}
          {recentScans.length === 0 ? (
            <div className="recent-empty">
              {" "}
              <div className="recent-empty-icon">
                {" "}
                <FaLeaf />{" "}
              </div>{" "}
              <div>
                {" "}
                <h3>No recent scans</h3>{" "}
                <p>
                  {" "}
                  Your analyzed crop images will appear here for quick
                  reference.{" "}
                </p>{" "}
              </div>{" "}
            </div>
          ) : (
            <div className="recent-list">
              {" "}
              {recentScans.map((scan) => (
                <div className="recent-item" key={scan.id}>
                  {" "}
                  <img src={scan.image} alt={scan.disease} />{" "}
                  <div className="recent-info">
                    {" "}
                    <strong>{scan.disease}</strong> <span>{scan.name}</span>{" "}
                    <small>{scan.date}</small>{" "}
                  </div>{" "}
                  <div className="recent-result">
                    {" "}
                    <strong>{scan.confidence}</strong>{" "}
                    <span>{scan.severity}</span>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
        </section>{" "}
        {/* TIPS */}{" "}
        <section className="scan-tips">
          {" "}
          <div>
            {" "}
            <FaLeaf />{" "}
            <div>
              {" "}
              <strong>Use a clear leaf image</strong>{" "}
              <span> Keep the affected area visible and well lit. </span>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <FaCamera />{" "}
            <div>
              {" "}
              <strong>Capture close to the leaf</strong>{" "}
              <span> Avoid blurry or distant photos. </span>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <FaShieldAlt />{" "}
            <div>
              {" "}
              <strong>AI result is an indication</strong>{" "}
              <span> Consult an expert for critical crop issues. </span>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
      {/* FOOTER */}{" "}
      <footer className="disease-footer">
        {" "}
        <div>
          {" "}
          <FaLeaf /> <strong>FarmVerse</strong>{" "}
        </div>{" "}
        <span> Smart crop health monitoring powered by AI </span>{" "}
        <button onClick={() => navigate("/")}> Back to Home </button>{" "}
      </footer>{" "}
    </div>
  );
};
export default DiseaseDetection;
