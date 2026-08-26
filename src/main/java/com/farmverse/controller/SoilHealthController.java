package com.farmverse.controller;

import com.farmverse.dto.SoilHealthRequest;
import com.farmverse.entity.SoilHealth;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.service.SoilHealthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soil-health")
public class SoilHealthController {

    @Autowired
    private SoilHealthService soilHealthService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public SoilHealth createSoilHealth(
            @RequestBody SoilHealthRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return soilHealthService.createSoilHealth(
                request,
                user);
    }

    @GetMapping("/farm/{farmId}")
    public List<SoilHealth> getSoilHealth(
            @PathVariable Long farmId,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return soilHealthService.getSoilHealth(
                farmId,
                user);
    }

    @PutMapping("/{id}")
    public SoilHealth updateSoilHealth(
            @PathVariable Long id,
            @RequestBody SoilHealthRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return soilHealthService.updateSoilHealth(
                id,
                request,
                user);
    }

    @DeleteMapping("/{id}")
    public String deleteSoilHealth(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        soilHealthService.deleteSoilHealth(
                id,
                user);

        return "Soil health record deleted successfully";
    }

    private User getLoggedInUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}