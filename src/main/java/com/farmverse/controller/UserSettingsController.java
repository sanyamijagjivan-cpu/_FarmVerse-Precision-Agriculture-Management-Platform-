package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.farmverse.dto.UpdateUserSettingsRequest;
import com.farmverse.dto.UserSettingsResponse;
import com.farmverse.service.UserSettingsService;

@RestController
@RequestMapping("/api/users/settings")
public class UserSettingsController {

    @Autowired
    private UserSettingsService userSettingsService;

    // =====================================================
    // GET SETTINGS
    // =====================================================

    @GetMapping
    public UserSettingsResponse getSettings(
            Authentication authentication) {

        String email = authentication.getName();

        return userSettingsService.getSettings(email);
    }

    // =====================================================
    // UPDATE SETTINGS
    // =====================================================

    @PutMapping
    public UserSettingsResponse updateSettings(
            @RequestBody UpdateUserSettingsRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return userSettingsService.updateSettings(
                email,
                request
        );
    }
}