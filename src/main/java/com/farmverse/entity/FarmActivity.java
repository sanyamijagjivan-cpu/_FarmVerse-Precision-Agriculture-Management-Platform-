package com.farmverse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "farm_activities")
public class FarmActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String activityName;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate activityDate;

    @ManyToOne
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    public FarmActivity() {
    }

    public FarmActivity(
            String activityName,
            String description,
            LocalDate activityDate,
            Farm farm) {

        this.activityName = activityName;
        this.description = description;
        this.activityDate = activityDate;
        this.farm = farm;
    }

    public Long getId() {
        return id;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public Farm getFarm() {
        return farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }
}