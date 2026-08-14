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
    },
    {
      name: "Nandyal Mandi",
      location: "Nandyal",
      price: "₹2,920",
      change: "+10.2%",
      demand: "Very High",
    },
    {
      name: "Adoni Mandi",
      location: "Adoni",
      price: "₹2,760",
      change: "+5.1%",
      demand: "Medium",
    },
    {
      name: "Anantapur Mandi",
      location: "Anantapur",
      price: "₹2,810",
      change: "+6.3%",
      demand: "High",
    },
  ];

  const priceData = {
    "7D": [2380, 2460, 2510, 2640, 2580, 2740, 2850],
    "30D": [2140, 2280, 2350, 2420, 2510, 2590, 2680, 2740, 2850],
  };

  const changeLocation = () => {
    const newLocation = window.prompt(
      "Enter your farm location:",
      location
    );

    if (newLocation && newLocation.trim() !== "") {
      setLocation(newLocation.trim());
    }
  };

  const selectedCropData =
    crops.find((crop) => crop.name === selectedCrop) || crops[0];

  const values = priceData[period];
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  return (
    <div className="market-page">
      <nav className="market-navbar">
        <button
          className="market-back-button"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          <span>Back to FarmVerse</span>
        </button>

        <div className="market-logo">
          <div className="market-logo-icon">
            <FaSeedling />
          </div>
          <span>FarmVerse</span>
        </div>

        <button
          className="market-ai-nav-button"
          onClick={() => navigate("/ai-farming-assistant")}
        >
          <FaRobot />
          <span>AI Assistant</span>
        </button>
      </nav>

      <main className="market-main">
        <section className="market-hero">
          <div className="market-hero-badge">
            <FaChartLine />
            MARKET INTELLIGENCE
          </div>

          <h1>
            Know the Market.
            <span>Sell at the Right Time.</span>
          </h1>

          <p>
            Track crop prices, understand demand, compare nearby
            markets, and discover better selling opportunities for
            your harvest.
          </p>
        </section>

        <section className="market-location-card">
          <div className="market-location-left">
            <div className="market-location-icon">
              <FaMapMarkerAlt />
            </div>

            <div>
              <span>YOUR FARM REGION</span>
              <h3>{location}</h3>
            </div>
          </div>

          <button
            className="market-change-location"
            onClick={changeLocation}
          >
            Change Location
          </button>
        </section>

        <section className="market-overview">
          <div className="market-overview-card primary-market-card">
            <div className="overview-icon">
              <FaRupeeSign />
            </div>

            <div>
              <span>AVERAGE MARKET PRICE</span>
              <strong>₹4,000</strong>
              <small>per quintal</small>
            </div>
          </div>

          <div className="market-overview-card">
            <div className="overview-icon green-icon">
              <FaArrowUp />
            </div>

            <div>
              <span>PRICE TREND</span>
              <strong>+6.8%</strong>
              <small>This week</small>
            </div>
          </div>

          <div className="market-overview-card">
            <div className="overview-icon gold-icon">
              <FaFire />
            </div>

            <div>
              <span>MARKET DEMAND</span>
              <strong>High</strong>
              <small>Current demand</small>
            </div>
          </div>

          <div className="market-overview-card">
            <div className="overview-icon blue-icon">
              <FaStore />
            </div>

            <div>
              <span>MARKETS TRACKED</span>
              <strong>12</strong>
              <small>Nearby markets</small>
            </div>
          </div>
        </section>

        <section className="crop-market-section">
          <div className="market-section-heading">
            <div>
              <span>LIVE CROP PRICES</span>
              <h2>Market Price Dashboard</h2>
            </div>

            <p>
              Monitor important crops and identify price movements
              before deciding where to sell.
            </p>
          </div>

          <div className="crop-table-wrapper">
            <div className="crop-table-header">
              <span>Crop</span>
              <span>Current Price</span>
              <span>Change</span>
              <span>Demand</span>
              <span>Market</span>
              <span></span>
            </div>

            {crops.map((crop) => (
              <div
                className={`crop-table-row ${
                  selectedCrop === crop.name
                    ? "selected-crop-row"
                    : ""
                }`}
                key={crop.name}
                onClick={() => setSelectedCrop(crop.name)}
              >
                <div className="crop-name-cell">
                  <div className="crop-icon">{crop.icon}</div>

                  <div>
                    <strong>{crop.name}</strong>
                    <span>Fresh market</span>
                  </div>
                </div>

                <div className="crop-price-cell">
                  <strong>{crop.price}</strong>
                  <span>{crop.unit}</span>
                </div>

                <div
                  className={`crop-change ${
                    crop.trend === "up"
                      ? "positive-change"
                      : "negative-change"
                  }`}
                >
                  {crop.trend === "up" ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}

                  {crop.change}
                </div>

                <div>
                  <span
                    className={`demand-badge ${
                      crop.demand === "Very High"
                        ? "very-high-demand"
                        : crop.demand === "High"
                        ? "high-demand"
                        : "medium-demand"
                    }`}
                  >
                    {crop.demand}
                  </span>
                </div>

                <div className="crop-market-name">
                  {crop.market}
                </div>

                <FaArrowRight className="row-arrow" />
              </div>
            ))}
          </div>
        </section>

        <section className="price-analysis-section">
          <div className="market-section-heading">
            <div>
              <span>PRICE ANALYSIS</span>
              <h2>{selectedCrop} Price Trend</h2>
            </div>

            <div className="period-selector">
              <button
                className={
                  period === "7D" ? "active-period" : ""
                }
                onClick={() => setPeriod("7D")}
              >
                7D
              </button>

              <button
                className={
                  period === "30D" ? "active-period" : ""
                }
                onClick={() => setPeriod("30D")}
              >
                30D
              </button>
            </div>
          </div>

          <div className="price-chart-card">
            <div className="chart-summary">
              <div>
                <span>CURRENT PRICE</span>
                <strong>{selectedCropData.price}</strong>
                <small>{selectedCropData.unit}</small>
              </div>

              <div className="chart-growth">
                {selectedCropData.trend === "up" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}

                <strong>{selectedCropData.change}</strong>
                <span>Market movement</span>
              </div>
            </div>

            <div className="price-chart">
              <div className="chart-y-axis">
                <span>₹3,000</span>
                <span>₹2,750</span>
                <span>₹2,500</span>
                <span>₹2,250</span>
                <span>₹2,000</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <svg
                  className="price-svg"
                  viewBox="0 0 900 300"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="marketGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgba(117, 202, 126, 0.35)"
                      />
                      <stop
                        offset="100%"
                        stopColor="rgba(117, 202, 126, 0)"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d={
                      values
                        .map((value, index) => {
                          const x =
                            (index / (values.length - 1)) * 900;

                          const y =
                            270 -
                            ((value - minValue) /
                              (maxValue - minValue || 1)) *
                              220;

                          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ") +
                      " L 900 300 L 0 300 Z"
                    }
                    fill="url(#marketGradient)"
                  />

                  <path
                    d={values
                      .map((value, index) => {
                        const x =
                          (index / (values.length - 1)) * 900;

                        const y =
                          270 -
                          ((value - minValue) /
                            (maxValue - minValue || 1)) *
                            220;

                        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#83d28d"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {values.map((value, index) => {
                    const x =
                      (index / (values.length - 1)) * 900;

                    const y =
                      270 -
                      ((value - minValue) /
                        (maxValue - minValue || 1)) *
                        220;

                    return (
                      <circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#0b1d11"
                        stroke="#83d28d"
                        strokeWidth="3"
                      />
                    );
                  })}
                </svg>

                <div className="chart-x-axis">
                  {values.map((_, index) => (
                    <span key={index}>
                      {period === "7D"
                        ? `Day ${index + 1}`
                        : `${index + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="market-comparison-section">
          <div className="market-section-heading">
            <div>
              <span>MARKET COMPARISON</span>
              <h2>Where Should You Sell?</h2>
            </div>

            <p>
              Compare prices and demand across nearby markets to
              find a potentially better selling opportunity.
            </p>
          </div>

          <div className="comparison-grid">
            {markets.map((market, index) => (
              <div
                className={`comparison-card ${
                  index === 1 ? "best-market-card" : ""
                }`}
                key={market.name}
              >
                {index === 1 && (
                  <div className="best-market-label">
                    BEST PRICE
                  </div>
                )}

                <div className="comparison-top">
                  <div className="market-store-icon">
                    <FaStore />
                  </div>

                  <span className="market-distance">
                    {index === 0
                      ? "12 km"
                      : index === 1
                      ? "38 km"
                      : index === 2
                      ? "54 km"
                      : "72 km"}
                  </span>
                </div>

                <h3>{market.name}</h3>

                <span className="market-location-name">
                  {market.location}
                </span>

                <div className="comparison-price">
                  <strong>{market.price}</strong>
                  <span>/ quintal</span>
                </div>

                <div className="comparison-details">
                  <div>
                    <span>Price change</span>
                    <strong>{market.change}</strong>
                  </div>

                  <div>
                    <span>Demand</span>
                    <strong>{market.demand}</strong>
                  </div>
                </div>

                <button className="market-view-button">
                  View Market
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="selling-opportunity">
          <div className="opportunity-icon">
            <FaBalanceScale />
          </div>

          <div className="opportunity-content">
            <span>SMART SELLING OPPORTUNITY</span>

            <h2>
              Nandyal Mandi currently offers the highest{" "}
              {selectedCrop.toLowerCase()} price nearby.
            </h2>

            <p>
              The current estimated price is ₹2,920 per quintal,
              approximately 2.4% higher than the local average.
              Consider transportation cost before making a final
              selling decision.
            </p>
          </div>

          <button className="opportunity-button">
            Compare Markets
            <FaArrowRight />
          </button>
        </section>

        <section className="market-insights-section">
          <div className="market-section-heading centered-market-heading">
            <div>
              <span>MARKET INTELLIGENCE</span>
              <h2>What the Market Is Telling You</h2>
            </div>

            <p>
              Simple insights that help turn market data into
              practical decisions.
            </p>
          </div>

          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">
                <FaChartBar />
              </div>

              <span>PRICE MOMENTUM</span>

              <h3>Prices are moving upward</h3>

              <p>
                Several tracked crops are showing positive weekly
                price movement, indicating stronger market activity.
              </p>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <FaShoppingBasket />
              </div>

              <span>DEMAND SIGNAL</span>

              <h3>Vegetable demand is strong</h3>

              <p>
                Current demand indicators suggest that selected
                vegetable crops may have stronger selling potential.
              </p>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <FaArrowUp />
              </div>

              <span>SELLING WINDOW</span>

              <h3>Watch the next few days</h3>

              <p>
                Continue monitoring prices before selling large
                quantities of your harvest.
              </p>
            </div>
          </div>
        </section>

        <section className="market-ai-cta">
          <div className="market-ai-icon">
            <FaRobot />
          </div>

          <div className="market-ai-content">
            <span>MARKET + AI</span>

            <h2>
              Need help deciding when and where to sell?
            </h2>

            <p>
              Ask FarmVerse AI about crop prices, market trends,
              demand, selling opportunities, and farm profitability.
            </p>
          </div>

          <button
            onClick={() => navigate("/ai-farming-assistant")}
          >
            Ask FarmVerse AI
            <FaArrowRight />
          </button>
        </section>

        <footer className="market-footer">
          <div className="market-footer-brand">
            <FaLeaf />
            <span>FarmVerse</span>
          </div>

          <p>
            Smart agriculture • Better decisions • Better harvests
          </p>

          <button onClick={() => navigate("/")}>
            Back to Home
          </button>
        </footer>
      </main>
    </div>
  );
}

export default MarketAnalysis;