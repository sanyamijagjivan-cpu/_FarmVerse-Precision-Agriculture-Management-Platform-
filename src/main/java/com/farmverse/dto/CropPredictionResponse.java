package com.farmverse.dto;

public class CropPredictionResponse {

    private String recommendedCrop;
    private Double confidence;
    private String message;

    public CropPredictionResponse() {
    }

    public CropPredictionResponse(String recommendedCrop,
                                  Double confidence,
                                  String message) {
        this.recommendedCrop = recommendedCrop;
        this.confidence = confidence;
        this.message = message;
    }

    public String getRecommendedCrop() {
        return recommendedCrop;
    }

    public void setRecommendedCrop(String recommendedCrop) {
        this.recommendedCrop = recommendedCrop;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}