package com.farmverse.dto;

public class UserSettingsResponse {

    private boolean notificationsEnabled;
    private boolean weatherAlerts;
    private boolean cropAlerts;
    private boolean marketAlerts;
    private boolean systemUpdates;

    private String language;
    private String theme;

    public UserSettingsResponse() {
    }

    public UserSettingsResponse(
            boolean notificationsEnabled,
            boolean weatherAlerts,
            boolean cropAlerts,
            boolean marketAlerts,
            boolean systemUpdates,
            String language,
            String theme) {

        this.notificationsEnabled = notificationsEnabled;
        this.weatherAlerts = weatherAlerts;
        this.cropAlerts = cropAlerts;
        this.marketAlerts = marketAlerts;
        this.systemUpdates = systemUpdates;
        this.language = language;
        this.theme = theme;
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