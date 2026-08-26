import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaRobot,
  FaPaperPlane,
  FaTrash,
  FaMicrophone,
  FaPaperclip,
  FaCode,
  FaGraduationCap,
  FaBriefcase,
  FaLightbulb,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

import "./AIAssistant.css";

const quickPrompts = [
  {
    icon: <FaCode />,
    title: "Coding",
    text: "Help me understand Java programming",
  },
  {
    icon: <FaGraduationCap />,
    title: "Learning",
    text: "Explain this topic in a simple way",
  },
  {
    icon: <FaBriefcase />,
    title: "Career",
    text: "Give me some interview preparation tips",
  },
  {
    icon: <FaLightbulb />,
    title: "Ideas",
    text: "Give me some creative project ideas",
  },
];

const AIAssistant = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || isTyping) return;

    const userMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:8080/api/ai/ask",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            question: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `AI API failed with status ${response.status}`
        );
      }

      const aiResponse = await response.text();

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-ai`,
          sender: "ai",
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("AI Assistant error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          sender: "ai",
          text:
            "Sorry, I couldn't connect to the AI service right now. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // =====================================================
  // QUICK PROMPT
  // =====================================================

  const handleQuickPrompt = (text) => {
    sendMessage(text);
  };

  // =====================================================
  // NEW CHAT
  // =====================================================

  const newChat = () => {
    setMessages([]);
    setInput("");
    setSelectedFile(null);
  };

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setSelectedFile(null);
  };

  // =====================================================
  // FILE
  // =====================================================

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // VOICE
  // =====================================================

  const handleVoice = () => {
    setInput("Can you help me with ");
    inputRef.current?.focus();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="normal-ai-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="normal-ai-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-brand-icon">
            <FaRobot />
          </div>

          <div>
            <strong>FarmVerse AI</strong>
            <span>Personal Assistant</span>
          </div>

        </div>

        <button
          className="new-chat-btn"
          onClick={newChat}
        >
          <FaPlus />
          <span>New chat</span>
        </button>

        <div className="sidebar-label">
          AI Assistant
        </div>

        <div className="sidebar-info">

          <div className="sidebar-info-icon">
            <FaLightbulb />
          </div>

          <div>
            <strong>Ask anything</strong>

            <p>
              Get help with learning,
              coding, career and everyday
              questions.
            </p>
          </div>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-status">
            <span></span>
            AI is online
          </div>

          <button
            className="sidebar-dashboard-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FaArrowLeft />
            Back to FarmVerse
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="normal-ai-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="normal-ai-header">

          <div className="header-left">

            <button
              className="header-back-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <FaArrowLeft />
            </button>

            <div className="header-ai-icon">
              <FaRobot />
            </div>

            <div className="header-text">

              <strong>
                AI Assistant
              </strong>

              <span>
                <i></i>
                Online
              </span>

            </div>

          </div>

          <button
            className="header-clear-btn"
            onClick={clearChat}
          >
            <FaTrash />
            <span>Clear</span>
          </button>

        </header>

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <div className="normal-ai-chat">

          {messages.length === 0 ? (

            /* =================================================
                WELCOME
            ================================================= */

            <section className="normal-ai-welcome">

              <div className="welcome-ai-icon">
                <div className="welcome-glow"></div>
                <FaRobot />
              </div>

              <div className="welcome-tag">
                <span></span>
                FARMVERSE AI
              </div>

              <h1>
                How can I help you
                <br />
                <strong>today?</strong>
              </h1>

              <p>
                I'm your friendly AI assistant.
                Ask me anything about learning,
                coding, career, ideas, or everyday
                questions.
              </p>

              {/* QUICK CARDS */}

              <div className="quick-prompts">

                {quickPrompts.map((item) => (

                  <button
                    key={item.title}
                    className="modern-prompt-card"
                    onClick={() =>
                      handleQuickPrompt(item.text)
                    }
                  >

                    <div className="prompt-icon">
                      {item.icon}
                    </div>

                    <div className="prompt-text">
                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.text}
                      </span>
                    </div>

                    <div className="prompt-arrow">
                      ↗
                    </div>

                  </button>

                ))}

              </div>

            </section>

          ) : (

            /* =================================================
                MESSAGES
            ================================================= */

            <section className="normal-ai-messages">

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className={`normal-message ${msg.sender}`}
                >

                  {msg.sender === "ai" && (

                    <div className="normal-message-avatar">
                      <FaRobot />
                    </div>

                  )}

                  <div className="normal-message-content">

                    <span className="normal-message-name">

                      {msg.sender === "ai"
                        ? "FarmVerse AI"
                        : "You"}

                    </span>

                    <div className="normal-message-bubble">
                      {msg.text}
                    </div>

                  </div>

                </div>

              ))}

              {isTyping && (

                <div className="normal-message ai">

                  <div className="normal-message-avatar">
                    <FaRobot />
                  </div>

                  <div className="normal-message-content">

                    <span className="normal-message-name">
                      FarmVerse AI
                    </span>

                    <div className="ai-typing">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                </div>

              )}

            </section>

          )}

        </div>

        {/* =================================================
            COMPOSER
        ================================================= */}

        <footer className="normal-ai-composer">

          {selectedFile && (

            <div className="attached-file">

              <div>
                <FaPaperclip />
                <span>
                  {selectedFile.name}
                </span>
              </div>

              <button onClick={removeFile}>
                <FaTimes />
              </button>

            </div>

          )}

          <div className="composer-box">

            <button
              className="composer-tool"
              onClick={() =>
                fileInputRef.current?.click()
              }
              title="Attach file"
            >
              <FaPaperclip />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFile}
            />

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message FarmVerse AI..."
              rows="1"
              disabled={isTyping}
            />

            <button
              className="composer-tool microphone"
              onClick={handleVoice}
              disabled={isTyping}
              title="Voice input"
            >
              <FaMicrophone />
            </button>

            <button
              className="modern-send-btn"
              onClick={() => sendMessage()}
              disabled={
                !input.trim() ||
                isTyping
              }
            >
              <FaPaperPlane />
            </button>

          </div>

          <p className="composer-note">
            FarmVerse AI can make mistakes.
            Check important information when needed.
          </p>

        </footer>

      </main>

    </div>
  );
};

export default AIAssistant;