package com.farmverse.service;

import com.farmverse.dto.DiseaseDetectionRequest;
import com.farmverse.dto.DiseaseDetectionResponse;

import org.springframework.stereotype.Service;

@Service
public class DiseaseDetectionService {

    public DiseaseDetectionResponse detectDisease(
            DiseaseDetectionRequest request) {

        String crop = request.getCropName();
        String symptoms = request.getSymptoms();

        if (crop == null || symptoms == null) {
            return new DiseaseDetectionResponse(
                    crop,
                    "Unable to detect",
                    0,
                    "Please provide crop name and symptoms."
            );
        }

        String text = symptoms.toLowerCase();

        // Tomato diseases
        if (crop.equalsIgnoreCase("Tomato")) {

            if (text.contains("brown spot")
                    || text.contains("brown spots")) {

                return new DiseaseDetectionResponse(
                        crop,
                        "Early Blight",
                        85,
                        "Remove affected leaves and apply an appropriate fungicide."
                );
            }

            if (text.contains("yellow leaf")
                    || text.contains("yellow leaves")) {

                return new DiseaseDetectionResponse(
                        crop,
                        "Possible Nutrient Deficiency",
                        75,
                        "Check soil nutrients and provide balanced fertilizer."
                );
            }
        }

        // General symptoms
        if (text.contains("white powder")
                || text.contains("powdery")) {

            return new DiseaseDetectionResponse(
                    crop,
                    "Powdery Mildew",
                    80,
                    "Improve air circulation and use an appropriate fungicide."
            );
        }

        if (text.contains("wilting")
                || text.contains("wilt")) {

            return new DiseaseDetectionResponse(
                    crop,
                    "Possible Wilt Disease",
                    70,
                    "Check soil moisture, root health and irrigation."
            );
        }

        return new DiseaseDetectionResponse(
                crop,
                "Disease Not Identified",
                50,
                "Please provide more detailed symptoms for better detection."
        );
    }
}