package com.farmverse.service;

import com.farmverse.dto.WeatherResponse;
import com.farmverse.entity.Farm;
import com.farmverse.entity.User;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    private final RestClient restClient;

    public WeatherService() {
        this.restClient = RestClient.create();
    }

    // =========================================================
    // GET WEATHER USING USER'S FARM LOCATION
    // =========================================================

    public WeatherResponse getWeatherForFarm(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Farm> farms =
                farmRepository.findByUser(user);

        if (farms == null || farms.isEmpty()) {
            throw new RuntimeException(
                    "No farm found for this user");
        }

        /*
         * Currently using the first farm.
         * If a user has multiple farms, this can
         * later be changed to select a particular farm.
         */
        Farm farm = farms.get(0);

        String farmLocation = farm.getLocation();

        if (farmLocation == null ||
                farmLocation.trim().isEmpty()) {

            throw new RuntimeException(
                    "Farm location is not available");
        }

        System.out.println("==========================================");
        System.out.println("FARM WEATHER REQUEST");
        System.out.println("User: " + email);
        System.out.println("Farm: " + farm.getFarmName());
        System.out.println("Farm Location: " + farmLocation);
        System.out.println("==========================================");

        return getWeather(
                farmLocation,
                email
        );
    }

    // =========================================================
    // MAIN WEATHER METHOD
    // =========================================================

    public WeatherResponse getWeather(
            String city,
            String email) {

        if (city == null ||
                city.trim().isEmpty()) {

            throw new RuntimeException(
                    "Location is required");
        }

        // =====================================================
        // STEP 1: GEOCODING
        // =====================================================

        String encodedCity =
                city.trim().replace(" ", "%20");

        String geocodingUrl =
                "https://geocoding-api.open-meteo.com/v1/search"
                        + "?name=" + encodedCity
                        + "&count=1"
                        + "&language=en"
                        + "&format=json";

        Map<String, Object> locationResponse =
                restClient.get()
                        .uri(geocodingUrl)
                        .retrieve()
                        .body(Map.class);

        if (locationResponse == null ||
                !locationResponse.containsKey("results")) {

            throw new RuntimeException(
                    "Location not found: " + city);
        }

        Object resultsObject =
                locationResponse.get("results");

        if (!(resultsObject instanceof List<?> results) ||
                results.isEmpty()) {

            throw new RuntimeException(
                    "Location not found: " + city);
        }

        Map<?, ?> location =
                (Map<?, ?>) results.get(0);

        if (location.get("latitude") == null ||
                location.get("longitude") == null) {

            throw new RuntimeException(
                    "Coordinates not found for: " + city);
        }

        double latitude =
                ((Number) location.get("latitude"))
                        .doubleValue();

        double longitude =
                ((Number) location.get("longitude"))
                        .doubleValue();

        String cityName =
                String.valueOf(location.get("name"));

        String admin1 =
                location.get("admin1") != null
                        ? String.valueOf(location.get("admin1"))
                        : "";

        String country =
                location.get("country") != null
                        ? String.valueOf(location.get("country"))
                        : "";

        System.out.println("Geocoded Location: " + cityName);
        System.out.println("State/Region: " + admin1);
        System.out.println("Country: " + country);
        System.out.println("Latitude: " + latitude);
        System.out.println("Longitude: " + longitude);

        // =====================================================
        // STEP 2: WEATHER API
        // =====================================================

        String weatherUrl =
                "https://api.open-meteo.com/v1/forecast"
                        + "?latitude=" + latitude
                        + "&longitude=" + longitude

                        + "&current="
                        + "temperature_2m,"
                        + "relative_humidity_2m,"
                        + "wind_speed_10m,"
                        + "weather_code"

                        + "&hourly="
                        + "temperature_2m,"
                        + "precipitation_probability,"
                        + "weather_code"

                        + "&daily="
                        + "temperature_2m_max,"
                        + "temperature_2m_min,"
                        + "precipitation_probability_max,"
                        + "weather_code"

                        + "&forecast_days=7"

                        + "&timezone=auto"

                        + "&temperature_unit=celsius"

                        + "&wind_speed_unit=kmh";

        Map<String, Object> weatherResponse =
                restClient.get()
                        .uri(weatherUrl)
                        .retrieve()
                        .body(Map.class);

        if (weatherResponse == null) {

            throw new RuntimeException(
                    "Unable to fetch weather data");
        }

        // =====================================================
        // STEP 3: CURRENT WEATHER
        // =====================================================

        Map<?, ?> current =
                (Map<?, ?>) weatherResponse.get("current");

        if (current == null) {

            throw new RuntimeException(
                    "Current weather data unavailable");
        }

        double temperature =
                ((Number) current.get("temperature_2m"))
                        .doubleValue();

        int humidity =
                ((Number) current.get("relative_humidity_2m"))
                        .intValue();

        double windSpeed =
                ((Number) current.get("wind_speed_10m"))
                        .doubleValue();

        int weatherCode =
                ((Number) current.get("weather_code"))
                        .intValue();

        String condition =
                getWeatherCondition(weatherCode);

        // =====================================================
        // STEP 4: HOURLY FORECAST
        // =====================================================

        List<WeatherResponse.HourlyWeather>
                hourlyForecast =
                buildHourlyForecast(weatherResponse);

        // =====================================================
        // STEP 5: WEEKLY FORECAST
        // =====================================================

        List<WeatherResponse.DailyWeather>
                weeklyForecast =
                buildWeeklyForecast(weatherResponse);

        // =====================================================
        // STEP 6: CROP WEATHER RISKS
        // =====================================================

        List<WeatherResponse.WeatherRisk>
                risks =
                calculateRisks(
                        temperature,
                        humidity,
                        windSpeed,
                        weeklyForecast
                );

        // =====================================================
        // DEBUG
        // =====================================================

        System.out.println("==========================================");
        System.out.println("WEATHER API SUCCESS");
        System.out.println("Location: " + cityName);
        System.out.println("Temperature: " + temperature + " °C");
        System.out.println("Humidity: " + humidity + " %");
        System.out.println("Wind Speed: " + windSpeed + " km/h");
        System.out.println("Condition: " + condition);
        System.out.println(
                "Hourly Forecast Size: "
                        + hourlyForecast.size());
        System.out.println(
                "Weekly Forecast Size: "
                        + weeklyForecast.size());
        System.out.println(
                "Risk Information Size: "
                        + risks.size());
        System.out.println("User Email: " + email);
        System.out.println("==========================================");

        // =====================================================
        // FINAL RESPONSE
        // =====================================================

        WeatherResponse response =
                new WeatherResponse(
                        cityName,
                        temperature,
                        humidity,
                        windSpeed,
                        condition,
                        hourlyForecast,
                        weeklyForecast,
                        risks
                );

        // =====================================================
        // STEP 7: WEATHER NOTIFICATIONS
        // =====================================================

        if (email != null &&
                !email.trim().isEmpty()) {

            try {

                notificationService
                        .createWeatherNotifications(
                                email,
                                response
                        );

                System.out.println(
                        "Weather notification processing completed.");

            } catch (Exception e) {

                /*
                 * Notification failure should NOT prevent
                 * weather data from being displayed.
                 */

                System.out.println(
                        "Weather notification processing failed: "
                                + e.getMessage());
            }
        }

        return response;
    }

    // =========================================================
    // BUILD HOURLY FORECAST
    // =========================================================

    private List<WeatherResponse.HourlyWeather>
    buildHourlyForecast(
            Map<String, Object> weatherResponse) {

        List<WeatherResponse.HourlyWeather>
                forecast =
                new ArrayList<>();

        Object hourlyObject =
                weatherResponse.get("hourly");

        if (!(hourlyObject instanceof Map<?, ?> hourly)) {

            System.out.println(
                    "Hourly weather data missing");

            return forecast;
        }

        Object timesObject =
                hourly.get("time");

        Object temperaturesObject =
                hourly.get("temperature_2m");

        Object rainObject =
                hourly.get("precipitation_probability");

        Object codesObject =
                hourly.get("weather_code");

        if (!(timesObject instanceof List<?> times)
                || !(temperaturesObject instanceof List<?> temperatures)
                || !(rainObject instanceof List<?> rain)
                || !(codesObject instanceof List<?> codes)) {

            System.out.println(
                    "Hourly weather data format invalid");

            return forecast;
        }

        int[] requiredHours =
                {6, 9, 12, 15, 18, 21};

        for (int requiredHour : requiredHours) {

            boolean found = false;

            for (int i = 0;
                 i < times.size();
                 i++) {

                if (i >= temperatures.size()
                        || i >= rain.size()
                        || i >= codes.size()) {

                    continue;
                }

                String dateTime =
                        String.valueOf(times.get(i));

                try {

                    LocalDateTime parsedDateTime =
                            LocalDateTime.parse(
                                    dateTime,
                                    DateTimeFormatter
                                            .ISO_LOCAL_DATE_TIME
                            );

                    int actualHour =
                            parsedDateTime.getHour();

                    if (actualHour == requiredHour) {

                        double temperature =
                                ((Number) temperatures.get(i))
                                        .doubleValue();

                        int rainProbability =
                                ((Number) rain.get(i))
                                        .intValue();

                        int weatherCode =
                                ((Number) codes.get(i))
                                        .intValue();

                        String formattedTime =
                                formatHour(dateTime);

                        forecast.add(
                                new WeatherResponse.HourlyWeather(
                                        formattedTime,
                                        temperature,
                                        rainProbability,
                                        weatherCode
                                )
                        );

                        found = true;

                        break;
                    }

                } catch (Exception e) {

                    System.out.println(
                            "Unable to parse hourly time: "
                                    + dateTime);
                }
            }

            if (!found) {

                System.out.println(
                        "Hourly time not found: "
                                + requiredHour
                                + ":00");
            }
        }

        return forecast;
    }

    // =========================================================
    // BUILD WEEKLY FORECAST
    // =========================================================

    private List<WeatherResponse.DailyWeather>
    buildWeeklyForecast(
            Map<String, Object> weatherResponse) {

        List<WeatherResponse.DailyWeather>
                forecast =
                new ArrayList<>();

        Object dailyObject =
                weatherResponse.get("daily");

        if (!(dailyObject instanceof Map<?, ?> daily)) {

            System.out.println(
                    "Daily weather data missing");

            return forecast;
        }

        Object datesObject =
                daily.get("time");

        Object maxObject =
                daily.get("temperature_2m_max");

        Object minObject =
                daily.get("temperature_2m_min");

        Object rainObject =
                daily.get(
                        "precipitation_probability_max");

        Object codesObject =
                daily.get("weather_code");

        if (!(datesObject instanceof List<?> dates)
                || !(maxObject instanceof List<?> maxTemps)
                || !(minObject instanceof List<?> minTemps)
                || !(rainObject instanceof List<?> rainProbabilities)
                || !(codesObject instanceof List<?> dailyCodes)) {

            System.out.println(
                    "Daily weather data format invalid");

            return forecast;
        }

        int totalDays =
                Math.min(
                        dates.size(),
                        Math.min(
                                maxTemps.size(),
                                Math.min(
                                        minTemps.size(),
                                        Math.min(
                                                rainProbabilities.size(),
                                                dailyCodes.size()
                                        )
                                )
                        )
                );

        for (int i = 0;
             i < totalDays && i < 7;
             i++) {

            try {

                String dateString =
                        String.valueOf(dates.get(i));

                LocalDate date =
                        LocalDate.parse(dateString);

                String day;

                if (i == 0) {

                    day = "TODAY";

                } else {

                    day =
                            date.getDayOfWeek()
                                    .toString()
                                    .substring(0, 3);
                }

                double high =
                        ((Number) maxTemps.get(i))
                                .doubleValue();

                double low =
                        ((Number) minTemps.get(i))
                                .doubleValue();

                int rainProbability =
                        ((Number) rainProbabilities.get(i))
                                .intValue();

                int weatherCode =
                        ((Number) dailyCodes.get(i))
                                .intValue();

                String condition =
                        getWeatherCondition(weatherCode);

                forecast.add(
                        new WeatherResponse.DailyWeather(
                                day,
                                dateString,
                                high,
                                low,
                                rainProbability,
                                weatherCode,
                                condition
                        )
                );

            } catch (Exception e) {

                System.out.println(
                        "Unable to process daily weather: "
                                + e.getMessage());
            }
        }

        return forecast;
    }

    // =========================================================
    // DYNAMIC CROP WEATHER RISK CALCULATION
    // =========================================================

    private List<WeatherResponse.WeatherRisk>
    calculateRisks(
            double temperature,
            int humidity,
            double windSpeed,
            List<WeatherResponse.DailyWeather>
                    weeklyForecast) {

        List<WeatherResponse.WeatherRisk>
                risks =
                new ArrayList<>();

        // =====================================================
        // HEAT STRESS
        // =====================================================

        int heatRisk;

        if (temperature >= 42) {
            heatRisk = 98;
        } else if (temperature >= 40) {
            heatRisk = 92;
        } else if (temperature >= 38) {
            heatRisk = 85;
        } else if (temperature >= 36) {
            heatRisk = 75;
        } else if (temperature >= 34) {
            heatRisk = 62;
        } else if (temperature >= 32) {
            heatRisk = 48;
        } else if (temperature >= 29) {
            heatRisk = 32;
        } else if (temperature >= 25) {
            heatRisk = 20;
        } else {
            heatRisk = 10;
        }

        risks.add(
                new WeatherResponse.WeatherRisk(
                        "Heat Stress",
                        getRiskLevel(heatRisk),
                        heatRisk
                )
        );

        // =====================================================
        // RAIN RISK
        // =====================================================

        int averageRain = 0;
        int maximumRain = 0;
        int rainyDays = 0;

        if (weeklyForecast != null
                && !weeklyForecast.isEmpty()) {

            int totalRain = 0;

            for (WeatherResponse.DailyWeather day
                    : weeklyForecast) {

                int rain =
                        day.getRainProbability();

                totalRain += rain;

                maximumRain =
                        Math.max(
                                maximumRain,
                                rain
                        );

                if (rain >= 60) {
                    rainyDays++;
                }
            }

            averageRain =
                    totalRain / weeklyForecast.size();
        }

        int rainRisk =
                (int) (
                        averageRain * 0.45
                        + maximumRain * 0.35
                        + Math.min(
                                rainyDays * 8,
                                20
                        )
                );

        rainRisk =
                Math.min(
                        100,
                        Math.max(
                                0,
                                rainRisk
                        )
                );

        risks.add(
                new WeatherResponse.WeatherRisk(
                        "Rain Risk",
                        getRiskLevel(rainRisk),
                        rainRisk
                )
        );

        // =====================================================
        // WIND RISK
        // =====================================================

        int windRisk;

        if (windSpeed >= 50) {
            windRisk = 98;
        } else if (windSpeed >= 45) {
            windRisk = 90;
        } else if (windSpeed >= 40) {
            windRisk = 82;
        } else if (windSpeed >= 35) {
            windRisk = 74;
        } else if (windSpeed >= 30) {
            windRisk = 65;
        } else if (windSpeed >= 25) {
            windRisk = 52;
        } else if (windSpeed >= 20) {
            windRisk = 40;
        } else if (windSpeed >= 15) {
            windRisk = 28;
        } else if (windSpeed >= 10) {
            windRisk = 18;
        } else {
            windRisk = 10;
        }

        risks.add(
                new WeatherResponse.WeatherRisk(
                        "Wind Risk",
                        getRiskLevel(windRisk),
                        windRisk
                )
        );

        // =====================================================
        // HUMIDITY / FUNGAL RISK
        // =====================================================

        int humidityRisk;

        if (humidity >= 95) {
            humidityRisk = 96;
        } else if (humidity >= 90) {
            humidityRisk = 88;
        } else if (humidity >= 85) {
            humidityRisk = 78;
        } else if (humidity >= 80) {
            humidityRisk = 68;
        } else if (humidity >= 75) {
            humidityRisk = 58;
        } else if (humidity >= 70) {
            humidityRisk = 48;
        } else if (humidity >= 65) {
            humidityRisk = 38;
        } else if (humidity >= 55) {
            humidityRisk = 25;
        } else {
            humidityRisk = 15;
        }

        risks.add(
                new WeatherResponse.WeatherRisk(
                        "Humidity Risk",
                        getRiskLevel(humidityRisk),
                        humidityRisk
                )
        );

        return risks;
    }

    // =========================================================
    // RISK LEVEL
    // =========================================================

    private String getRiskLevel(
            int percentage) {

        if (percentage >= 70) {
            return "High";
        }

        if (percentage >= 40) {
            return "Moderate";
        }

        return "Low";
    }

    // =========================================================
    // FORMAT HOURLY TIME
    // =========================================================

    private String formatHour(
            String dateTime) {

        LocalDateTime date =
                LocalDateTime.parse(
                        dateTime,
                        DateTimeFormatter
                                .ISO_LOCAL_DATE_TIME
                );

        int hour =
                date.getHour();

        if (hour == 0) {
            return "12 AM";
        }

        if (hour == 12) {
            return "12 PM";
        }

        if (hour < 12) {
            return hour + " AM";
        }

        return (hour - 12) + " PM";
    }

    // =========================================================
    // WEATHER CODE → CONDITION
    // =========================================================

    private String getWeatherCondition(
            int code) {

        if (code == 0) {
            return "Clear Sky";
        }

        if (code == 1 || code == 2) {
            return "Partly Cloudy";
        }

        if (code == 3) {
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
            return "Rain Showers";
        }

        if (code >= 85 && code <= 86) {
            return "Snow Showers";
        }

        if (code >= 95 && code <= 99) {
            return "Thunderstorm";
        }

        return "Unknown";
    }
}