import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Splash from "./pages/Auth/Splash";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import AIAssistant from "./pages/AIAssistant/AIAssistant";
import MyFarm from "./pages/MyFarm/MyFarm";

import AIFarmingAssistant from "./pages/FarmingAssistant/AIFarmingAssistant";
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection";
import MarketAnalysis from "./pages/MarketAnalysis/MarketAnalysis";
import Weather from "./pages/Weather/Weather";

import CropManagement from "./pages/CropManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Authentication */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/my-farm" element={<MyFarm />} />

        {/* New Features */}
        <Route
          path="/ai-farming-assistant"
          element={<AIFarmingAssistant />}
        />
        <Route
          path="/disease-detection"
          element={<DiseaseDetection />}
        />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market-analysis" element={<MarketAnalysis />} />


        <Route
  path="/crop-management"
  element={<CropManagement />}
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
