package com.farmverse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disease_scans")
public class DiseaseScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cropName;

    private String disease;

    private int confidence;

    @Column(length = 1000)
    private String recommendation;

    private LocalDateTime scannedAt;

    public DiseaseScan() {
    }

    public DiseaseScan(
            String cropName,
            String disease,
            int confidence,
            String recommendation) {

        this.cropName = cropName;
        this.disease = disease;
        this.confidence = confidence;
        this.recommendation = recommendation;
        this.scannedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public void setScannedAt(LocalDateTime scannedAt) {
        this.scannedAt = scannedAt;
    }
}