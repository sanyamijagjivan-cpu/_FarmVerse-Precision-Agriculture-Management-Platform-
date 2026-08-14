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
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection";
import MarketAnalysis from "./pages/MarketAnalysis/MarketAnalysis";
import Weather from "./pages/Weather/Weather";

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

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/my-farm" element={<MyFarm />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/market-analysis" element={<MarketAnalysis />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
