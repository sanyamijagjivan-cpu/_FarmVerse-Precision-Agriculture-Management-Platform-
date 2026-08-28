
package com.farmverse.dto;

import java.util.List;

public class DiseaseDetectionResponse {

    private String cropName;
    private String disease;
    private int confidence;
    private String severity;
    private List<String> observations;
    private String recommendation;
    private String prevention;

    public DiseaseDetectionResponse() {
    }

    public DiseaseDetectionResponse(
            String cropName,
            String disease,
            int confidence,
            String severity,
            List<String> observations,
            String recommendation,
            String prevention) {

        this.cropName = cropName;
        this.disease = disease;
        this.confidence = confidence;
        this.severity = severity;
        this.observations = observations;
        this.recommendation = recommendation;
        this.prevention = prevention;
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

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public List<String> getObservations() {
        return observations;
    }

    public void setObservations(List<String> observations) {
        this.observations = observations;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public String getPrevention() {
        return prevention;
    }

    public void setPrevention(String prevention) {
        this.prevention = prevention;
    }
}

