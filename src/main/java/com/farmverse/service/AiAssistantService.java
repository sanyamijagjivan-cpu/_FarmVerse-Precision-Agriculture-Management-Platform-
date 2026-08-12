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

    public String askAssistant(String question) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text",
                                                "You are FarmVerse AI Assistant. "
                                                + "Help farmers with agriculture, crops, "
                                                + "soil, weather, irrigation and farming. "
                                                + "Give simple and practical answers. "
                                                + "Question: " + question)
                                )
                        )
                )
        );

        Map<?, ?> response = restClient.post()
                .uri(apiUrl)
                .header("x-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new RuntimeException("No response from Gemini");
        }

        try {
            List<?> candidates =
                    (List<?>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "Gemini did not return an answer.";
            }

            Map<?, ?> candidate =
                    (Map<?, ?>) candidates.get(0);

            Map<?, ?> content =
                    (Map<?, ?>) candidate.get("content");

            List<?> parts =
                    (List<?>) content.get("parts");

            Map<?, ?> part =
                    (Map<?, ?>) parts.get(0);

            return String.valueOf(part.get("text"));

        } catch (Exception e) {
            throw new RuntimeException(
                    "Unable to process Gemini response: "
                            + e.getMessage()
            );
        }
    }
}