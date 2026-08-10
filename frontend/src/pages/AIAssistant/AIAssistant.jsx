import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaRobot,
  FaPaperPlane,
  FaTrash,
  FaSeedling,
  FaTint,
  FaFlask,
  FaCloudSun,
  FaMicrophone,
  FaImage,
  FaLeaf,
  FaTimes,
} from "react-icons/fa";

import "./AIAssistant.css";

const quickQuestions = [
  {
    icon: <FaSeedling />,
    title: "Crop Recommendation",
    text: "Which crop should I grow?",
  },
  {
    icon: <FaLeaf />,
    title: "Soil Health",
    text: "How can I improve soil health?",
  },
  {
    icon: <FaTint />,
    title: "Irrigation",
    text: "When should I irrigate my crop?",
  },
  {
    icon: <FaFlask />,
    title: "Fertilizer",
    text: "Which fertilizer should I use?",
  },
];

const recommendations = [
  {
    icon: <FaSeedling />,
    title: "Crop Recommendation",
    text: "Get crop suggestions based on farm conditions.",
  },
  {
    icon: <FaTint />,
    title: "Irrigation Advice",
    text: "Get guidance based on soil moisture and weather.",
  },
  {
    icon: <FaFlask />,
    title: "Fertilizer Advice",
    text: "Understand fertilizer requirements for your crop.",
  },
  {
    icon: <FaCloudSun />,
    title: "Weather Guidance",
    text: "Use weather conditions to plan farm activities.",
  },
];

const demoResponses = {
  "Which crop should I grow?":
    "I can recommend suitable crops based on your soil type, season, water availability and local climate. Please provide these details for a better recommendation.",

  "How can I improve soil health?":
    "You can improve soil health by maintaining organic matter, using suitable fertilizers, practicing crop rotation and regularly monitoring soil nutrients and pH.",

  "When should I irrigate my crop?":
    "Irrigation should depend on soil moisture, crop growth stage and weather conditions. Avoid over-irrigation and monitor soil moisture regularly.",

  "Which fertilizer should I use?":
    "The correct fertilizer depends on your crop and soil nutrient levels. A soil test can help determine the appropriate NPK requirements.",
};

const AIAssistant = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your FarmVerse AI Farming Assistant. How can I help you with your farm today?",
    },
  ]);

  const sendMessage = (messageText = input) => {
    const text = messageText.trim();

    if (!text || isTyping) return;

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "user",
        text,
      },
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response =
        demoResponses[text] ||
        "I can help you with crop selection, soil health, irrigation, fertilizers, weather and general farming guidance. Please provide more details about your farm.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: response,
        },
      ]);

      setIsTyping(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "Chat cleared. How can I help you with your farm?",
      },
    ]);
    setSelectedImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage({
      name: file.name,
      url: imageUrl,
    });
  };

  const removeImage = () => {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="ai-page">
      {/* HEADER */}
      <header className="ai-header">
        <div className="ai-header-left">
          <button
            className="ai-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
          </button>

          <div className="ai-brand-icon">
            <FaRobot />
          </div>

          <div className="ai-title">
            <strong>AI Farming Assistant</strong>

            <span>
              <i></i>
              FarmVerse AI
            </span>
          </div>
        </div>

        <button className="ai-clear-btn" onClick={clearChat}>
          <FaTrash />
          <span>Clear Chat</span>
        </button>
      </header>

      <main className="ai-container">
        {/* INTRO */}
        <section className="ai-intro">
          <div className="ai-intro-icon">
            <FaRobot />
          </div>

          <div>
            <span>FARMVERSE AI</span>

            <h1>Your Smart Farming Assistant</h1>

            <p>
              Get intelligent guidance for crops, soil, irrigation, fertilizers
              and farm management.
            </p>
          </div>
        </section>

        {/* QUICK QUESTIONS */}
        <section className="ai-section">
          <div className="section-heading">
            <div>
              <h2>Quick Questions</h2>
              <p>Start with a common farming question</p>
            </div>
          </div>

          <div className="quick-grid">
            {quickQuestions.map((item) => (
              <button
                key={item.text}
                className="quick-card"
                onClick={() => sendMessage(item.text)}
              >
                <span className="quick-icon">{item.icon}</span>

                <span className="quick-content">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* CHAT */}
        <section className="ai-chat-card">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <FaRobot />
              </div>

              <div>
                <strong>FarmVerse AI</strong>

                <span>
                  <i></i>
                  Online
                </span>
              </div>
            </div>

            <button className="chat-clear-small" onClick={clearChat}>
              <FaTrash />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-row ${message.sender}`}>
                {message.sender === "ai" && (
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                )}

                <div className="message-bubble">{message.text}</div>
              </div>
            ))}

            {/* TYPING */}
            {isTyping && (
              <div className="message-row ai">
                <div className="message-avatar">
                  <FaRobot />
                </div>

                <div className="typing-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {selectedImage && (
            <div className="image-preview">
              <img src={selectedImage.url} alt="Selected crop" />

              <div className="image-info">
                <strong>{selectedImage.name}</strong>
                <span>Ready for AI analysis</span>
              </div>

              <button onClick={removeImage}>
                <FaTimes />
              </button>
            </div>
          )}

          {/* INPUT */}
          <div className="chat-input-area">
            <button
              className="input-tool"
              title="Upload crop image"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaImage />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

            <button
              className="input-tool"
              title="Voice input"
              onClick={() => setInput("Please describe my farm conditions.")}
            >
              <FaMicrophone />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something about farming..."
              rows="1"
            />

            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
            >
              <FaPaperPlane />
            </button>
          </div>

          <p className="ai-disclaimer">
            FarmVerse AI provides farming guidance. Verify important decisions
            with local agricultural experts.
          </p>
        </section>

        {/* AI RECOMMENDATIONS */}
        <section className="ai-section">
          <div className="section-heading">
            <div>
              <h2>AI Farming Tools</h2>
              <p>Explore smart recommendations for your farm</p>
            </div>
          </div>

          <div className="recommendation-grid">
            {recommendations.map((item) => (
              <div className="recommendation-card" key={item.title}>
                <div className="recommendation-icon">{item.icon}</div>

                <div>
                  <strong>{item.title}</strong>

                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="ai-bottom-note">
          <FaLeaf />

          <span>
            AI recommendations are for guidance and should be verified with
            reliable agricultural information.
          </span>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
