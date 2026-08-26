
import React, { useEffect, useMemo, useState } from "react";
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
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

import "./MarketAnalysis.css";

function MarketAnalysis() {
  const navigate = useNavigate();

  // =========================================================
  // API URLS
  // =========================================================

  const MARKET_API_URL =
    "http://localhost:8080/api/agmarknet/market-prices";

  const LOCATION_API_URL =
    "https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json";

  // =========================================================
  // LOCATION STATE
  // =========================================================

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  // IMPORTANT:
  // Keep both locations BLANK initially.
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  // =========================================================
  // MARKET STATE
  // =========================================================

  const [marketPrices, setMarketPrices] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState("");
  const [period, setPeriod] = useState("7D");

  // =========================================================
  // LOAD STATES + DISTRICTS
  // =========================================================

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocationLoading(true);
        setLocationError("");

        const response = await fetch(LOCATION_API_URL);

        if (!response.ok) {
          throw new Error(
            `Location API error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("REAL INDIA LOCATION DATA:", data);

        let locationData = [];

        if (Array.isArray(data)) {
          locationData = data;
        } else if (Array.isArray(data?.states)) {
          locationData = data.states;
        } else if (Array.isArray(data?.data)) {
          locationData = data.data;
        }

        const normalizedStates = locationData
          .map((item) => {
            const stateName =
              item.state ||
              item.state_name ||
              item.name ||
              item.stateName ||
              "";

            const districtData =
              item.districts ||
              item.district ||
              item.district_names ||
              [];

            const normalizedDistricts = Array.isArray(
              districtData
            )
              ? districtData
                  .map((district) => {
                    if (typeof district === "string") {
                      return district;
                    }

                    return (
                      district.name ||
                      district.district ||
                      district.district_name ||
                      district.districtName ||
                      ""
                    );
                  })
                  .filter(Boolean)
              : [];

            return {
              state: stateName.trim(),
              districts: normalizedDistricts
                .map((district) => district.trim())
                .filter(Boolean)
                .filter(
                  (district, index, array) =>
                    array.indexOf(district) === index
                )
                .sort((a, b) =>
                  a.localeCompare(b)
                ),
            };
          })
          .filter(
            (item) =>
              item.state &&
              item.districts.length > 0
          )
          .sort((a, b) =>
            a.state.localeCompare(b.state)
          );

        console.log(
          "NORMALIZED STATES:",
          normalizedStates
        );

        setStates(normalizedStates);

        // IMPORTANT:
        // Do NOT automatically select Tamil Nadu.
        // Do NOT automatically select Tiruppur.
        // Keep both dropdowns blank.
        setSelectedState("");
        setSelectedDistrict("");
        setDistricts([]);

      } catch (err) {
        console.error(
          "Location loading error:",
          err
        );

        setStates([]);
        setDistricts([]);

        setLocationError(
          "Unable to load real Indian states and districts."
        );
      } finally {
        setLocationLoading(false);
      }
    };

    loadLocations();
  }, []);

  // =========================================================
  // STATE CHANGE
  // =========================================================

  const handleStateChange = (event) => {
    const newState = event.target.value;

    console.log("Selected State:", newState);

    setSelectedState(newState);

    // Clear previous district whenever state changes.
    setSelectedDistrict("");

    setMarketPrices([]);
    setSelectedCrop("");
    setSelectedMarket("");
    setLastUpdated("");
    setError("");

    if (!newState) {
      setDistricts([]);
      return;
    }

    const stateData = states.find(
      (item) => item.state === newState
    );

    if (stateData) {
      console.log(
        "Districts for selected state:",
        stateData.districts
      );

      setDistricts(stateData.districts);
    } else {
      setDistricts([]);
    }
  };

  // =========================================================
  // DISTRICT CHANGE
  // =========================================================

  const handleDistrictChange = (event) => {
    const newDistrict = event.target.value;

    console.log(
      "Selected District:",
      newDistrict
    );

    setSelectedDistrict(newDistrict);

    setMarketPrices([]);
    setSelectedCrop("");
    setSelectedMarket("");
    setLastUpdated("");
    setError("");
  };

  // =========================================================
  // FETCH MARKET DATA
  // =========================================================

  const fetchMarketPrices = async () => {
    // Do not call API without complete location.
    if (
      !selectedState ||
      !selectedDistrict
    ) {
      setError(
        "Please select both state and district."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMarketPrices([]);

      const url =
        `${MARKET_API_URL}` +
        `?state=${encodeURIComponent(
          selectedState
        )}` +
        `&district=${encodeURIComponent(
          selectedDistrict
        )}`;

      console.log(
        "Calling market API:",
        url
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Market API error: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Complete OGD response:",
        data
      );

      const records = Array.isArray(
        data?.records
      )
        ? data.records
        : [];

      console.log(
        "Market records:",
        records
      );

      const formatted = records.map(
        (record, index) => ({
          id:
            `${record.market || "market"}-` +
            `${record.commodity || "crop"}-` +
            `${index}`,

          state: record.state || "",

          district: record.district || "",

          market:
            record.market ||
            "Unknown Market",

          commodity:
            record.commodity ||
            "Unknown Crop",

          variety:
            record.variety || "",

          grade:
            record.grade || "",

          arrivalDate:
            record.arrival_date || "",

          minPrice:
            Number(record.min_price) || 0,

          maxPrice:
            Number(record.max_price) || 0,

          modalPrice:
            Number(record.modal_price) || 0,
        })
      );

      console.log(
        "Formatted market records:",
        formatted
      );

      setMarketPrices(formatted);

      if (formatted.length > 0) {
        setSelectedCrop(
          formatted[0].commodity
        );

        setSelectedMarket(
          formatted[0].market
        );
      } else {
        setSelectedCrop("");
        setSelectedMarket("");

        setError(
          `No market data found for ${selectedDistrict}, ${selectedState}.`
        );
      }

      setLastUpdated(
        new Date().toLocaleTimeString(
          "en-IN"
        )
      );

    } catch (err) {
      console.error(
        "Market API error:",
        err
      );

      setMarketPrices([]);

      setError(
        "Unable to load live market prices. Please check the selected location and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // IMPORTANT:
  // DO NOT AUTOMATICALLY FETCH MARKET DATA.
  //
  // The user must select state + district,
  // then click Refresh.
  // =========================================================

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    const value = Number(price) || 0;

    return `₹${value.toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================================================
  // UNIQUE CROPS
  // =========================================================

  const crops = useMemo(() => {
    const cropMap = new Map();

    marketPrices.forEach((item) => {
      if (!cropMap.has(item.commodity)) {
        cropMap.set(
          item.commodity,
          item
        );
      }
    });

    return Array.from(
      cropMap.values()
    );
  }, [marketPrices]);

  // =========================================================
  // SELECTED CROP
  // =========================================================

  const selectedCropData =
    marketPrices.find(
      (item) =>
        item.commodity ===
        selectedCrop
    ) || null;

  // =========================================================
  // SELECTED CROP MARKETS
  // =========================================================

  const selectedCropMarkets =
    useMemo(() => {
      if (!selectedCrop) {
        return [];
      }

      return marketPrices.filter(
        (item) =>
          item.commodity ===
          selectedCrop
      );
    }, [
      marketPrices,
      selectedCrop,
    ]);

  // =========================================================
  // AVERAGE PRICE
  // =========================================================

  const averagePrice =
    useMemo(() => {
      if (
        marketPrices.length === 0
      ) {
        return 0;
      }

      const total =
        marketPrices.reduce(
          (sum, item) =>
            sum + item.modalPrice,
          0
        );

      return Math.round(
        total / marketPrices.length
      );
    }, [marketPrices]);

  // =========================================================
  // BEST MARKET
  // =========================================================

  const bestMarket =
    useMemo(() => {
      if (
        selectedCropMarkets.length === 0
      ) {
        return null;
      }

      return selectedCropMarkets.reduce(
        (highest, current) =>
          current.modalPrice >
          highest.modalPrice
            ? current
            : highest
      );
    },
    [selectedCropMarkets]);

  // =========================================================
  // LOWEST MARKET
  // =========================================================

  const lowestMarket =
    useMemo(() => {
      if (
        selectedCropMarkets.length === 0
      ) {
        return null;
      }

      return selectedCropMarkets.reduce(
        (lowest, current) =>
          current.modalPrice <
          lowest.modalPrice
            ? current
            : lowest
      );
    },
    [selectedCropMarkets]);

  // =========================================================
  // PRICE DIFFERENCE
  // =========================================================

  const priceDifference =
    bestMarket &&
    lowestMarket
      ? bestMarket.modalPrice -
        lowestMarket.modalPrice
      : 0;

  // =========================================================
  // TREND
  // =========================================================

  const getTrend = (item) => {
    if (!item) {
      return "stable";
    }

    if (
      item.maxPrice >
      item.minPrice
    ) {
      return "up";
    }

    if (
      item.maxPrice <
      item.minPrice
    ) {
      return "down";
    }

    return "stable";
  };

  // =========================================================
  // CHANGE
  // =========================================================

  const getChange = (item) => {
    if (
      !item ||
      !item.minPrice ||
      !item.maxPrice
    ) {
      return "0.0%";
    }

    const difference =
      item.maxPrice -
      item.minPrice;

    const percentage =
      (difference /
        item.minPrice) *
      100;

    return `${
      percentage >= 0
        ? "+"
        : ""
    }${percentage.toFixed(1)}%`;
  };

  // =========================================================
  // CROP ICON
  // =========================================================

  const getCropIcon = (cropName) => {
    const name =
      String(cropName || "")
        .toLowerCase();

    if (
      name.includes("tomato") ||
      name.includes("chilli") ||
      name.includes("pepper")
    ) {
      return <FaSeedling />;
    }

    if (
      name.includes("banana") ||
      name.includes("papaya") ||
      name.includes("pineapple") ||
      name.includes("grape")
    ) {
      return <FaLeaf />;
    }

    return <FaSeedling />;
  };

  // =========================================================
  // DEMAND
  // =========================================================

  const getDemand = (item) => {
    if (!item) {
      return "Medium";
    }

    const range =
      item.maxPrice -
      item.minPrice;

    if (range <= 0) {
      return "Medium";
    }

    if (
      item.modalPrice >=
      item.minPrice +
        range * 0.66
    ) {
      return "High";
    }

    if (
      item.modalPrice >=
      item.minPrice +
        range * 0.33
    ) {
      return "Medium";
    }

    return "Low";
  };

  // =========================================================
  // MARKET CARDS
  // =========================================================

  const marketCards =
    selectedCropMarkets.map(
      (item) => ({
        ...item,
        trend: getTrend(item),
        change: getChange(item),
        demand: getDemand(item),
      })
    );

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData =
    selectedCropMarkets.length > 0
      ? selectedCropMarkets
      : marketPrices.slice(0, 8);

  const chartValues =
    chartData.map(
      (item) =>
        Number(
          item.modalPrice
        ) || 0
    );

  const chartMax =
    chartValues.length > 0
      ? Math.max(...chartValues)
      : 0;

  const chartMin =
    chartValues.length > 0
      ? Math.min(...chartValues)
      : 0;

  // =========================================================
  // COMMON NAVBAR
  // =========================================================

  const Navbar = () => (
    <nav className="market-navbar">

      <button
        className="market-back-button"
        onClick={() =>
          navigate("/dashboard")
        }
        type="button"
      >
        <FaArrowLeft />
        <span>
          Back to FarmVerse
        </span>
      </button>

      <div className="market-logo">
        <div className="market-logo-icon">
          <FaSeedling />
        </div>

        <span>
          FarmVerse
        </span>
      </div>

      <button
        className="market-ai-nav-button"
        onClick={() =>
          navigate(
            "/ai-farming-assistant"
          )
        }
        type="button"
      >
        <FaRobot />
        <span>
          AI Assistant
        </span>
      </button>

    </nav>
  );

  // =========================================================
  // LOCATION LOADING
  // =========================================================

  if (locationLoading) {
    return (
      <div className="market-page">

        <Navbar />

        <main className="market-main">

          <section className="market-hero">

            <div className="market-hero-badge">
              <FaMapMarkerAlt />
              LOADING LOCATIONS
            </div>

            <h1>
              Loading Indian
              <span>
                States & Districts...
              </span>
            </h1>

            <p>
              Loading the latest
              available Indian
              administrative locations.
            </p>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // LOCATION ERROR
  // =========================================================

  if (
    locationError ||
    states.length === 0
  ) {
    return (
      <div className="market-page">

        <Navbar />

        <main className="market-main">

          <section className="market-hero">

            <div className="market-hero-badge">
              <FaMapMarkerAlt />
              LOCATION ERROR
            </div>

            <h1>
              Unable to Load
              <span>
                Locations
              </span>
            </h1>

            <p>
              {locationError ||
                "Real Indian state and district data could not be loaded."}
            </p>

            <button
              className="market-change-location"
              onClick={() =>
                window.location.reload()
              }
              type="button"
              style={{
                marginTop: "20px",
              }}
            >
              <FaSyncAlt />
              Retry
            </button>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // MARKET LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="market-page">

        <Navbar />

        <main className="market-main">

          <section className="market-hero">

            <div className="market-hero-badge">
              <FaChartLine />
              MARKET INTELLIGENCE
            </div>

            <h1>
              Loading Live
              <span>
                Market Prices...
              </span>
            </h1>

            <p>
              Fetching the latest
              available mandi prices
              for{" "}
              {selectedDistrict},{" "}
              {selectedState}.
            </p>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="market-page">

      <Navbar />

      <main className="market-main">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="market-hero">

          <div className="market-hero-badge">
            <FaChartLine />
            LIVE MARKET INTELLIGENCE
          </div>

          <h1>
            Know the Market.
            <span>
              Sell at the Right Time.
            </span>
          </h1>

          <p>
            Track real-time mandi prices,
            compare different markets,
            and identify better selling
            opportunities for your harvest.
          </p>

        </section>

        {/* =====================================================
            LOCATION SELECTOR
        ===================================================== */}

        <section className="market-location-card">

          <div className="market-location-left">

            <div className="market-location-icon">
              <FaMapMarkerAlt />
            </div>

            <div>

              <span>
                MARKET REGION
              </span>

              <h3>
                {selectedState &&
                selectedDistrict
                  ? `${selectedDistrict}, ${selectedState}`
                  : "Select your location"}
              </h3>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            {/* STATE */}

            <select
              value={selectedState}
              onChange={
                handleStateChange
              }
              disabled={
                states.length === 0
              }
              style={{
                padding:
                  "10px 14px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #d5ded8",
                background:
                  "#ffffff",
                fontSize:
                  "13px",
                cursor:
                  "pointer",
                minWidth:
                  "180px",
              }}
            >

              <option value="">
                Select State
              </option>

              {states.map(
                (state) => (
                  <option
                    key={
                      state.state
                    }
                    value={
                      state.state
                    }
                  >
                    {state.state}
                  </option>
                )
              )}

            </select>

            {/* DISTRICT */}

            <select
              value={
                selectedDistrict
              }
              onChange={
                handleDistrictChange
              }
              disabled={
                !selectedState ||
                districts.length === 0
              }
              style={{
                padding:
                  "10px 14px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #d5ded8",
                background:
                  "#ffffff",
                fontSize:
                  "13px",
                cursor:
                  selectedState &&
                  districts.length > 0
                    ? "pointer"
                    : "not-allowed",
                minWidth:
                  "200px",
                opacity:
                  selectedState &&
                  districts.length > 0
                    ? 1
                    : 0.6,
              }}
            >

              <option value="">
                {selectedState
                  ? "Select District"
                  : "Select State First"}
              </option>

              {districts.map(
                (district) => (
                  <option
                    key={
                      district
                    }
                    value={
                      district
                    }
                  >
                    {district}
                  </option>
                )
              )}

            </select>

            {/* REFRESH */}

            <button
              className="market-change-location"
              onClick={
                fetchMarketPrices
              }
              type="button"
              disabled={
                !selectedState ||
                !selectedDistrict
              }
              style={{
                opacity:
                  selectedState &&
                  selectedDistrict
                    ? 1
                    : 0.6,
                cursor:
                  selectedState &&
                  selectedDistrict
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              <FaSyncAlt />
              Load Prices
            </button>

          </div>

        </section>

        {/* =====================================================
            LAST UPDATED
        ===================================================== */}

        {lastUpdated && (
          <div
            style={{
              margin:
                "14px 0 20px",
              fontSize:
                "12px",
              color:
                "#78887e",
              display:
                "flex",
              alignItems:
                "center",
              gap:
                "7px",
            }}
          >
            <FaSyncAlt />

            Live data updated at{" "}

            {lastUpdated}

          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div
            style={{
              marginBottom:
                "20px",
              padding:
                "15px 20px",
              borderRadius:
                "12px",
              background:
                "#fff1ef",
              border:
                "1px solid #f0c5bf",
              color:
                "#b65d50",
              fontSize:
                "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        <section className="market-overview">

          {/* AVERAGE PRICE */}

          <div className="market-overview-card primary-market-card">

            <div className="overview-icon">
              <FaRupeeSign />
            </div>

            <div>

              <span>
                AVERAGE MODAL PRICE
              </span>

              <strong>
                {formatPrice(
                  averagePrice
                )}
              </strong>

              <small>
                per quintal
              </small>

            </div>

          </div>

          {/* SELECTED CROP */}

          <div className="market-overview-card">

            <div className="overview-icon green-icon">

              {selectedCropData &&
              getTrend(
                selectedCropData
              ) === "up" ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}

            </div>

            <div>

              <span>
                SELECTED CROP
              </span>

              <strong>
                {selectedCrop ||
                  "No Data"}
              </strong>

              <small>
                Current market
              </small>

            </div>

          </div>

          {/* DEMAND */}

          <div className="market-overview-card">

            <div className="overview-icon gold-icon">
              <FaFire />
            </div>

            <div>

              <span>
                MARKET DEMAND
              </span>

              <strong>
                {selectedCropData
                  ? getDemand(
                      selectedCropData
                    )
                  : "Medium"}
              </strong>

              <small>
                Current indicator
              </small>

            </div>

          </div>

          {/* MARKETS */}

          <div className="market-overview-card">

            <div className="overview-icon blue-icon">
              <FaStore />
            </div>

            <div>

              <span>
                MARKETS TRACKED
              </span>

              <strong>
                {
                  new Set(
                    marketPrices.map(
                      (item) =>
                        item.market
                    )
                  ).size
                }
              </strong>

              <small>
                Live markets
              </small>

            </div>

          </div>

        </section>

        {/* =====================================================
            CROP MARKET SECTION
        ===================================================== */}

        <section className="crop-market-section">

          <div className="market-section-heading">

            <div>

              <span>
                LIVE COMMODITIES
              </span>

              <h2>
                Market Price Dashboard
              </h2>

            </div>

            <p>
              Select a crop to compare
              its current prices across
              available markets.
            </p>

          </div>

          {/* CROP BUTTONS */}

          <div
            style={{
              display:
                "flex",
              gap:
                "10px",
              flexWrap:
                "wrap",
              marginBottom:
                "22px",
            }}
          >

            {crops.map(
              (crop) => (
                <button
                  key={
                    crop.commodity
                  }
                  onClick={() =>
                    setSelectedCrop(
                      crop.commodity
                    )
                  }
                  type="button"
                  style={{
                    padding:
                      "10px 18px",
                    borderRadius:
                      "25px",
                    border:
                      selectedCrop ===
                      crop.commodity
                        ? "1px solid #75ca7e"
                        : "1px solid #d8e1db",
                    background:
                      selectedCrop ===
                      crop.commodity
                        ? "#edf9ef"
                        : "#ffffff",
                    color:
                      "#24382b",
                    cursor:
                      "pointer",
                    fontWeight:
                      "600",
                  }}
                >
                  {crop.commodity}
                </button>
              )
            )}

          </div>

          {/* PRICE TABLE */}

          <div className="crop-table-wrapper">

            <div className="crop-table-header">

              <span>
                Commodity
              </span>

              <span>
                Modal Price
              </span>

              <span>
                Min / Max
              </span>

              <span>
                Demand
              </span>

              <span>
                Market
              </span>

              <span>
                Date
              </span>

            </div>

            {marketPrices.length === 0 ? (

              <div
                style={{
                  padding:
                    "45px",
                  textAlign:
                    "center",
                  color:
                    "#78887e",
                }}
              >

                <FaSearch
                  style={{
                    fontSize:
                      "28px",
                    marginBottom:
                      "12px",
                  }}
                />

                <div>
                  {selectedState &&
                  selectedDistrict
                    ? "No live market prices found for this location."
                    : "Select a state and district to view live market prices."}
                </div>

              </div>

            ) : (

              marketPrices.map(
                (item) => (

                  <div
                    className={`crop-table-row ${
                      selectedCrop ===
                      item.commodity
                        ? "selected-crop-row"
                        : ""
                    }`}
                    key={
                      item.id
                    }
                    onClick={() => {

                      setSelectedCrop(
                        item.commodity
                      );

                      setSelectedMarket(
                        item.market
                      );

                    }}
                    style={{
                      cursor:
                        "pointer",
                    }}
                  >

                    <div className="crop-name-cell">

                      <div className="crop-icon">

                        {getCropIcon(
                          item.commodity
                        )}

                      </div>

                      <div>

                        <strong>
                          {
                            item.commodity
                          }
                        </strong>

                        <span>
                          {item.variety ||
                            "Market commodity"}
                        </span>

                      </div>

                    </div>

                    <div className="crop-price-cell">

                      <strong>
                        {formatPrice(
                          item.modalPrice
                        )}
                      </strong>

                      <span>
                        / quintal
                      </span>

                    </div>

                    <div>

                      <strong>
                        {formatPrice(
                          item.minPrice
                        )}
                      </strong>

                      <span
                        style={{
                          margin:
                            "0 5px",
                          color:
                            "#89958d",
                        }}
                      >
                        -
                      </span>

                      <strong>
                        {formatPrice(
                          item.maxPrice
                        )}
                      </strong>

                    </div>

                    <div>

                      <span
                        className={`demand-badge ${
                          getDemand(
                            item
                          ) ===
                          "High"
                            ? "high-demand"
                            : getDemand(
                                item
                              ) ===
                              "Low"
                            ? "low-demand"
                            : "medium-demand"
                        }`}
                      >
                        {getDemand(
                          item
                        )}
                      </span>

                    </div>

                    <div className="crop-market-name">
                      {item.market}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#78887e",
                      }}
                    >
                      {
                        item.arrivalDate
                      }
                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

        {/* =====================================================
            PRICE ANALYSIS
        ===================================================== */}

        <section className="price-analysis-section">

          <div className="market-section-heading">

            <div>

              <span>
                PRICE ANALYSIS
              </span>

              <h2>
                {selectedCrop ||
                  "Crop"}{" "}
                Market Analysis
              </h2>

            </div>

            <div className="period-selector">

              <button
                className={
                  period === "7D"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setPeriod("7D")
                }
                type="button"
              >
                7D
              </button>

              <button
                className={
                  period === "30D"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setPeriod("30D")
                }
                type="button"
              >
                30D
              </button>

            </div>

          </div>

          <div className="price-chart-card">

            <div className="chart-summary">

              <div>

                <span>
                  CURRENT MODAL PRICE
                </span>

                <strong>
                  {selectedCropData
                    ? formatPrice(
                        selectedCropData.modalPrice
                      )
                    : "₹0"}
                </strong>

                <small>
                  per quintal
                </small>

              </div>

              <div className="chart-growth">

                {selectedCropData &&
                getTrend(
                  selectedCropData
                ) === "up" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}

                <strong>
                  {selectedCropData
                    ? getChange(
                        selectedCropData
                      )
                    : "0.0%"}
                </strong>

                <span>
                  Current price range
                </span>

              </div>

            </div>

            {chartValues.length === 0 ? (

              <div
                style={{
                  height:
                    "350px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color:
                    "#78887e",
                }}
              >
                No price data
                available.
              </div>

            ) : (

              <div className="price-chart">

                <div className="chart-y-axis">

                  <span>
                    ₹
                    {Math.round(
                      chartMax
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span>
                    ₹
                    {Math.round(
                      (chartMax +
                        chartMin) /
                        2
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span>
                    ₹
                    {Math.round(
                      chartMin
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="chart-area">

                  <div className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                  </div>

                  <svg
                    className="price-svg"
                    viewBox="0 0 900 300"
                    preserveAspectRatio="none"
                  >

                    <path
                      d={chartValues
                        .map(
                          (
                            value,
                            index
                          ) => {

                            const x =
                              chartValues.length ===
                              1
                                ? 450
                                : (index /
                                    (chartValues.length -
                                      1)) *
                                  900;

                            const y =
                              chartMax ===
                              chartMin
                                ? 150
                                : 270 -
                                  ((value -
                                    chartMin) /
                                    (chartMax -
                                      chartMin)) *
                                    220;

                            return `${
                              index === 0
                                ? "M"
                                : "L"
                            } ${x} ${y}`;
                          }
                        )
                        .join(" ")}
                      fill="none"
                      stroke="#83d28d"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {chartValues.map(
                      (
                        value,
                        index
                      ) => {

                        const x =
                          chartValues.length ===
                          1
                            ? 450
                            : (index /
                                (chartValues.length -
                                  1)) *
                              900;

                        const y =
                          chartMax ===
                          chartMin
                            ? 150
                            : 270 -
                              ((value -
                                chartMin) /
                                (chartMax -
                                  chartMin)) *
                                220;

                        return (
                          <circle
                            key={
                              index
                            }
                            cx={x}
                            cy={y}
                            r="6"
                            fill="#0b1d11"
                            stroke="#83d28d"
                            strokeWidth="3"
                          />
                        );

                      }
                    )}

                  </svg>

                  <div className="chart-x-axis">

                    {chartData.map(
                      (
                        item,
                        index
                      ) => (

                        <span
                          key={
                            index
                          }
                        >
                          {item.market
                            ?.substring(
                              0,
                              12
                            )}
                        </span>

                      )
                    )}

                  </div>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* =====================================================
            MARKET COMPARISON
        ===================================================== */}

        <section className="market-comparison-section">

          <div className="market-section-heading">

            <div>

              <span>
                MARKET COMPARISON
              </span>

              <h2>
                Where Should You Sell?
              </h2>

            </div>

            <p>
              Compare live modal prices
              across different markets
              for{" "}
              {selectedCrop ||
                "your crop"}.
            </p>

          </div>

          <div className="comparison-grid">

            {marketCards.length === 0 ? (

              <div
                style={{
                  padding:
                    "35px",
                  color:
                    "#78887e",
                }}
              >
                No markets available
                for the selected crop.
              </div>

            ) : (

              marketCards.map(
                (
                  market,
                  index
                ) => (

                  <div
                    className={`comparison-card ${
                      bestMarket &&
                      market.market ===
                        bestMarket.market
                        ? "best-market-card"
                        : ""
                    }`}
                    key={
                      market.id
                    }
                  >

                    {bestMarket &&
                      market.market ===
                        bestMarket.market && (

                        <div className="best-market-label">
                          BEST PRICE
                        </div>

                    )}

                    <div className="comparison-top">

                      <div className="market-store-icon">
                        <FaStore />
                      </div>

                      <span className="market-distance">
                        Market{" "}
                        {index + 1}
                      </span>

                    </div>

                    <h3>
                      {market.market}
                    </h3>

                    <span className="market-location-name">
                      {market.district},{" "}
                      {market.state}
                    </span>

                    <div className="comparison-price">

                      <strong>
                        {formatPrice(
                          market.modalPrice
                        )}
                      </strong>

                      <span>
                        / quintal
                      </span>

                    </div>

                    <div className="comparison-details">

                      <div>

                        <span>
                          Minimum
                        </span>

                        <strong>
                          {formatPrice(
                            market.minPrice
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Maximum
                        </span>

                        <strong>
                          {formatPrice(
                            market.maxPrice
                          )}
                        </strong>

                      </div>

                    </div>

                    <button
                      className="market-view-button"
                      onClick={() => {

                        setSelectedMarket(
                          market.market
                        );

                        setSelectedCrop(
                          market.commodity
                        );

                        window.scrollTo({
                          top: 0,
                          behavior:
                            "smooth",
                        });

                      }}
                      type="button"
                    >
                      View Market
                      <FaArrowRight />
                    </button>

                  </div>
                )
              )

            )}

          </div>

        </section>

        {/* =====================================================
            SMART SELLING
        ===================================================== */}

        {bestMarket && (

          <section className="selling-opportunity">

            <div className="opportunity-icon">
              <FaBalanceScale />
            </div>

            <div className="opportunity-content">

              <span>
                SMART SELLING OPPORTUNITY
              </span>

              <h2>
                {bestMarket.market}{" "}
                currently has the
                highest{" "}
                {selectedCrop.toLowerCase()}{" "}
                modal price in the
                selected region.
              </h2>

              <p>

                Current modal price is{" "}
                {formatPrice(
                  bestMarket.modalPrice
                )}{" "}
                per quintal.

                {priceDifference > 0 &&
                  ` This is ₹${priceDifference.toLocaleString(
                    "en-IN"
                  )} higher than the lowest available market.`}

              </p>

            </div>

            <button
              className="opportunity-button"
              onClick={() =>
                document
                  .querySelector(
                    ".market-comparison-section"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  })
              }
              type="button"
            >
              Compare Markets
              <FaArrowRight />
            </button>

          </section>

        )}

        {/* =====================================================
            MARKET INSIGHTS
        ===================================================== */}

        <section className="market-insights-section">

          <div className="market-section-heading centered-market-heading">

            <div>

              <span>
                MARKET INTELLIGENCE
              </span>

              <h2>
                What the Market Is
                Telling You
              </h2>

            </div>

            <p>
              Insights generated
              directly from the live
              mandi prices received
              from the government
              dataset.
            </p>

          </div>

          <div className="insights-grid">

            <div className="insight-card">

              <div className="insight-icon">
                <FaChartBar />
              </div>

              <span>
                PRICE RANGE
              </span>

              <h3>
                Market prices are varying
              </h3>

              <p>
                The current{" "}
                {selectedCrop ||
                  "crop"}{" "}
                prices range from{" "}
                {formatPrice(
                  lowestMarket?.modalPrice ||
                    0
                )}{" "}
                to{" "}
                {formatPrice(
                  bestMarket?.modalPrice ||
                    0
                )}{" "}
                per quintal across
                the available markets.
              </p>

            </div>

            <div className="insight-card">

              <div className="insight-icon">
                <FaShoppingBasket />
              </div>

              <span>
                MARKET COVERAGE
              </span>

              <h3>
                Live mandi data available
              </h3>

              <p>
                FarmVerse is currently
                tracking{" "}
                {marketPrices.length}{" "}
                commodity records in{" "}
                {
                  new Set(
                    marketPrices.map(
                      (item) =>
                        item.market
                    )
                  ).size
                }{" "}
                market locations.
              </p>

            </div>

            <div className="insight-card">

              <div className="insight-icon">
                <FaArrowUp />
              </div>

              <span>
                SELLING SIGNAL
              </span>

              <h3>
                Compare before selling
              </h3>

              <p>
                Before selling your
                harvest, compare the
                modal prices across
                nearby markets and
                consider transportation
                costs.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            AI CTA
        ===================================================== */}

        <section className="market-ai-cta">

          <div className="market-ai-icon">
            <FaRobot />
          </div>

          <div className="market-ai-content">

            <span>
              MARKET + AI
            </span>

            <h2>
              Need help deciding where
              to sell?
            </h2>

            <p>
              Ask FarmVerse AI about
              crop prices, market
              trends, selling
              opportunities, and farm
              profitability.
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
            type="button"
          >
            Ask FarmVerse AI
            <FaArrowRight />
          </button>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="market-footer">

          <div className="market-footer-brand">

            <FaLeaf />

            <span>
              FarmVerse
            </span>

          </div>

          <p>
            Smart agriculture •
            Better decisions •
            Better harvests
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            type="button"
          >
            Back to Dashboard
          </button>

        </footer>

      </main>

    </div>
  );
}

export default MarketAnalysis;
