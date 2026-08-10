package com.farmverse.dto;

public class DiseaseDetectionResponse {

    private String cropName;
    private String disease;
    private int confidence;
    private String recommendation;

    public DiseaseDetectionResponse() {
    }

    public DiseaseDetectionResponse(
            String cropName,
            String disease,
            int confidence,
            String recommendation) {

        this.cropName = cropName;
        this.disease = disease;
        this.confidence = confidence;
        this.recommendation = recommendation;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public int getConfidence() {
        return confidence;
    }

    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}