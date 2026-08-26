package com.farmverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient;

    public AiAssistantService() {
        this.restClient = RestClient.create();
    }

    // =====================================================
    // NORMAL AI ASSISTANT
    // General friendly AI
    // =====================================================

    public String askGeneralAssistant(String question) {

        String prompt =
                "You are FarmVerse AI, a friendly general-purpose AI assistant. " +
                "Talk naturally, warmly and casually like a helpful human assistant. " +
                "You can discuss programming, technology, education, career, interviews, " +
                "general knowledge, daily life, entertainment, hobbies, travel, productivity, " +
                "and agriculture. " +
                "Do not restrict yourself to farming. " +
                "If the user is casually chatting, respond naturally. " +
                "Keep answers clear, useful and easy to understand. " +
                "Do not repeatedly mention FarmVerse unless relevant. " +
                "\n\nUser: " + question;

        return callGemini(prompt);
    }

    // =====================================================
    // FARMING AI ASSISTANT
    // Agriculture only
    // =====================================================

    public String askFarmingAssistant(String question) {

        String prompt =
                "You are FarmVerse AI Farming Assistant. " +
                "You are an agriculture-focused assistant. " +
                "Answer questions about crops, soil, plant diseases, fertilizers, " +
                "irrigation, weather effects on crops, pests, farm management, " +
                "crop yield, agricultural practices and farming. " +
                "Give simple, practical and friendly answers. " +
                "Use clear explanations suitable for farmers and students. " +
                "If the question is completely unrelated to agriculture, politely say " +
                "that you are specifically designed for farming-related questions " +
                "and invite the user to ask an agriculture question. " +
                "\n\nUser: " + question;

        return callGemini(prompt);
    }

    // =====================================================
    // COMMON GEMINI METHOD
    // =====================================================

    private String callGemini(String prompt) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of(
                                                "text",
                                                prompt
                                        )
                                )
                        )
                )
        );

        try {

            Map<?, ?> response = restClient.post()
                    .uri(apiUrl)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                return "The AI service did not return a response. Please try again.";
            }

            return extractGeminiText(response);

        } catch (Exception e) {

            System.err.println(
                    "Gemini API error: " + e.getMessage()
            );

            return getFriendlyErrorMessage(e);
        }
    }

    // =====================================================
    // EXTRACT GEMINI RESPONSE
    // =====================================================

    private String extractGeminiText(Map<?, ?> response) {

        try {

            List<?> candidates =
                    (List<?>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {

                return "The AI could not generate an answer right now. Please try again.";
            }

            Map<?, ?> candidate =
                    (Map<?, ?>) candidates.get(0);

            Map<?, ?> content =
                    (Map<?, ?>) candidate.get("content");

            if (content == null) {

                return "The AI returned an incomplete response. Please try again.";
            }

            List<?> parts =
                    (List<?>) content.get("parts");

            if (parts == null || parts.isEmpty()) {

                return "The AI returned an empty response. Please try again.";
            }

            Map<?, ?> part =
                    (Map<?, ?>) parts.get(0);

            Object text = part.get("text");

            if (text == null) {

                return "The AI could not generate text for this request.";
            }

            return String.valueOf(text);

        } catch (Exception e) {

            System.err.println(
                    "Gemini response parsing error: "
                            + e.getMessage()
            );

            return "I received an unexpected response from the AI. Please try again.";
        }
    }

    // =====================================================
    // FRIENDLY ERROR HANDLING
    // =====================================================

    private String getFriendlyErrorMessage(Exception e) {

        String error = e.getMessage();

        if (error == null) {

            return "The AI service is temporarily unavailable. Please try again.";
        }

        String lowerError =
                error.toLowerCase();

        // Gemini overloaded / unavailable

        if (lowerError.contains("503")
                || lowerError.contains("unavailable")
                || lowerError.contains("high demand")
                || lowerError.contains("overloaded")) {

            return
                    "The AI service is temporarily busy. " +
                    "Please wait a few seconds and try again.";
        }

        // Timeout

        if (lowerError.contains("timeout")
                || lowerError.contains("timed out")) {

            return
                    "The AI took too long to respond. " +
                    "Please try again.";
        }

        // API key / authentication

        if (lowerError.contains("401")
                || lowerError.contains("403")
                || lowerError.contains("api key")
                || lowerError.contains("unauthorized")) {

            return
                    "The AI service authentication failed. " +
                    "Please check the Gemini API configuration.";
        }

        // Rate limit

        if (lowerError.contains("429")
                || lowerError.contains("too many requests")
                || lowerError.contains("rate limit")) {

            return
                    "The AI service is receiving too many requests right now. " +
                    "Please wait a moment and try again.";
        }

        // Generic error

        return
                "Sorry, I couldn't get a response from the AI right now. " +
                "Please try again in a moment.";
    }
}