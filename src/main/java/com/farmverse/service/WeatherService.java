package com.farmverse.service;

import com.farmverse.dto.WeatherResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class WeatherService {

    private final RestClient restClient;

    public WeatherService() {
        this.restClient = RestClient.create();
    }

    public WeatherResponse getWeather(String city) {

        String geocodingUrl =
                "https://geocoding-api.open-meteo.com/v1/search"
                + "?name=" + city
                + "&count=1"
                + "&language=en"
                + "&format=json";

        Map<String, Object> locationResponse = restClient.get()
                .uri(geocodingUrl)
                .retrieve()
                .body(Map.class);

        if (locationResponse == null
                || !locationResponse.containsKey("results")) {
            throw new RuntimeException("City not found");
        }

        Object resultsObject = locationResponse.get("results");

        if (!(resultsObject instanceof java.util.List<?> results)
                || results.isEmpty()) {
            throw new RuntimeException("City not found");
        }

        Map<?, ?> location = (Map<?, ?>) results.get(0);

        double latitude =
                ((Number) location.get("latitude")).doubleValue();

        double longitude =
                ((Number) location.get("longitude")).doubleValue();

        String cityName =
                String.valueOf(location.get("name"));

        String weatherUrl =
                "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
                + "&temperature_unit=celsius"
                + "&wind_speed_unit=kmh";

        Map<String, Object> weatherResponse = restClient.get()
                .uri(weatherUrl)
                .retrieve()
                .body(Map.class);

        if (weatherResponse == null
                || !weatherResponse.containsKey("current")) {
            throw new RuntimeException(
                    "Unable to fetch weather data");
        }

        Map<?, ?> current =
                (Map<?, ?>) weatherResponse.get("current");

        double temperature =
                ((Number) current.get("temperature_2m")).doubleValue();

        int humidity =
                ((Number) current.get("relative_humidity_2m")).intValue();

        double windSpeed =
                ((Number) current.get("wind_speed_10m")).doubleValue();

        int weatherCode =
                ((Number) current.get("weather_code")).intValue();

        String condition =
                getWeatherCondition(weatherCode);

        return new WeatherResponse(
                cityName,
                temperature,
                humidity,
                windSpeed,
                condition
        );
    }

    private String getWeatherCondition(int code) {

        if (code == 0) {
            return "Clear sky";
        }

        if (code == 1 || code == 2 || code == 3) {
            return "Cloudy";
        }

        if (code == 45 || code == 48) {
            return "Fog";
        }

        if (code >= 51 && code <= 57) {
            return "Drizzle";
        }

        if (code >= 61 && code <= 67) {
            return "Rain";
        }

        if (code >= 71 && code <= 77) {
            return "Snow";
        }

        if (code >= 80 && code <= 82) {
            return "Rain showers";
        }

        if (code >= 85 && code <= 86) {
            return "Snow showers";
        }

        if (code >= 95 && code <= 99) {
            return "Thunderstorm";
        }

        return "Unknown";
    }
}
