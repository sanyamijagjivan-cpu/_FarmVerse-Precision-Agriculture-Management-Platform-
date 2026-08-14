import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRobot,
  FaSeedling,
  FaMapMarkerAlt,
  FaChartLine,
  FaChartBar,
  FaShoppingBasket,
  FaStore,
  FaFire,
  FaLeaf,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";

import "./MarketAnalysis.css";

function MarketAnalysis() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("Kurnool, Andhra Pradesh");
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [period, setPeriod] = useState("7D");

  const crops = [
    {
      name: "Tomato",
      icon: <FaSeedling />,
      price: "₹2,850",
      unit: "/ quintal",
      change: "+8.4%",
      trend: "up",
      demand: "High",
      market: "Kurnool Mandi",
    },
    {
      name: "Paddy",
      icon: <FaLeaf />,
      price: "₹2,240",
      unit: "/ quintal",
      change: "+3.2%",
      trend: "up",
      demand: "High",
      market: "Kurnool Mandi",
    },
    {
      name: "Cotton",
      icon: <FaSeedling />,
      price: "₹7,120",
      unit: "/ quintal",
      change: "-1.8%",
      trend: "down",
      demand: "Medium",
      market: "Adoni Mandi",
    },
    {
      name: "Groundnut",
      icon: <FaLeaf />,
      price: "₹6,340",
      unit: "/ quintal",
      change: "+5.6%",
      trend: "up",
      demand: "High",
      market: "Nandyal Mandi",
    },
    {
      name: "Chilli",
      icon: <FaSeedling />,
      price: "₹11,450",
      unit: "/ quintal",
      change: "+6.9%",
      trend: "up",
      demand: "Very High",
      market: "Guntur Mandi",
    },
  ];

  const markets = [
    {
      name: "Kurnool Mandi",
      location: "Kurnool",
      price: "₹2,850",
      change: "+8.4%",
      demand: "High",
      distance: "12 km",
    },
    {
      name: "Nandyal Mandi",
      location: "Nandyal",
      price: "₹2,920",
      change: "+10.2%",
      demand: "Very High",
      distance: "38 km",
    },
    {
      name: "Adoni Mandi",
      location: "Adoni",
      price: "₹2,760",
      change: "+5.1%",
      demand: "Medium",
      distance: "54 km",
    },
    {
      name: "Anantapur Mandi",
      location: "Anantapur",
      price: "₹2,810",
      change: "+6.3%",
      demand: "High",
      distance: "72 km",
    },
  ];

  const priceData = {
    "7D": [2380, 2460, 2510, 2640, 2580, 2740, 2850],
    "30D": [2140, 2280, 2350, 2420, 2510, 2590, 2680, 2740, 2850],
  };

  const selectedCropData =
    crops.find((crop) => crop.name === selectedCrop) || crops[0];

  const values = priceData[period];
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const changeLocation = () => {
    const newLocation = window.prompt("Enter your farm location:", location);

    if (newLocation && newLocation.trim()) {
      setLocation(newLocation.trim());
    }
  };

  return (
    <div className="market-page">
      {/* PLATFORM NAVBAR */}
      <header className="market-navbar">
        <button
          className="market-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          <span>Dashboard</span>
        </button>

        <div className="market-brand">
          <div className="market-brand-icon">
            <FaLeaf />
          </div>

          <div>
            <strong>FarmVerse</strong>
            <span>Market Intelligence</span>
          </div>
        </div>

        <button
          className="market-ai-button"
          onClick={() => navigate("/ai-farming-assistant")}
        >
          <FaRobot />
          <span>AI Assistant</span>
        </button>
      </header>

      <main className="market-main">
        {/* PAGE HEADER */}
        <section className="market-page-header">
          <div>
            <div className="market-breadcrumb">
              Dashboard <span>/</span> Market Analysis
            </div>

            <h1>Market Analysis</h1>

            <p>
              Monitor crop prices, compare nearby markets and make better
              selling decisions using current market indicators.
            </p>
          </div>

          <div className="market-status">
            <span></span>
            Market Data Available
          </div>
        </section>

        {/* LOCATION + FILTER */}
        <section className="market-toolbar">
          <div className="market-location">
            <div className="toolbar-icon">
              <FaMapMarkerAlt />
            </div>

            <div>
              <span>FARM LOCATION</span>
              <strong>{location}</strong>
            </div>

            <button onClick={changeLocation}>Change</button>
          </div>

          <div className="market-filter">
            <FaFilter />

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map((crop) => (
                <option key={crop.name} value={crop.name}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="market-kpis">
          <div className="market-kpi-card">
            <div className="kpi-icon">
              <FaRupeeSign />
            </div>

            <div>
              <span>CURRENT PRICE</span>
              <strong>{selectedCropData.price}</strong>
              <small>{selectedCropData.unit}</small>
            </div>
          </div>

          <div className="market-kpi-card">
            <div className="kpi-icon positive">
              <FaArrowUp />
            </div>

            <div>
              <span>PRICE CHANGE</span>
              <strong>{selectedCropData.change}</strong>
              <small>This week</small>
            </div>
          </div>

          <div className="market-kpi-card">
            <div className="kpi-icon demand">
              <FaFire />
            </div>

            <div>
              <span>MARKET DEMAND</span>
              <strong>{selectedCropData.demand}</strong>
              <small>Current demand</small>
            </div>
          </div>

          <div className="market-kpi-card">
            <div className="kpi-icon market">
              <FaStore />
            </div>

            <div>
              <span>BEST MARKET</span>
              <strong>Nandyal</strong>
              <small>₹2,920 / quintal</small>
            </div>
          </div>
        </section>

        {/* CROP PRICE TABLE */}
        <section className="market-section">
          <div className="section-heading">
            <div>
              <span>MARKET OVERVIEW</span>
              <h2>Crop Prices</h2>
            </div>

            <p>Select a crop to view its detailed market trend.</p>
          </div>

          <div className="price-table">
            <div className="price-table-head">
              <span>Crop</span>
              <span>Current Price</span>
              <span>Change</span>
              <span>Demand</span>
              <span>Market</span>
            </div>

            {crops.map((crop) => (
              <button
                className={`price-table-row ${
                  selectedCrop === crop.name ? "active-crop" : ""
                }`}
                key={crop.name}
                onClick={() => setSelectedCrop(crop.name)}
              >
                <div className="crop-cell">
                  <div className="crop-icon">{crop.icon}</div>

                  <div>
                    <strong>{crop.name}</strong>
                    <small>Crop commodity</small>
                  </div>
                </div>

                <div className="price-cell">
                  <strong>{crop.price}</strong>
                  <small>{crop.unit}</small>
                </div>

                <div
                  className={
                    crop.trend === "up" ? "price-positive" : "price-negative"
                  }
                >
                  {crop.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                  {crop.change}
                </div>

                <div>
                  <span
                    className={`demand-tag ${
                      crop.demand === "Very High"
                        ? "very-high"
                        : crop.demand === "High"
                          ? "high"
                          : "medium"
                    }`}
                  >
                    {crop.demand}
                  </span>
                </div>

                <div className="market-name">
                  {crop.market}
                  <FaArrowRight />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CHART + MARKET SUMMARY */}
        <section className="analysis-grid">
          <div className="analysis-card chart-card">
            <div className="card-header">
              <div>
                <span>PRICE TREND</span>
                <h2>{selectedCrop} Market Trend</h2>
              </div>

              <div className="period-buttons">
                <button
                  className={period === "7D" ? "selected-period" : ""}
                  onClick={() => setPeriod("7D")}
                >
                  7D
                </button>

                <button
                  className={period === "30D" ? "selected-period" : ""}
                  onClick={() => setPeriod("30D")}
                >
                  30D
                </button>
              </div>
            </div>

            <div className="chart-top">
              <div>
                <span>Current Price</span>
                <strong>{selectedCropData.price}</strong>
              </div>

              <div className="chart-change">
                <FaChartLine />
                {selectedCropData.change}
              </div>
            </div>

            <div className="chart-wrapper">
              <div className="chart-y-labels">
                <span>₹3,000</span>
                <span>₹2,750</span>
                <span>₹2,500</span>
                <span>₹2,250</span>
                <span>₹2,000</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <svg viewBox="0 0 900 300" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(61, 143, 78, 0.20)" />
                      <stop offset="100%" stopColor="rgba(61, 143, 78, 0)" />
                    </linearGradient>
                  </defs>

                  <path
                    d={
                      values
                        .map((value, index) => {
                          const x = (index / (values.length - 1)) * 900;

                          const y =
                            270 -
                            ((value - minValue) / (maxValue - minValue || 1)) *
                              220;

                          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ") + " L 900 300 L 0 300 Z"
                    }
                    fill="url(#marketFill)"
                  />

                  <path
                    d={values
                      .map((value, index) => {
                        const x = (index / (values.length - 1)) * 900;

                        const y =
                          270 -
                          ((value - minValue) / (maxValue - minValue || 1)) *
                            220;

                        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#3d914f"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {values.map((value, index) => {
                    const x = (index / (values.length - 1)) * 900;

                    const y =
                      270 -
                      ((value - minValue) / (maxValue - minValue || 1)) * 220;

                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#ffffff"
                        stroke="#3d914f"
                        strokeWidth="3"
                      />
                    );
                  })}
                </svg>

                <div className="chart-days">
                  {values.map((_, index) => (
                    <span key={index}>
                      {period === "7D" ? `Day ${index + 1}` : `${index + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MARKET SUMMARY */}
          <div className="analysis-card summary-card">
            <div className="card-header">
              <div>
                <span>MARKET SIGNAL</span>
                <h2>Today's Summary</h2>
              </div>

              <FaChartBar />
            </div>

            <div className="summary-item">
              <div className="summary-icon">
                <FaArrowUp />
              </div>

              <div>
                <span>Price Momentum</span>
                <strong>Positive</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon demand-icon">
                <FaShoppingBasket />
              </div>

              <div>
                <span>Demand Level</span>
                <strong>High</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-icon market-icon">
                <FaStore />
              </div>

              <div>
                <span>Recommended Market</span>
                <strong>Nandyal Mandi</strong>
              </div>
            </div>

            <div className="summary-note">
              <FaBalanceScale />
              <p>
                Compare transportation costs before choosing the highest-price
                market.
              </p>
            </div>
          </div>
        </section>

        {/* MARKET COMPARISON */}
        <section className="market-section">
          <div className="section-heading">
            <div>
              <span>MARKET COMPARISON</span>
              <h2>Nearby Markets</h2>
            </div>

            <p>Compare current prices and demand before selling.</p>
          </div>

          <div className="market-cards">
            {markets.map((market, index) => (
              <div
                className={`market-card ${index === 1 ? "best-market" : ""}`}
                key={market.name}
              >
                {index === 1 && <div className="best-label">BEST PRICE</div>}

                <div className="market-card-top">
                  <div className="market-store">
                    <FaStore />
                  </div>

                  <span>{market.distance}</span>
                </div>

                <h3>{market.name}</h3>

                <small>
                  <FaMapMarkerAlt />
                  {market.location}
                </small>

                <div className="market-card-price">
                  {market.price}
                  <span>/ quintal</span>
                </div>

                <div className="market-card-details">
                  <div>
                    <span>Change</span>
                    <strong>{market.change}</strong>
                  </div>

                  <div>
                    <span>Demand</span>
                    <strong>{market.demand}</strong>
                  </div>
                </div>

                <button>
                  View Market
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SELLING OPPORTUNITY */}
        <section className="selling-card">
          <div className="selling-icon">
            <FaBalanceScale />
          </div>

          <div>
            <span>SMART SELLING OPPORTUNITY</span>

            <h2>
              Nandyal Mandi currently offers the highest
              {` ${selectedCrop.toLowerCase()}`} price nearby.
            </h2>

            <p>
              Current estimated price is ₹2,920 per quintal. Consider
              transportation cost before making the final selling decision.
            </p>
          </div>

          <button>
            Compare Markets
            <FaArrowRight />
          </button>
        </section>

        {/* INSIGHTS */}
        <section className="market-section">
          <div className="section-heading">
            <div>
              <span>MARKET INSIGHTS</span>
              <h2>Key Market Indicators</h2>
            </div>
          </div>

          <div className="insight-grid">
            <div className="insight-card">
              <div>
                <FaChartBar />
              </div>

              <span>PRICE MOMENTUM</span>

              <h3>Prices are moving upward</h3>

              <p>
                Several tracked crops are showing positive weekly price
                movement.
              </p>
            </div>

            <div className="insight-card">
              <div>
                <FaShoppingBasket />
              </div>

              <span>DEMAND SIGNAL</span>

              <h3>Vegetable demand is strong</h3>

              <p>
                Current demand indicators show stronger selling potential for
                selected crops.
              </p>
            </div>

            <div className="insight-card">
              <div>
                <FaCalendarAlt />
              </div>

              <span>SELLING WINDOW</span>

              <h3>Monitor the next few days</h3>

              <p>
                Continue monitoring prices before selling large quantities of
                your harvest.
              </p>
            </div>
          </div>
        </section>

        {/* AI */}
        <section className="market-ai-card">
          <div className="ai-market-icon">
            <FaRobot />
          </div>

          <div>
            <span>FARMVERSE AI</span>

            <h2>Need help with your selling decision?</h2>

            <p>
              Ask FarmVerse AI about prices, market trends, demand and selling
              opportunities.
            </p>
          </div>

          <button onClick={() => navigate("/ai-farming-assistant")}>
            Ask FarmVerse AI
            <FaArrowRight />
          </button>
        </section>

        {/* FOOTER */}
        <footer className="market-footer">
          <div>
            <FaLeaf />
            <strong>FarmVerse</strong>
          </div>

          <span>Market Analysis • Smart Agriculture Platform</span>

          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </footer>
      </main>
    </div>
  );
}

export default MarketAnalysis;
