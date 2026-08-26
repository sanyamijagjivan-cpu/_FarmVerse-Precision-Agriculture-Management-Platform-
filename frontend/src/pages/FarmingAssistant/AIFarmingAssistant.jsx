
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";

import "./AIFarmingAssistant.css";

function AIFarmingAssistant() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const messageInputRef = useRef(null);
  const automaticPromptHandled = useRef(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // SUGGESTED PROMPTS
  // =====================================================

  const suggestedPrompts = [
    "How can I improve my crop yield?",
    "My tomato leaves are turning yellow",
    "What fertilizer is suitable for rice?",
    "Will the weather affect my crops?",
  ];

  // =====================================================
  // RECENT CONVERSATIONS
  // Dynamic - stored in localStorage
  // =====================================================

  const [conversationHistory, setConversationHistory] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            "farmverse_ai_history"
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  // =====================================================
  // SAVE HISTORY
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "farmverse_ai_history",
      JSON.stringify(conversationHistory)
    );
  }, [conversationHistory]);

  // =====================================================
  // ADD QUESTION TO HISTORY
  // =====================================================

  const addToHistory = (question) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) return;

    setConversationHistory((previous) => {
      const filtered = previous.filter(
        (item) => item !== cleanQuestion
      );

      return [
        cleanQuestion,
        ...filtered,
      ].slice(0, 8);
    });
  };

  // =====================================================
  // SEND QUESTION TO BACKEND
  // =====================================================

  const sendMessageToBackend = async (question) => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:8080/api/ai/farming",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          `AI API failed with status ${response.status}`;

        try {
          const errorText =
            await response.text();

          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch {
          // Ignore parsing error
        }

        throw new Error(errorMessage);
      }

      return await response.text();

    } catch (error) {
      console.error(
        "AI Assistant API error:",
        error
      );

      return (
        "Sorry, I couldn't connect to the FarmVerse AI service. " +
        "Please check whether the backend is running and try again."
      );
    }
  };

  // =====================================================
  // PROCESS QUESTION
  // =====================================================

  const processQuestion = async (question) => {
    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion || isTyping) {
      return;
    }

    // Add to recent history
    addToHistory(trimmedQuestion);

    // USER MESSAGE
    const userMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: trimmedQuestion,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      const aiResponse =
        await sendMessageToBackend(
          trimmedQuestion
        );

      // AI MESSAGE
      const aiMessage = {
        id: `${Date.now()}-ai`,
        sender: "ai",
        text: aiResponse,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);

    } catch (error) {
      console.error(
        "AI processing error:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: `${Date.now()}-error`,
          sender: "ai",
          text:
            "Something went wrong while processing your question. Please try again.",
        },
      ]);

    } finally {
      setIsTyping(false);
    }
  };

  // =====================================================
  // SEND
  // =====================================================

  const handleSend = async (
    textOverride = null
  ) => {
    const currentMessage =
      textOverride !== null
        ? textOverride
        : message;

    await processQuestion(
      currentMessage
    );
  };

  // =====================================================
  // AUTOMATIC PROMPT
  // =====================================================

  useEffect(() => {
    if (automaticPromptHandled.current) {
      return;
    }

    const prompt =
      searchParams.get("prompt");

    if (!prompt || !prompt.trim()) {
      return;
    }

    automaticPromptHandled.current =
      true;

    const decodedPrompt =
      prompt.trim();

    setSearchParams(
      {},
      { replace: true }
    );

    processQuestion(
      decodedPrompt
    );
  }, [
    searchParams,
    setSearchParams,
  ]);

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  // =====================================================
  // NEW CHAT
  // =====================================================

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setIsTyping(false);
    setSidebarOpen(false);

    automaticPromptHandled.current =
      false;
  };

  // =====================================================
  // CLEAR CURRENT CHAT
  // =====================================================

  const clearChat = () => {
    setMessages([]);
    setMessage("");
    setIsTyping(false);
  };

  // =====================================================
  // CLEAR HISTORY
  // =====================================================

  const clearHistory = () => {
    setConversationHistory([]);

    localStorage.removeItem(
      "farmverse_ai_history"
    );
  };

  // =====================================================
  // OPEN RECENT QUESTION
  // =====================================================

  const openRecentQuestion = (question) => {
    setMessage(question);
    setSidebarOpen(false);

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 50);
  };

  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  // =====================================================
  // VOICE
  // =====================================================

  const handleVoiceInput = () => {
    setMessage(
      "Please help me analyze my farm conditions."
    );

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 50);
  };

  // =====================================================
  // ATTACHMENT
  // =====================================================

  const handleAttachment = () => {
    alert(
      "Image analysis can be connected to the AI backend next."
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="ai-farming-assistant">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`assistant-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-header">

          <div className="sidebar-brand">

            <div className="sidebar-logo">
              <FaLeaf />
            </div>

            <div>
              <strong>
                FarmVerse AI
              </strong>

              <span>
                Farming Assistant
              </span>
            </div>

          </div>

          <button
            className="mobile-close-button"
            onClick={() =>
              setSidebarOpen(false)
            }
            type="button"
          >
            <FaTimes />
          </button>

        </div>

        {/* NEW CHAT */}

        <button
          className="new-chat-button"
          onClick={startNewChat}
          type="button"
        >
          <FaPlus />

          <span>
            New conversation
          </span>

        </button>

        {/* RECENT */}

        <div className="history-section">

          <div className="history-title">

            <span>
              Recent
            </span>

            {conversationHistory.length >
              0 && (
              <button
                className="history-clear"
                onClick={
                  clearHistory
                }
                title="Clear history"
                type="button"
              >
                <FaTrash />
              </button>
            )}

          </div>

          {conversationHistory.length ===
          0 ? (

            <div className="empty-history">

              <FaRegClock />

              <p>
                Your recent questions
                will appear here.
              </p>

            </div>

          ) : (

            <div className="history-list">

              {conversationHistory.map(
                (item, index) => (

                  <button
                    className="history-item"
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() =>
                      openRecentQuestion(
                        item
                      )
                    }
                  >

                    <FaRegClock />

                    <span>
                      {item}
                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="sidebar-online">

            <span className="online-dot"></span>

            <div>
              <strong>
                AI Assistant
              </strong>

              <small>
                Online and ready
              </small>
            </div>

          </div>

          <button
            className="dashboard-link"
            onClick={
              goBackToDashboard
            }
            type="button"
          >
            <FaArrowLeft />

            <span>
              Back to FarmVerse
            </span>

          </button>

        </div>

      </aside>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        ></div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="assistant-main">

        {/* HEADER */}

        <header className="assistant-header">

          <div className="assistant-header-left">

            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
              type="button"
            >
              <FaBars />
            </button>

            <button
              className="assistant-back-button"
              onClick={
                goBackToDashboard
              }
              type="button"
              title="Back to Dashboard"
            >
              <FaArrowLeft />
            </button>

            <div className="assistant-header-info">

              <div className="assistant-header-icon">
                <FaRobot />
              </div>

              <div>

                <h1>
                  AI Farming Assistant
                </h1>

                <p>
                  Your intelligent farming companion
                </p>

              </div>

            </div>

          </div>

          <div className="assistant-header-right">

            <div className="assistant-status">

              <span className="status-dot"></span>

              <span>
                {isTyping
                  ? "Thinking..."
                  : "Ready"}
              </span>

            </div>

            <button
              className="assistant-clear-button"
              onClick={clearChat}
              type="button"
              title="Clear conversation"
            >
              <FaTrash />

              <span>
                Clear
              </span>

            </button>

          </div>

        </header>

        {/* =================================================
            CHAT
        ================================================= */}

        <main className="chat-container">

          {messages.length === 0 ? (

            <section className="welcome-screen">

              <div className="welcome-icon">

                <FaRobot />

              </div>

              <div className="welcome-badge">

                <span></span>

                FARMVERSE AI

              </div>

              <h2>

                How can I help
                <br />

                <strong>
                  with your farm?
                </strong>

              </h2>

              <p className="welcome-description">

                Ask questions naturally about
                crops, soil, diseases, weather,
                irrigation, fertilizers, market
                conditions, or farming practices.

              </p>

              {/* PROMPTS */}

              <div className="prompt-grid">

                {suggestedPrompts.map(
                  (prompt, index) => (

                    <button
                      key={index}
                      className="prompt-card"
                      onClick={() =>
                        handleSend(
                          prompt
                        )
                      }
                      type="button"
                      disabled={isTyping}
                    >

                      <span>
                        {prompt}
                      </span>

                      <FaArrowUp />

                    </button>

                  )
                )}

              </div>

            </section>

          ) : (

            <section className="conversation-area">

              {messages.map(
                (msg) => (

                  <div
                    key={msg.id}
                    className={`message-row ${msg.sender}`}
                  >

                    {msg.sender ===
                      "ai" && (

                      <div className="message-avatar">
                        <FaRobot />
                      </div>

                    )}

                    <div className="message-content">

                      <div className="message-name">

                        {msg.sender ===
                        "ai"
                          ? "FarmVerse AI"
                          : "You"}

                      </div>

                      <div className="message-bubble">

                        {msg.text}

                      </div>

                    </div>

                  </div>

                )
              )}

              {/* TYPING */}

              {isTyping && (

                <div className="message-row ai">

                  <div className="message-avatar">

                    <FaRobot />

                  </div>

                  <div className="message-content">

                    <div className="message-name">
                      FarmVerse AI
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

        {/* =================================================
            COMPOSER
        ================================================= */}

        <footer className="composer-section">

          <div className="composer-wrapper">

            <button
              className="composer-icon"
              type="button"
              title="Attach image or file"
              onClick={
                handleAttachment
              }
            >
              <FaPaperclip />
            </button>

            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask anything about your farm..."
              rows="1"
              disabled={isTyping}
            />

            <button
              className="composer-icon"
              type="button"
              title="Voice input"
              onClick={
                handleVoiceInput
              }
              disabled={isTyping}
            >
              <FaMicrophone />
            </button>

            <button
              className="send-button"
              type="button"
              onClick={() =>
                handleSend()
              }
              disabled={
                !message.trim() ||
                isTyping
              }
              title="Send message"
            >
              <FaArrowUp />
            </button>

          </div>

          <div className="composer-footer">

            <span>
              FarmVerse AI can make mistakes.
              Verify important farming decisions
              with reliable agricultural information.
            </span>

          </div>

        </footer>

      </div>

    </div>
  );
}

export default AIFarmingAssistant;
