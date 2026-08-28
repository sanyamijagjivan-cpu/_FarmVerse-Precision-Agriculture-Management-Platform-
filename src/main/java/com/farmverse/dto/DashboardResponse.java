package com.farmverse.dto;

public class DashboardResponse {

    private long totalFarms;
    private String cropPredictionStatus;
    private String weatherStatus;
    private String marketStatus;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalFarms,
            String cropPredictionStatus,
            String weatherStatus,
            String marketStatus) {

        this.totalFarms = totalFarms;
        this.cropPredictionStatus = cropPredictionStatus;
        this.weatherStatus = weatherStatus;
        this.marketStatus = marketStatus;
    }

    public long getTotalFarms() {
        return totalFarms;
    }

    public void setTotalFarms(long totalFarms) {
        this.totalFarms = totalFarms;
    }

    public String getCropPredictionStatus() {
        return cropPredictionStatus;
    }

    public void setCropPredictionStatus(String cropPredictionStatus) {
        this.cropPredictionStatus = cropPredictionStatus;
    }

    public String getWeatherStatus() {
        return weatherStatus;
    }

    public void setWeatherStatus(String weatherStatus) {
        this.weatherStatus = weatherStatus;
    }

    public String getMarketStatus() {
        return marketStatus;
    }

    public void setMarketStatus(String marketStatus) {
        this.marketStatus = marketStatus;
    }
}