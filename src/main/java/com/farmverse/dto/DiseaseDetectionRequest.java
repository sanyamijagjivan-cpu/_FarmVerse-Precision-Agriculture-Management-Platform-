package com.farmverse.dto;

public class DiseaseDetectionRequest {

    private String cropName;
    private String symptoms;

    public DiseaseDetectionRequest() {
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
}