
import "./AIFarmingAssistant.css";
import { useState } from "react";

import {
  FaRobot,
  FaPaperclip,
  FaMicrophone,
  FaArrowUp,
  FaLeaf,
  FaPlus,
  FaBars,
  FaTimes,
  FaRegClock,
  FaMapMarkerAlt,
  FaSeedling,
  FaChevronDown,
} from "react-icons/fa";

function AIFarmingAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const suggestedPrompts = [
    "How can I improve my crop yield?",
    "My tomato leaves are turning yellow",
    "What fertilizer is suitable for rice?",
    "Will the weather affect my crops?",
  ];

  const conversationHistory = [
    "Tomato crop health",
    "Rice fertilizer advice",
    "Irrigation planning",
    "Crop yield improvement",
  ];

  const getAIResponse = (text) => {
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("tomato") ||
      lowerText.includes("yellow") ||
      lowerText.includes("disease")
    ) {
      return {
        text: "Yellowing tomato leaves can have several causes, including nutrient deficiency, excess watering, root problems, or disease. I can help narrow it down. If you have a photo of the affected leaves, upload it and I can examine the visible symptoms.",
        type: "image",
      };
    }

    if (
      lowerText.includes("fertilizer") ||
      lowerText.includes("rice")
    ) {
      return {
        text: "I can help you choose a suitable fertilizer strategy for your rice crop. The recommendation depends on the crop age, soil condition, variety, and previous fertilizer application. How old is your rice crop?",
        type: "normal",
      };
    }

    if (
      lowerText.includes("weather") ||
      lowerText.includes("rain") ||
      lowerText.includes("irrigation")
    ) {
      return {
        text: "Weather conditions can significantly affect irrigation, spraying, and crop health. Once weather data and your farm location are connected, I can use those details to provide more specific recommendations.",
        type: "normal",
      };
    }

    if (
      lowerText.includes("market") ||
      lowerText.includes("price")
    ) {
      return {
        text: "I can help you understand crop prices and market trends. Your team's market data service can later be connected here so the assistant can provide recommendations based on current market information.",
        type: "normal",
      };
    }

    return {
      text: "I can help you with crop health, soil management, irrigation, weather, fertilizers, farming practices, and market-related questions. Tell me what is happening on your farm, and I'll help you work through it.",
      type: "normal",
    };
  };

  const handleSend = (textOverride = null) => {
    const currentMessage =
      textOverride !== null ? textOverride : message;

    const trimmedMessage = currentMessage.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsTyping(true);

    const response = getAIResponse(trimmedMessage);

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.text,
        type: response.type,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);

      setIsTyping(false);
    }, 900);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt) => {
    handleSend(prompt);
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setIsTyping(false);
  };

  return (
    <div className="ai-farming-assistant">
      <aside
        className={`assistant-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <FaLeaf />
            </div>
            <span>Farming AI</span>
          </div>

          <button
            className="mobile-close-button"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        <button
          className="new-chat-button"
          onClick={startNewChat}
          type="button"
        >
          <FaPlus />
          <span>New conversation</span>
        </button>

        <div className="history-section">
          <div className="history-title">
            <span>Recent conversations</span>
          </div>

          <div className="history-list">
            {conversationHistory.map((item, index) => (
              <button
                className="history-item"
                key={index}
                type="button"
              >
                <FaRegClock />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="context-mini">
            <div className="context-mini-header">
              <span>Farm context</span>
              <FaChevronDown />
            </div>

            <div className="context-mini-item">
              <FaSeedling />
              <div>
                <span>Crop</span>
                <strong>Not selected</strong>
              </div>
            </div>

            <div className="context-mini-item">
              <FaMapMarkerAlt />
              <div>
                <span>Location</span>
                <strong>Not selected</strong>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="assistant-main">
        <header className="assistant-header">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <FaBars />
          </button>

          <div className="assistant-header-info">
            <div className="assistant-header-icon">
              <FaRobot />
            </div>

            <div>
              <h1>AI Farming Assistant</h1>
              <p>Your intelligent farming companion</p>
            </div>
          </div>

          <div className="assistant-status">
            <span className="status-dot"></span>
            <span>Ready</span>
          </div>
        </header>

        <main className="chat-container">
          {messages.length === 0 ? (
            <section className="welcome-screen">
              <div className="welcome-icon">
                <FaRobot />
              </div>

              <div className="welcome-badge">
                <span></span>
                AI Farming Assistant
              </div>

              <h2>
                How can I help
                <br />
                with your farm?
              </h2>

              <p className="welcome-description">
                Ask questions naturally about your crops,
                soil, diseases, weather, irrigation,
                fertilizers, or farming practices.
              </p>

              <div className="prompt-grid">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="prompt-card"
                    onClick={() => handlePromptClick(prompt)}
                    type="button"
                  >
                    <span>{prompt}</span>
                    <FaArrowUp />
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="conversation-area">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-row ${msg.sender}`}
                >
                  {msg.sender === "ai" && (
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                  )}

                  <div className="message-content">
                    <div className="message-name">
                      {msg.sender === "ai"
                        ? "AI Farming Assistant"
                        : "You"}
                    </div>

                    <div className="message-bubble">
                      {msg.text}
                    </div>

                    {msg.sender === "ai" &&
                      msg.type === "image" && (
                        <button
                          className="upload-suggestion"
                          type="button"
                        >
                          <FaPaperclip />
                          Upload crop image
                        </button>
                      )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message-row ai">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>

                  <div className="message-content">
                    <div className="message-name">
                      AI Farming Assistant
                    </div>

                    <div className="typing-bubble">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="composer-section">
          <div className="composer-wrapper">
            <button
              className="composer-icon"
              type="button"
              title="Attach image or file"
            >
              <FaPaperclip />
            </button>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your farm..."
              rows="1"
            />

            <button
              className="composer-icon"
              type="button"
              title="Voice input"
            >
              <FaMicrophone />
            </button>

            <button
              className="send-button"
              type="button"
              onClick={() => handleSend()}
              disabled={!message.trim() || isTyping}
              title="Send message"
            >
              <FaArrowUp />
            </button>
          </div>

          <div className="composer-footer">
            <span>
              AI Farming Assistant can make mistakes.
              Verify important decisions.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AIFarmingAssistant;

