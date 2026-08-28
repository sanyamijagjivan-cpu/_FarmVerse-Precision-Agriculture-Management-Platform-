package com.farmverse.dto;

import java.util.List;

public class WeatherResponse {

    private String location;
    private double temperature;
    private int humidity;
    private double windSpeed;
    private String condition;

    private List<HourlyWeather> hourlyForecast;
    private List<DailyWeather> weeklyForecast;
    private List<WeatherRisk> risks;

    public WeatherResponse() {
    }

    public WeatherResponse(
            String location,
            double temperature,
            int humidity,
            double windSpeed,
            String condition,
            List<HourlyWeather> hourlyForecast,
            List<DailyWeather> weeklyForecast,
            List<WeatherRisk> risks) {

        this.location = location;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.condition = condition;
        this.hourlyForecast = hourlyForecast;
        this.weeklyForecast = weeklyForecast;
        this.risks = risks;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public List<HourlyWeather> getHourlyForecast() {
        return hourlyForecast;
    }

    public void setHourlyForecast(List<HourlyWeather> hourlyForecast) {
        this.hourlyForecast = hourlyForecast;
    }

    public List<DailyWeather> getWeeklyForecast() {
        return weeklyForecast;
    }

    public void setWeeklyForecast(List<DailyWeather> weeklyForecast) {
        this.weeklyForecast = weeklyForecast;
    }

    public List<WeatherRisk> getRisks() {
        return risks;
    }

    public void setRisks(List<WeatherRisk> risks) {
        this.risks = risks;
    }

    public static class HourlyWeather {

        private String time;
        private double temperature;
        private int rainProbability;
        private int weatherCode;

        public HourlyWeather() {
        }

        public HourlyWeather(
                String time,
                double temperature,
                int rainProbability,
                int weatherCode) {

            this.time = time;
            this.temperature = temperature;
            this.rainProbability = rainProbability;
            this.weatherCode = weatherCode;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public double getTemperature() {
            return temperature;
        }

        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }

        public int getRainProbability() {
            return rainProbability;
        }

        public void setRainProbability(int rainProbability) {
            this.rainProbability = rainProbability;
        }

        public int getWeatherCode() {
            return weatherCode;
        }

        public void setWeatherCode(int weatherCode) {
            this.weatherCode = weatherCode;
        }
    }

    public static class DailyWeather {

        private String day;
        private String date;
        private double high;
        private double low;
        private int rainProbability;
        private int weatherCode;
        private String condition;

        public DailyWeather() {
        }

        public DailyWeather(
                String day,
                String date,
                double high,
                double low,
                int rainProbability,
                int weatherCode,
                String condition) {

            this.day = day;
            this.date = date;
            this.high = high;
            this.low = low;
            this.rainProbability = rainProbability;
            this.weatherCode = weatherCode;
            this.condition = condition;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getHigh() {
            return high;
        }

        public void setHigh(double high) {
            this.high = high;
        }

        public double getLow() {
            return low;
        }

        public void setLow(double low) {
            this.low = low;
        }

        public int getRainProbability() {
            return rainProbability;
        }

        public void setRainProbability(int rainProbability) {
            this.rainProbability = rainProbability;
        }

        public int getWeatherCode() {
            return weatherCode;
        }

        public void setWeatherCode(int weatherCode) {
            this.weatherCode = weatherCode;
        }

        public String getCondition() {
            return condition;
        }

        public void setCondition(String condition) {
            this.condition = condition;
        }
    }

    public static class WeatherRisk {

        private String name;
        private String level;
        private int percentage;

        public WeatherRisk() {
        }

        public WeatherRisk(
                String name,
                String level,
                int percentage) {

                    

            this.name = name;
            this.level = level;
            this.percentage = percentage;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getLevel() {
            return level;
        }

        public void setLevel(String level) {
            this.level = level;
        }

        public int getPercentage() {
            return percentage;
        }

        public void setPercentage(int percentage) {
            this.percentage = percentage;
        }
    }
}