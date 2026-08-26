package com.farmverse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "soil_health")
public class SoilHealth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String soilType;

    private Double phLevel;

    private Double nitrogen;

    private Double phosphorus;

    private Double potassium;

    private Double organicMatter;

    private Double moisture;

    private LocalDate testedDate;

    @ManyToOne
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    public SoilHealth() {
    }

    public Long getId() {
        return id;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public Double getPhLevel() {
        return phLevel;
    }

    public void setPhLevel(Double phLevel) {
        this.phLevel = phLevel;
    }

    public Double getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(Double nitrogen) {
        this.nitrogen = nitrogen;
    }

    public Double getPhosphorus() {
        return phosphorus;
    }

    public void setPhosphorus(Double phosphorus) {
        this.phosphorus = phosphorus;
    }

    public Double getPotassium() {
        return potassium;
    }

    public void setPotassium(Double potassium) {
        this.potassium = potassium;
    }

    public Double getOrganicMatter() {
        return organicMatter;
    }

    public void setOrganicMatter(Double organicMatter) {
        this.organicMatter = organicMatter;
    }

    public Double getMoisture() {
        return moisture;
    }

    public void setMoisture(Double moisture) {
        this.moisture = moisture;
    }

    public LocalDate getTestedDate() {
        return testedDate;
    }

    public void setTestedDate(LocalDate testedDate) {
        this.testedDate = testedDate;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }
}