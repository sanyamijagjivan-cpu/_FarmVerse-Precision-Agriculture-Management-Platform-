
package com.farmverse.service;

import com.farmverse.dto.DiseaseDetectionResponse;
import com.farmverse.entity.DiseaseScan;
import com.farmverse.repository.DiseaseScanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class DiseaseDetectionService {

    @Autowired
    private DiseaseScanRepository diseaseScanRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient;

    public DiseaseDetectionService() {
        this.restClient = RestClient.create();
    }

    // =====================================================
    // DISEASE DETECTION
    // =====================================================

    public DiseaseDetectionResponse detectDisease(
            MultipartFile image,
            String cropName,
            String symptoms) {

        try {

            // =================================================
            // VALIDATION
            // =================================================

            if (image == null || image.isEmpty()) {

                return createErrorResponse(
                        cropName,
                        "Please upload a clear crop leaf image."
                );
            }

            if (cropName == null || cropName.trim().isEmpty()) {

                return createErrorResponse(
                        cropName,
                        "Please provide the crop name."
                );
            }

            if (symptoms == null || symptoms.trim().isEmpty()) {

                return createErrorResponse(
                        cropName,
                        "Please provide the observed symptoms."
                );
            }

            // =================================================
            // IMAGE → BASE64
            // =================================================

            byte[] imageBytes = image.getBytes();

            String base64Image =
                    Base64.getEncoder().encodeToString(imageBytes);

            String mimeType = image.getContentType();

            if (mimeType == null ||
                    !mimeType.startsWith("image/")) {

                return createErrorResponse(
                        cropName,
                        "Please upload a valid crop leaf image."
                );
            }

            // =================================================
            // GEMINI PROMPT
            // =================================================

            String prompt = """
                    You are FarmVerse AI Crop Disease Detection System.

                    Your task is to analyze the actual uploaded crop leaf image
                    together with the farmer's information.

                    Crop name:
                    %s

                    Farmer reported symptoms:
                    %s

                    IMPORTANT DIAGNOSTIC RULES:

                    1. Analyze the actual image carefully.

                    2. Do NOT diagnose a disease only from the written symptoms.

                    3. Compare visible patterns in the image with known
                       crop diseases and disorders.

                    4. Consider:
                       - leaf spots
                       - lesions
                       - concentric rings
                       - yellowing
                       - browning
                       - discoloration
                       - wilting
                       - holes
                       - fungal growth
                       - mold
                       - pest damage
                       - leaf deformation
                       - abnormal patterns

                    5. Consider the crop name when determining possible diseases.

                    6. If the image quality is poor, the crop cannot be identified,
                       or the visual evidence is insufficient, return:
                       "Unable to determine"

                    7. Do NOT invent a disease.

                    8. Confidence must represent how strongly the IMAGE supports
                       the diagnosis.

                    9. Use a confidence value from 0 to 100.

                    10. Severity must be one of:
                        Low
                        Moderate
                        High
                        Unknown

                    11. Observations must contain 2 to 5 specific visual
                        observations from the uploaded image.

                    12. Recommendation must contain practical farming actions.

                    13. Prevention must contain practical preventive measures.

                    14. Return ONLY valid JSON.

                    Use EXACTLY this structure:

                    {
                      "disease": "disease name or Unable to determine",
                      "confidence": 0,
                      "severity": "Low",
                      "observations": [
                        "specific visual observation 1",
                        "specific visual observation 2"
                      ],
                      "recommendation": "practical recommended action",
                      "prevention": "practical prevention advice"
                    }

                    Do not use markdown.
                    Do not use ```json.
                    Do not add explanations outside the JSON.
                    """.formatted(
                    cropName.trim(),
                    symptoms.trim()
            );

            // =================================================
            // GEMINI IMAGE REQUEST
            // =================================================

            Map<String, Object> imagePart =
                    Map.of(
                            "inline_data",
                            Map.of(
                                    "mime_type", mimeType,
                                    "data", base64Image
                            )
                    );

            Map<String, Object> textPart =
                    Map.of(
                            "text",
                            prompt
                    );

            Map<String, Object> requestBody =
                    Map.of(
                            "contents",
                            List.of(
                                    Map.of(
                                            "parts",
                                            List.of(
                                                    textPart,
                                                    imagePart
                                            )
                                    )
                            )
                    );

            // =================================================
            // CALL GEMINI
            // =================================================

            Map<?, ?> response =
                    restClient.post()
                            .uri(apiUrl)
                            .header("x-goog-api-key", apiKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(requestBody)
                            .retrieve()
                            .body(Map.class);

            if (response == null) {

                throw new RuntimeException(
                        "No response received from Gemini"
                );
            }

            // =================================================
            // EXTRACT GEMINI RESPONSE
            // =================================================

            List<?> candidates =
                    (List<?>) response.get("candidates");

            if (candidates == null ||
                    candidates.isEmpty()) {

                throw new RuntimeException(
                        "Gemini returned no candidates"
                );
            }

            Map<?, ?> candidate =
                    (Map<?, ?>) candidates.get(0);

            Map<?, ?> content =
                    (Map<?, ?>) candidate.get("content");

            if (content == null) {

                throw new RuntimeException(
                        "Gemini response content is missing"
                );
            }

            List<?> parts =
                    (List<?>) content.get("parts");

            if (parts == null || parts.isEmpty()) {

                throw new RuntimeException(
                        "Gemini returned no response parts"
                );
            }

            Map<?, ?> part =
                    (Map<?, ?>) parts.get(0);

            String aiText =
                    String.valueOf(part.get("text"));

            System.out.println(
                    "Gemini Disease Response:"
            );

            System.out.println(aiText);

            // =================================================
            // CLEAN JSON
            // =================================================

            String cleanJson =
                    aiText
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();

            // =================================================
            // PARSE JSON
            // =================================================

            com.fasterxml.jackson.databind.ObjectMapper mapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();

            Map<?, ?> result =
                    mapper.readValue(
                            cleanJson,
                            Map.class
                    );

            // =================================================
            // EXTRACT DISEASE
            // =================================================

            String disease =
                    getStringValue(
                            result,
                            "disease",
                            "Unable to determine"
                    );

            // =================================================
            // EXTRACT CONFIDENCE
            // =================================================

            int confidence =
                    parseConfidence(
                            result.get("confidence")
                    );

            // =================================================
            // EXTRACT SEVERITY
            // =================================================

            String severity =
                    getStringValue(
                            result,
                            "severity",
                            "Unknown"
                    );

            // =================================================
            // EXTRACT OBSERVATIONS
            // =================================================

            List<String> observations =
                    extractObservations(
                            result.get("observations")
                    );

            // =================================================
            // EXTRACT RECOMMENDATION
            // =================================================

            String recommendation =
                    getStringValue(
                            result,
                            "recommendation",
                            "Please consult a local agricultural expert if symptoms continue."
                    );

            // =================================================
            // EXTRACT PREVENTION
            // =================================================

            String prevention =
                    getStringValue(
                            result,
                            "prevention",
                            "Maintain good crop hygiene and monitor the plant regularly."
                    );

            // =================================================
            // BUILD RESPONSE
            // =================================================

            DiseaseDetectionResponse finalResponse =
                    new DiseaseDetectionResponse(
                            cropName,
                            disease,
                            confidence,
                            severity,
                            observations,
                            recommendation,
                            prevention
                    );

            // =================================================
            // SAVE HISTORY
            // =================================================

            saveScan(finalResponse);

            return finalResponse;

        } catch (Exception e) {

            e.printStackTrace();

            return createErrorResponse(
                    cropName,
                    "The image could not be reliably analyzed. Please upload a clear image of the affected leaf and try again."
            );
        }
    }

    // =====================================================
    // CREATE ERROR RESPONSE
    // =====================================================

    private DiseaseDetectionResponse createErrorResponse(
            String cropName,
            String message) {

        return new DiseaseDetectionResponse(
                cropName,
                "Unable to determine",
                0,
                "Unknown",
                new ArrayList<>(),
                message,
                "Maintain good crop hygiene and consult a local agricultural expert if the problem continues."
        );
    }

    // =====================================================
    // GET STRING VALUE
    // =====================================================

    private String getStringValue(
            Map<?, ?> result,
            String key,
            String defaultValue) {

        Object value = result.get(key);

        if (value == null) {
            return defaultValue;
        }

        String text =
                String.valueOf(value).trim();

        if (text.isEmpty() ||
                text.equalsIgnoreCase("null")) {

            return defaultValue;
        }

        return text;
    }

    // =====================================================
    // CONFIDENCE PARSER
    // =====================================================

    private int parseConfidence(Object value) {

        try {

            if (value == null) {
                return 0;
            }

            int confidence =
                    Integer.parseInt(
                            String.valueOf(value)
                    );

            return Math.max(
                    0,
                    Math.min(100, confidence)
            );

        } catch (Exception e) {

            return 0;
        }
    }

    // =====================================================
    // OBSERVATIONS PARSER
    // =====================================================

    private List<String> extractObservations(
            Object value) {

        List<String> observations =
                new ArrayList<>();

        if (value instanceof List<?>) {

            for (Object item : (List<?>) value) {

                if (item != null) {

                    String observation =
                            String.valueOf(item).trim();

                    if (!observation.isEmpty()) {

                        observations.add(
                                observation
                        );
                    }
                }
            }
        }

        return observations;
    }

    // =====================================================
    // SAVE SCAN
    // =====================================================

    private void saveScan(
            DiseaseDetectionResponse response) {

        String historyRecommendation =
                response.getRecommendation();

        DiseaseScan scan =
                new DiseaseScan(
                        response.getCropName(),
                        response.getDisease(),
                        response.getConfidence(),
                        historyRecommendation
                );

        diseaseScanRepository.save(scan);
    }

    // =====================================================
    // HISTORY
    // =====================================================

    public List<DiseaseScan> getRecentScans() {

        return diseaseScanRepository
                .findTop10ByOrderByScannedAtDesc();
    }
}

