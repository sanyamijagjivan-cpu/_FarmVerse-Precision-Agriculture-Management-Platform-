package com.farmverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    private boolean notificationsEnabled = true;
    private boolean weatherAlerts = true;
    private boolean cropAlerts = true;
    private boolean marketAlerts = true;
    private boolean systemUpdates = true;

    private String language = "English";
    private String theme = "Light";

    public UserSettings() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean notificationsEnabled) {
        this.notificationsEnabled = notificationsEnabled;
    }

    public boolean isWeatherAlerts() {
        return weatherAlerts;
    }

    public void setWeatherAlerts(boolean weatherAlerts) {
        this.weatherAlerts = weatherAlerts;
    }

    public boolean isCropAlerts() {
        return cropAlerts;
    }

    public void setCropAlerts(boolean cropAlerts) {
        this.cropAlerts = cropAlerts;
    }

    public boolean isMarketAlerts() {
        return marketAlerts;
    }

    public void setMarketAlerts(boolean marketAlerts) {
        this.marketAlerts = marketAlerts;
    }

    public boolean isSystemUpdates() {
        return systemUpdates;
    }

    public void setSystemUpdates(boolean systemUpdates) {
        this.systemUpdates = systemUpdates;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}