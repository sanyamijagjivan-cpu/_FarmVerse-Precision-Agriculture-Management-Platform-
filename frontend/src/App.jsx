import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Splash from "./pages/Auth/Splash";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AIFarmingAssistant from "./pages/FarmingAssistant/AIFarmingAssistant";
import DiseaseDetection from "./pages/DiseaseDetection/DiseaseDetection";
import Weather from "./pages/Weather/Weather";
import MarketAnalysis from "./pages/MarketAnalysis/MarketAnalysis";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/ai-farming-assistant"
          element={<AIFarmingAssistant />}
        />
        <Route path="/disease-detection" element={<DiseaseDetection />}/>
<Route path="/weather" element={<Weather />} />
      <Route path="/market-analysis"element={<MarketAnalysis />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;