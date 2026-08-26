package com.farmverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmverse.dto.UpdateUserSettingsRequest;
import com.farmverse.dto.UserSettingsResponse;
import com.farmverse.entity.User;
import com.farmverse.entity.UserSettings;
import com.farmverse.repository.UserRepository;
import com.farmverse.repository.UserSettingsRepository;

@Service
public class UserSettingsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSettingsRepository settingsRepository;

    // =====================================================
    // GET SETTINGS
    // =====================================================

    public UserSettingsResponse getSettings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        UserSettings settings =
                settingsRepository.findByUser(user)
                        .orElseGet(() -> createDefaultSettings(user));

        return convertToResponse(settings);
    }

    // =====================================================
    // UPDATE SETTINGS
    // =====================================================

    public UserSettingsResponse updateSettings(
            String email,
            UpdateUserSettingsRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        UserSettings settings =
                settingsRepository.findByUser(user)
                        .orElseGet(() -> createDefaultSettings(user));

        settings.setNotificationsEnabled(
                request.isNotificationsEnabled());

        settings.setWeatherAlerts(
                request.isWeatherAlerts());

        settings.setCropAlerts(
                request.isCropAlerts());

        settings.setMarketAlerts(
                request.isMarketAlerts());

        settings.setSystemUpdates(
                request.isSystemUpdates());

        if (request.getLanguage() != null &&
                !request.getLanguage().isBlank()) {

            settings.setLanguage(request.getLanguage());
        }

        if (request.getTheme() != null &&
                !request.getTheme().isBlank()) {

            settings.setTheme(request.getTheme());
        }

        UserSettings saved =
                settingsRepository.save(settings);

        return convertToResponse(saved);
    }

    // =====================================================
    // CREATE DEFAULT SETTINGS
    // =====================================================

    private UserSettings createDefaultSettings(User user) {

        UserSettings settings = new UserSettings();

        settings.setUser(user);

        settings.setNotificationsEnabled(true);
        settings.setWeatherAlerts(true);
        settings.setCropAlerts(true);
        settings.setMarketAlerts(true);
        settings.setSystemUpdates(true);

        settings.setLanguage("English");
        settings.setTheme("Light");

        return settingsRepository.save(settings);
    }

    // =====================================================
    // CONVERT RESPONSE
    // =====================================================

    private UserSettingsResponse convertToResponse(
            UserSettings settings) {

        return new UserSettingsResponse(
                settings.isNotificationsEnabled(),
                settings.isWeatherAlerts(),
                settings.isCropAlerts(),
                settings.isMarketAlerts(),
                settings.isSystemUpdates(),
                settings.getLanguage(),
                settings.getTheme()
        );
    }
}