package com.farmverse.controller;

import com.farmverse.dto.WeatherResponse;
import com.farmverse.service.WeatherService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(
            WeatherService weatherService) {

        this.weatherService = weatherService;
    }

    // =========================================================
    // GET WEATHER FOR USER'S FARM
    // =========================================================

    @GetMapping("/farm")
    public ResponseEntity<WeatherResponse> getFarmWeather(
            Authentication authentication) {

        String email =
                authentication.getName();

        WeatherResponse response =
                weatherService.getWeatherForFarm(
                        email
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET WEATHER FOR MANUALLY SELECTED CITY
    // =========================================================

    @GetMapping
    public ResponseEntity<WeatherResponse> getWeather(
            @RequestParam String city,
            Authentication authentication) {

        String email =
                authentication.getName();

        WeatherResponse response =
                weatherService.getWeather(
                        city,
                        email
                );

        return ResponseEntity.ok(response);
    }
}