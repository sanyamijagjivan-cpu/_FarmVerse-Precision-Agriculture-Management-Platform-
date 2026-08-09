package com.farmverse.controller;

import com.farmverse.dto.WeatherResponse;
import com.farmverse.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<WeatherResponse> getWeather(
            @RequestParam String city) {

        WeatherResponse response =
                weatherService.getWeather(city);

        return ResponseEntity.ok(response);
    }
}
