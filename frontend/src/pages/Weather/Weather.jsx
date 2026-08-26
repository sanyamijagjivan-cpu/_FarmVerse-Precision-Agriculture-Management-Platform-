
import React, {
  useEffect,
  useState,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaRobot,
  FaMapMarkerAlt,
  FaTint,
  FaWind,
  FaCloudRain,
  FaSun,
  FaSeedling,
  FaFlask,
  FaTractor,
  FaExclamationTriangle,
  FaLeaf,
  FaArrowRight,
  FaCloudSun,
  FaSearch,
  FaCrosshairs,
  FaMap,
  FaTimes,
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./Weather.css";


// =====================================================
// API
// =====================================================

const API_BASE_URL = "http://localhost:8080";


// =====================================================
// DEFAULT MAP LOCATION
// =====================================================

const DEFAULT_LATITUDE = 15.8281;
const DEFAULT_LONGITUDE = 78.0373;


// =====================================================
// LEAFLET MARKER ICON FIX
// =====================================================

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


// =====================================================
// MAP CLICK HANDLER
// =====================================================

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onLocationSelect(lat, lng);
    },
  });

  return null;
}


// =====================================================
// MAP CENTER COMPONENT
// =====================================================

function MapCenter({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof latitude === "number" &&
      typeof longitude === "number"
    ) {
      map.setView(
        [latitude, longitude],
        12,
        {
          animate: true,
        }
      );
    }
  }, [latitude, longitude, map]);

  return null;
}


// =====================================================
// WEATHER COMPONENT
// =====================================================

function Weather() {
  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

const [location, setLocation] = useState("");
const [locationInput, setLocationInput] = useState("");

const [selectedCoordinates, setSelectedCoordinates] = useState({
  latitude: null,
  longitude: null,
});

const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [locationSearching, setLocationSearching] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    

  // =====================================================
  // MAP STATE
  // =====================================================

  const [latitude, setLatitude] =
    useState(DEFAULT_LATITUDE);

  const [longitude, setLongitude] =
    useState(DEFAULT_LONGITUDE);

  const [mapLocationName, setMapLocationName] =
    useState("Kurnool");


  // =====================================================
  // LOAD WEATHER
  // =====================================================

 const loadWeather = async (location) => {
  try {
    setLoading(true);
    setError("");

    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again. Authentication token not found.");
    }

    // Make authenticated request to Spring Boot
    const response = await fetch(
      `http://localhost:8080/api/weather?city=${encodeURIComponent(location)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Your login session has expired. Please logout and login again."
        );
      }

      throw new Error(
        `Weather API failed with status ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Weather data:", data);

    // Keep your existing weather state update here.
    setWeather(data);

  } catch (error) {
    console.error("Weather loading error:", error);
    setError(error.message || "Unable to load weather.");
  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
  // No default location.
  // User must either select a location
  // manually or use My Location.
}, []);


  // =====================================================
  // MANUAL LOCATION SEARCH
  // =====================================================

  const searchLocation = async () => {
    const city = locationInput.trim();

    if (!city) {
      setError(
        "Please enter a location."
      );

      return;
    }

    try {
      setLocationSearching(true);
      setError("");

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(
          "Location search failed."
        );
      }

      const data = await response.json();

      if (
        !data.results ||
        data.results.length === 0
      ) {
        setError(
          "Location not found. Please enter a valid city or town."
        );

        return;
      }

      const result = data.results[0];

      const newLatitude =
        Number(result.latitude);

      const newLongitude =
        Number(result.longitude);

      const newCity =
        result.name || city;

      setLatitude(newLatitude);
      setLongitude(newLongitude);

      setLocation(newCity);
      setLocationInput(newCity);
      setMapLocationName(newCity);

      await loadWeather(newCity);
    } catch (err) {
      console.error(
        "Location search error:",
        err
      );

      setError(
        "Unable to find this location. Please try another city."
      );
    } finally {
      setLocationSearching(false);
    }
  };


  // =====================================================
  // ENTER KEY SEARCH
  // =====================================================

  const handleLocationKeyDown = (event) => {
    if (event.key === "Enter") {
      searchLocation();
    }
  };


  // =====================================================
  // REVERSE GEOCODING
  // COORDINATES → CITY
  // =====================================================

  const reverseGeocode = async (
  lat,
  lng,
  loadWeatherAfter = true
) => {
  try {
    setLocationSearching(true);
    setError("");

    console.log("=================================");
    console.log("REVERSE GEOCODING");
    console.log("Latitude:", lat);
    console.log("Longitude:", lng);
    console.log("=================================");

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Reverse geocoding failed."
      );
    }

    const data = await response.json();

    console.log(
      "NOMINATIM RESPONSE:",
      data
    );

    const address = data.address || {};

    // =====================================================
    // FIND BEST AVAILABLE PLACE NAME
    // =====================================================

    const detectedCity =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      address.municipality ||
      address.county ||
      address.state_district ||
      address.state ||
      "Selected Location";

    console.log(
      "Detected place:",
      detectedCity
    );

    // =====================================================
    // SAVE EXACT COORDINATES
    // =====================================================

    setLatitude(lat);
    setLongitude(lng);

    setSelectedCoordinates({
      latitude: lat,
      longitude: lng,
    });

    // =====================================================
    // UPDATE LOCATION NAME
    // =====================================================

    setLocation(
      detectedCity
    );

    setLocationInput(
      detectedCity
    );

    setMapLocationName(
      detectedCity
    );

    // =====================================================
    // LOAD WEATHER
    // =====================================================

    if (loadWeatherAfter) {

      /*
       * For now we use the detected place name
       * because your existing backend accepts:
       *
       * /api/weather?city=...
       *
       * We will later change this to exact
       * latitude + longitude weather.
       */

      await loadWeather(
        detectedCity
      );
    }

  } catch (err) {

    console.error(
      "Reverse geocoding error:",
      err
    );

    setError(
      "Unable to identify this map location. Please try selecting the location again."
    );

  } finally {

    setLocationSearching(false);

  }
};

  // =====================================================
  // MAP LOCATION SELECTION
  // =====================================================

  const handleMapLocationSelect = (
    lat,
    lng
  ) => {
    reverseGeocode(
      lat,
      lng,
      true
    );
  };


  // =====================================================
// USE MY LOCATION
// =====================================================

const useMyLocation = () => {
  if (!navigator.geolocation) {
    setError(
      "Geolocation is not supported by your browser."
    );

    return;
  }

  setLocationSearching(true);
  setError("");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        console.log("=================================");
        console.log("MY LOCATION DETECTED");
        console.log("Latitude:", lat);
        console.log("Longitude:", lng);
        console.log("Accuracy:", accuracy, "meters");
        console.log("=================================");

        // Save exact coordinates
        setSelectedCoordinates({
          latitude: lat,
          longitude: lng,
        });

        // Move map to exact detected location
        if (mapRef.current) {
          mapRef.current.setView(
            [lat, lng],
            15
          );
        }

        // Move marker to exact detected location
        if (markerRef.current) {
          markerRef.current.setLatLng([
            lat,
            lng,
          ]);
        }

        // Reverse geocode exact coordinates
        await reverseGeocode(
          lat,
          lng,
          true
        );

      } catch (error) {
        console.error(
          "My location processing error:",
          error
        );

        setError(
          "Location detected, but we could not determine the place name."
        );

        setLocationSearching(false);
      }
    },

    (geoError) => {
      console.error(
        "Geolocation error:",
        geoError
      );

      setLocationSearching(false);

      if (geoError.code === 1) {
        setError(
          "Location permission was denied. Please allow location access in your browser."
        );
      } else if (geoError.code === 2) {
        setError(
          "Your current location could not be determined. Please try again."
        );
      } else if (geoError.code === 3) {
        setError(
          "Location detection timed out. Please try again."
        );
      } else {
        setError(
          "Unable to detect your location. Please try again."
        );
      }
    },

    {
      // IMPORTANT:
      // Request the most accurate location available
      enableHighAccuracy: true,

      // Give GPS more time to get a better position
      timeout: 30000,

      // Never use an old cached location
      maximumAge: 0,
    }
  );
};

  // =====================================================
  // CLEAR LOCATION INPUT
  // =====================================================

  const clearLocationInput = () => {
    setLocationInput("");
  };


  // =====================================================
  // WEATHER ICON
  // =====================================================

  const getWeatherIcon = (
    condition
  ) => {
    if (!condition) {
      return <FaCloudSun />;
    }

    const value =
      condition.toLowerCase();

    if (
      value.includes("thunder")
    ) {
      return <FaCloudRain />;
    }

    if (
      value.includes("rain") ||
      value.includes("drizzle") ||
      value.includes("shower")
    ) {
      return <FaCloudRain />;
    }

    if (
      value.includes("cloud") ||
      value.includes("fog")
    ) {
      return <FaCloudSun />;
    }

    if (
      value.includes("snow")
    ) {
      return <FaCloudSun />;
    }

    return <FaSun />;
  };


  // =====================================================
  // WEATHER STATUS
  // =====================================================

  const getWeatherStatus = (
    condition
  ) => {
    if (!condition) {
      return {
        title:
          "WEATHER CONDITIONS",

        message:
          "Weather information is currently unavailable.",
      };
    }

    const value =
      condition.toLowerCase();

    if (
      value.includes("rain") ||
      value.includes("drizzle") ||
      value.includes("shower") ||
      value.includes("thunder")
    ) {
      return {
        title:
          "RAIN CONDITIONS",

        message:
          "Rain may affect outdoor farming activities. Check field drainage and avoid spraying during rainfall.",
      };
    }

    if (
      value.includes("cloud") ||
      value.includes("fog")
    ) {
      return {
        title:
          "MODERATE CONDITIONS",

        message:
          "Cloudy conditions may be suitable for several routine farming activities.",
      };
    }

    return {
      title:
        "GOOD CONDITIONS",

      message:
        "Current conditions are suitable for most outdoor farming activities.",
    };
  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="weather-page">

        <nav className="weather-navbar">

          <button
            className="weather-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FaArrowLeft />

            <span>
              Back to FarmVerse
            </span>
          </button>


          <div className="weather-logo">

            <div className="weather-logo-icon">
              <FaSeedling />
            </div>

            <span>
              FarmVerse
            </span>

          </div>

<button
            className="weather-ai-nav-button"
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
          >
            <FaRobot />

            <span>
              AI Assistant
            </span>
          </button>

        </nav>


        <main className="weather-main">

          <section className="weather-hero">

            <div className="weather-hero-badge">

              <FaCloudSun />

              FARM WEATHER INTELLIGENCE

            </div>


            <h1>

              Weather That Works

              <span>
                {" "}For Your Farm
              </span>

            </h1>


            <p>
              Loading real-time weather
              information for your farm
              location...
            </p>

          </section>


          <div className="farm-location-card">

            <div className="location-left">

              <div className="location-icon">
                <FaMapMarkerAlt />
              </div>

              <div>

                <span>
                  FARM LOCATION
                </span>

                <h3>
                  {location || "No location selected"}
                </h3>

              </div>

            </div>

          </div>


          <div
            style={{
              width: "100%",
              padding: "70px 20px",
              textAlign: "center",
              background: "#ffffff",
              border:
                "1px solid #dce8de",
              borderRadius: "28px",
            }}
          >

            <div
              style={{
                fontSize: "40px",
                marginBottom: "20px",
              }}
            >
              ☁️
            </div>

            <h2
              style={{
                marginBottom: "10px",
                color: "#26362a",
              }}
            >
              Loading Weather Data...
            </h2>

            <p
              style={{
                color: "#718078",
              }}
            >
              Connecting to FarmVerse
              weather service.
            </p>

          </div>

        </main>

      </div>
    );
  }


  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (
    error ||
    !weather
  ) {
    return (
      <div className="weather-page">

        <nav className="weather-navbar">

          <button
            className="weather-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FaArrowLeft />

            <span>
              Back to FarmVerse
            </span>
          </button>


          <div className="weather-logo">

            <div className="weather-logo-icon">
              <FaSeedling />
            </div>

            <span>
              FarmVerse
            </span>

          </div>


          <button
            className="weather-ai-nav-button"
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
          >
            <FaRobot />

            <span>
              AI Assistant
            </span>
          </button>

        </nav>


        <main className="weather-main">

          <section className="weather-hero">

            <div className="weather-hero-badge">

              <FaCloudSun />

              FARM WEATHER INTELLIGENCE

            </div>


            <h1>

              Weather That Works

              <span>
                {" "}For Your Farm
              </span>

            </h1>

          </section>


          {/* LOCATION SEARCH */}

          <section className="location-selector-section">

            <div className="location-selector-header">

              <div>

                <span>
                  FARM LOCATION
                </span>

                <h2>
                  Select Your Farm Location
                </h2>

              </div>

            </div>


            <div className="location-search-row">

              <div className="location-input-wrapper">

                <FaSearch />

                <input
                  type="text"
                  value={
                    locationInput
                  }
                  onChange={(event) =>
                    setLocationInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleLocationKeyDown
                  }
                  placeholder="Search city or town..."
                />

                {locationInput && (
                  <button
                    type="button"
                    onClick={
                      clearLocationInput
                    }
                    className="clear-location-button"
                  >
                    <FaTimes />
                  </button>
                )}

              </div>


              <button
                className="location-search-button"
                onClick={
                  searchLocation
                }
                disabled={
                  locationSearching
                }
              >

                <FaSearch />

                {locationSearching
                  ? "Searching..."
                  : "Search Location"}

              </button>


              <button
                className="use-location-button"
                onClick={
                  useMyLocation
                }
                disabled={
                  locationSearching
                }
              >

                <FaCrosshairs />

                Use My Location

              </button>

            </div>


            {error && (
              <div className="location-error">
                <FaExclamationTriangle />

                <span>
                  {error}
                </span>
              </div>
            )}

          </section>


          {/* MAP */}

          <section className="map-location-section">

            <div className="map-section-header">

              <div>

                <span>
                  MAP SELECTION
                </span>

                <h2>
                  Choose Location From Map
                </h2>

                <p>
                  Search for a place above,
                  use your current location,
                  or click directly on the map.
                </p>

              </div>

              <div className="map-current-location">

                <FaMapMarkerAlt />

                <span>
                  {mapLocationName}
                </span>

              </div>

            </div>


            <div className="farm-map-container">

              <MapContainer
                center={[
                  latitude,
                  longitude,
                ]}
                zoom={12}
                scrollWheelZoom={true}
                className="farm-map"
              >

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <MapCenter
                  latitude={
                    latitude
                  }
                  longitude={
                    longitude
                  }
                />


                <MapClickHandler
                  onLocationSelect={
                    handleMapLocationSelect
                  }
                />


                <Marker
                  position={[
                    latitude,
                    longitude,
                  ]}
                  icon={
                    markerIcon
                  }
                />

              </MapContainer>


              <div className="map-instruction">

                <FaMap />

                <span>
                  Click anywhere on the map
                  to select a farm location
                </span>

              </div>

            </div>

          </section>


          {/* RETRY */}

          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >

            <button
              className="change-location-button"
              onClick={() =>
                loadWeather(
                  location
                )
              }
            >
              Try Again
            </button>

          </div>

        </main>

      </div>
    );
  }


  // =====================================================
  // REAL WEATHER DATA
  // =====================================================

  const temperature =
    Number(
      weather.temperature
    ) || 0;


  const humidity =
    Number(
      weather.humidity
    ) || 0;


  const windSpeed =
    Number(
      weather.windSpeed
    ) || 0;


  const condition =
    weather.condition ||
    "Unknown";


  const currentLocation =
    weather.location ||
    location;


  const hourlyForecast =
    weather.hourlyForecast ||
    [];


  const weeklyForecast =
    weather.weeklyForecast ||
    [];


  const risks =
    weather.risks ||
    [];


  const weatherStatus =
    getWeatherStatus(
      condition
    );


  // =====================================================
  // FIND RISK
  // =====================================================

  const getRisk = (
    riskName
  ) => {

    return risks.find(
      (risk) =>
        risk.name &&
        risk.name.toLowerCase() ===
          riskName.toLowerCase()
    );

  };


  // =====================================================
  // RISK COLOR CLASS
  // =====================================================

  const getRiskClass = (
    level
  ) => {

    if (!level) {
      return "low";
    }

    const value =
      level.toLowerCase();

    if (value === "high") {
      return "high";
    }

    if (value === "moderate") {
      return "moderate";
    }

    return "low";

  };


  // =====================================================
  // FARMING RECOMMENDATIONS
  // =====================================================

  const rainRisk =
    getRisk("Rain Risk");

  const windRisk =
    getRisk("Wind Risk");

  const humidityRisk =
    getRisk("Humidity Risk");


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="weather-page">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="weather-navbar">

        <button
          className="weather-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          <FaArrowLeft />

          <span>
            Back to FarmVerse
          </span>

        </button>


        <div className="weather-logo">

          <div className="weather-logo-icon">
            <FaSeedling />
          </div>

          <span>
            FarmVerse
          </span>

        </div>


        <button
          className="weather-ai-nav-button"
          onClick={() =>
            navigate(
              "/ai-farming-assistant"
            )
          }
        >

          <FaRobot />

          <span>
            AI Assistant
          </span>

        </button>

      </nav>



      {/* =================================================
          MAIN
      ================================================= */}

      <main className="weather-main">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="weather-hero">

          <div className="weather-hero-badge">

            <FaCloudSun />

            FARM WEATHER INTELLIGENCE

          </div>


          <h1>

            Weather That Works

            <span>
              {" "}For Your Farm
            </span>

          </h1>


          <p>

            Understand local weather conditions
            and turn real-time forecasts into
            smarter farming decisions for
            irrigation, spraying, sowing,
            and field activities.

          </p>

        </section>



        {/* =================================================
            PROFESSIONAL LOCATION SELECTOR
        ================================================= */}

        <section className="location-selector-section">

          <div className="location-selector-header">

            <div>

              <span>
                FARM LOCATION
              </span>

              <h2>
                Select Your Farm Location
              </h2>

              <p>
                Search manually or select your
                farm directly from the map.
              </p>

            </div>

            <div className="selected-location-badge">

              <FaMapMarkerAlt />

              <div>

                <small>
                  SELECTED LOCATION
                </small>

                <strong>
                  {currentLocation}
                </strong>

              </div>

            </div>

          </div>


          <div className="location-search-row">

            <div className="location-input-wrapper">

              <FaSearch />

              <input
                type="text"
                value={
                  locationInput
                }
                onChange={(event) =>
                  setLocationInput(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleLocationKeyDown
                }
                placeholder="Search city or town..."
              />

              {locationInput && (

                <button
                  type="button"
                  onClick={
                    clearLocationInput
                  }
                  className="clear-location-button"
                >
                  <FaTimes />
                </button>

              )}

            </div>


            <button
              className="location-search-button"
              onClick={
                searchLocation
              }
              disabled={
                locationSearching
              }
            >

              <FaSearch />

              {locationSearching
                ? "Searching..."
                : "Search Location"}

            </button>


            <button
              className="use-location-button"
              onClick={
                useMyLocation
              }
              disabled={
                locationSearching
              }
            >

              <FaCrosshairs />

              Use My Location

            </button>

          </div>


          {error && (

            <div className="location-error">

              <FaExclamationTriangle />

              <span>
                {error}
              </span>

            </div>

          )}

        </section>



        {/* =================================================
            MAP
        ================================================= */}

        <section className="map-location-section">

          <div className="map-section-header">

            <div>

              <span>
                MAP SELECTION
              </span>

              <h2>
                Choose Location From Map
              </h2>

              <p>
                Click anywhere on the map to
                select your farm location.
              </p>

            </div>


            <div className="map-current-location">

              <FaMapMarkerAlt />

              <span>
                {mapLocationName}
              </span>

            </div>

          </div>


          <div className="farm-map-container">

            <MapContainer
              center={[
                latitude,
                longitude,
              ]}
              zoom={12}
              scrollWheelZoom={true}
              className="farm-map"
            >

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              <MapCenter
                latitude={
                  latitude
                }
                longitude={
                  longitude
                }
              />


              <MapClickHandler
                onLocationSelect={
                  handleMapLocationSelect
                }
              />


              <Marker
                position={[
                  latitude,
                  longitude,
                ]}
                icon={
                  markerIcon
                }
              />

            </MapContainer>


            <div className="map-instruction">

              <FaMap />

              <span>
                Click anywhere on the map
                to change your farm location
              </span>

            </div>

          </div>

        </section>



        {/* =================================================
            LOCATION CARD
        ================================================= */}

        <section className="farm-location-card">

          <div className="location-left">

            <div className="location-icon">
              <FaMapMarkerAlt />
            </div>


            <div>

              <span>
                FARM LOCATION
              </span>

              <h3>
                {currentLocation}
              </h3>

            </div>

          </div>


          <div className="selected-coordinates">

            <span>
              Coordinates
            </span>

            <strong>
              {latitude.toFixed(4)},
              {" "}
              {longitude.toFixed(4)}
            </strong>

          </div>

        </section>



        {/* =================================================
            CURRENT WEATHER
        ================================================= */}

        <section className="current-weather-section">

          <div className="current-weather-card">

            <div className="current-weather-main">

              <span className="section-mini-label">
                CURRENT WEATHER
              </span>


              <div className="temperature-row">

                <div className="main-weather-icon">

                  {getWeatherIcon(
                    condition
                  )}

                </div>


                <div>

                  <div className="main-temperature">

                    {temperature.toFixed(1)}

                    <span>
                      °C
                    </span>

                  </div>


                  <p>
                    {condition}
                  </p>

                </div>

              </div>


              <span className="feels-like">

                Live weather data from FarmVerse

              </span>

            </div>


            <div className="weather-condition">

              <div className="condition-status">

                <span className="status-dot"></span>

                {weatherStatus.title}

              </div>


              <p>
                {weatherStatus.message}
              </p>

            </div>

          </div>



          {/* WEATHER METRICS */}

          <div className="weather-metrics">


            <div className="weather-metric-card">

              <div className="metric-icon temperature-icon">
                <FaSun />
              </div>

              <div>

                <span>
                  Temperature
                </span>

                <strong>
                  {temperature.toFixed(1)}°C
                </strong>

              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon humidity-icon">
                <FaTint />
              </div>

              <div>

                <span>
                  Humidity
                </span>

                <strong>
                  {humidity}%
                </strong>

              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon rain-icon">
                <FaCloudRain />
              </div>

              <div>

                <span>
                  Weather
                </span>

                <strong>
                  {condition}
                </strong>

              </div>

            </div>


            <div className="weather-metric-card">

              <div className="metric-icon wind-icon">
                <FaWind />
              </div>

              <div>

                <span>
                  Wind Speed
                </span>

                <strong>
                  {windSpeed.toFixed(1)} km/h
                </strong>

              </div>

            </div>

          </div>

        </section>



        {/* =================================================
            FARM WEATHER ALERT
        ================================================= */}

        <section className="farm-weather-alert">

          <div className="alert-icon">
            <FaExclamationTriangle />
          </div>


          <div className="alert-content">

            <span>
              FARM WEATHER ALERT
            </span>

            <h3>
              Current condition: {condition}
            </h3>

            <p>

              Current temperature is{" "}
              {temperature.toFixed(1)}°C with{" "}
              {humidity}% humidity and wind
              speed of{" "}
              {windSpeed.toFixed(1)} km/h.

              Use these live conditions when
              planning outdoor farm activities.

            </p>

          </div>


          <button
            className="alert-details-button"
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
          >

            Ask AI

            <FaArrowRight />

          </button>

        </section>



        {/* =================================================
            HOURLY FORECAST
        ================================================= */}

        <section className="forecast-section">

          <div className="section-heading">

            <div>

              <span>
                HOURLY CONDITIONS
              </span>

              <h2>
                Today's Weather
              </h2>

            </div>


            <p>
              Real hourly weather forecast
              from the FarmVerse weather service.
            </p>

          </div>


          <div className="hourly-forecast">

            {hourlyForecast.length > 0 ? (

              hourlyForecast.map(
                (item, index) => (

                  <div
                    className={`hour-card ${
                      index === 3
                        ? "hour-card-active"
                        : ""
                    }`}
                    key={`${item.time}-${index}`}
                  >

                    <span className="hour-time">
                      {item.time}
                    </span>


                    <div className="hour-icon">

                      {getWeatherIcon(
                        getConditionFromCode(
                          item.weatherCode
                        )
                      )}

                    </div>


                    <strong>
                      {Number(
                        item.temperature
                      ).toFixed(0)}
                      °
                    </strong>


                    <span className="hour-rain">

                      <FaCloudRain />

                      {item.rainProbability}%

                    </span>

                  </div>

                )

              )

            ) : (

              <p>
                Hourly forecast unavailable.
              </p>

            )}

          </div>

        </section>



        {/* =================================================
            7 DAY FORECAST
        ================================================= */}

        <section className="forecast-section weekly-section">

          <div className="section-heading">

            <div>

              <span>
                EXTENDED FORECAST
              </span>

              <h2>
                7-Day Farm Forecast
              </h2>

            </div>


            <p>
              Real forecast values retrieved
              from the weather service.
            </p>

          </div>


          <div className="weekly-forecast">

            {weeklyForecast.length > 0 ? (

              weeklyForecast.map(
                (day, index) => (

                  <div
                    className={`day-card ${
                      index === 0
                        ? "day-card-active"
                        : ""
                    }`}
                    key={`${day.date}-${index}`}
                  >

                    <span className="day-name">
                      {day.day}
                    </span>


                    <div className="day-icon">

                      {getWeatherIcon(
                        day.condition
                      )}

                    </div>


                    <span className="day-condition">
                      {day.condition}
                    </span>


                    <div className="day-temperature">

                      <strong>
                        {Number(
                          day.high
                        ).toFixed(0)}
                        °
                      </strong>

                      <span>
                        {Number(
                          day.low
                        ).toFixed(0)}
                        °
                      </span>

                    </div>


                    <div className="day-rain">

                      <FaCloudRain />

                      {day.rainProbability}%

                    </div>

                  </div>

                )

              )

            ) : (

              <p>
                Weekly forecast unavailable.
              </p>

            )}

          </div>

        </section>



        {/* =================================================
            FARMING INTELLIGENCE
        ================================================= */}

        <section className="farming-intelligence">

          <div className="section-heading centered-heading">

            <div>

              <span>
                WEATHER → FARMING DECISIONS
              </span>

              <h2>
                Farming Intelligence
              </h2>

            </div>


            <p>
              Real weather data translated into
              practical recommendations for your farm.
            </p>

          </div>


          <div className="intelligence-grid">


            {/* IRRIGATION */}

            <div className="intelligence-card irrigation-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaTint />
                </div>


                <span
                  className={`recommendation-status ${getRiskClass(
                    humidityRisk?.level
                  )}`}
                >
                  {humidityRisk?.level ||
                    "CHECK"}
                </span>

              </div>


              <h3>
                Irrigation
              </h3>


              <p>

                Current humidity is{" "}
                {humidity}%.

                {humidity >= 75
                  ? " High humidity may reduce immediate irrigation demand."
                  : humidity >= 50
                  ? " Moderate humidity should be considered when planning irrigation."
                  : " Lower humidity may increase crop water demand."}

              </p>


              <div className="recommendation-footer">

                <span>
                  Humidity
                </span>

                <strong>
                  {humidity}%
                </strong>

              </div>

            </div>



            {/* SPRAYING */}

            <div className="intelligence-card spraying-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaFlask />
                </div>


                <span
                  className={`recommendation-status ${getRiskClass(
                    windRisk?.level
                  )}`}
                >
                  {windRisk?.level ||
                    "CHECK"}
                </span>

              </div>


              <h3>
                Spraying
              </h3>


              <p>

                Current wind speed is{" "}
                {windSpeed.toFixed(1)} km/h.

                {windSpeed >= 20
                  ? " Strong winds may increase spray drift. Avoid spraying during unsuitable conditions."
                  : " Current wind conditions should still be checked before spraying."}

              </p>


              <div className="recommendation-footer">

                <span>
                  Wind Speed
                </span>

                <strong>
                  {windSpeed.toFixed(1)} km/h
                </strong>

              </div>

            </div>



            {/* FIELD WORK */}

            <div className="intelligence-card field-card">

              <div className="intelligence-top">

                <div className="intelligence-icon">
                  <FaTractor />
                </div>


                <span
                  className={`recommendation-status ${getRiskClass(
                    rainRisk?.level
                  )}`}
                >
                  {rainRisk?.level ||
                    "CHECK"}
                </span>

              </div>


              <h3>
                Field Work
              </h3>


              <p>

                Current condition is{" "}
                {condition} with a temperature
                of{" "}
                {temperature.toFixed(1)}°C.

                {rainRisk?.percentage >= 70
                  ? " High rain probability may affect outdoor field activities."
                  : rainRisk?.percentage >= 40
                  ? " Moderate rain probability should be considered when planning field work."
                  : " Current rain probability is relatively low."}

              </p>


              <div className="recommendation-footer">

                <span>
                  Rain Probability
                </span>

                <strong>
                  {rainRisk?.percentage ?? 0}%
                </strong>

              </div>

            </div>

          </div>

        </section>



        {/* =================================================
            CROP WEATHER RISK
        ================================================= */}

        <section className="risk-section">

          <div className="section-heading">

            <div>

              <span>
                FARM RISK MONITORING
              </span>

              <h2>
                Crop Weather Risk
              </h2>

            </div>


            <p>

              Risk values are calculated by the
              FarmVerse backend using live weather data.

            </p>

          </div>


          <div className="risk-card">

            {risks.length > 0 ? (

              risks.map(
                (risk) => (

                  <div
                    className="risk-row"
                    key={risk.name}
                  >

                    <div className="risk-name">

                      <span>
                        {risk.name}
                      </span>


                      <strong
                        className={`risk-level-${getRiskClass(
                          risk.level
                        )}`}
                      >
                        {risk.level}
                      </strong>

                    </div>


                    <div className="risk-track">

                      <div
                        className={`risk-fill ${getRiskClass(
                          risk.level
                        )}-risk`}
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                risk.percentage
                              ) || 0,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      ></div>

                    </div>


                    <span className="risk-percentage">

                      {risk.percentage}%

                    </span>

                  </div>

                )

              )

            ) : (

              <p>

                Crop weather risk information
                is currently unavailable.

              </p>

            )}

          </div>

        </section>



        {/* =================================================
            AI CTA
        ================================================= */}

        <section className="weather-ai-cta">

          <div className="weather-ai-icon">
            <FaRobot />
          </div>


          <div className="weather-ai-content">

            <span>
              WEATHER + AI
            </span>

            <h2>

              Not sure what today's weather
              means for your farm?

            </h2>


            <p>

              Ask FarmVerse AI about irrigation,
              spraying, sowing, harvesting,
              crop protection, and more.

            </p>

          </div>


          <button
            onClick={() =>
              navigate(
                "/ai-farming-assistant"
              )
            }
          >

            Ask FarmVerse AI

            <FaArrowRight />

          </button>

        </section>



        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="weather-footer">

          <div className="weather-footer-brand">

            <FaLeaf />

            <span>
              FarmVerse
            </span>

          </div>


          <p>
            Smart agriculture • Better decisions • Better harvests
          </p>


          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Home
          </button>

        </footer>

      </main>

    </div>
  );
}


// =====================================================
// WEATHER CODE → CONDITION
// =====================================================

function getConditionFromCode(
  code
) {

  const weatherCode =
    Number(code);


  if (weatherCode === 0) {
    return "Clear Sky";
  }


  if (
    weatherCode === 1 ||
    weatherCode === 2
  ) {
    return "Partly Cloudy";
  }


  if (weatherCode === 3) {
    return "Cloudy";
  }


  if (
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return "Fog";
  }


  if (
    weatherCode >= 51 &&
    weatherCode <= 57
  ) {
    return "Drizzle";
  }


  if (
    weatherCode >= 61 &&
    weatherCode <= 67
  ) {
    return "Rain";
  }


  if (
    weatherCode >= 71 &&
    weatherCode <= 77
  ) {
    return "Snow";
  }


  if (
    weatherCode >= 80 &&
    weatherCode <= 82
  ) {
    return "Rain Showers";
  }


  if (
    weatherCode >= 85 &&
    weatherCode <= 86
  ) {
    return "Snow Showers";
  }


  if (
    weatherCode >= 95 &&
    weatherCode <= 99
  ) {
    return "Thunderstorm";
  }


  return "Unknown";
}


export default Weather;

