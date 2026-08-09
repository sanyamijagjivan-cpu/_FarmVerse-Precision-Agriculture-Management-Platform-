package com.farmverse.service;

import com.farmverse.dto.CropPredictionRequest;
import com.farmverse.dto.CropPredictionResponse;

import org.springframework.stereotype.Service;

@Service
public class CropPredictionService {

    public CropPredictionResponse predictCrop(
            CropPredictionRequest request) {

        String crop;
        double confidence;

        double nitrogen = request.getNitrogen();
        double phosphorus = request.getPhosphorus();
        double potassium = request.getPotassium();
        double temperature = request.getTemperature();
        double humidity = request.getHumidity();
        double rainfall = request.getRainfall();
        double ph = request.getPh();

        /*
         * Basic rule-based prediction.
         * This will be replaced with the actual ML model later.
         */

        if (rainfall > 150 &&
            temperature > 20 &&
            humidity > 60 &&
            ph >= 5.5 && ph <= 7.5) {

            crop = "Rice";
            confidence = 92.0;

        } else if (temperature > 25 &&
                   rainfall < 100 &&
                   humidity < 60) {

            crop = "Millet";
            confidence = 86.0;

        } else if (nitrogen > 80 &&
                   phosphorus > 40 &&
                   potassium > 40) {

            crop = "Maize";
            confidence = 84.0;

        } else if (ph >= 6.0 &&
                   ph <= 7.5 &&
                   rainfall >= 50 &&
                   rainfall <= 150) {

            crop = "Wheat";
            confidence = 80.0;

        } else {

            crop = "Groundnut";
            confidence = 75.0;
        }

        return new CropPredictionResponse(
                crop,
                confidence,
                "Crop prediction generated successfully"
        );
    }
}