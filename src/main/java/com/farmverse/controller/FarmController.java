package com.farmverse.controller;

import com.farmverse.entity.Farm;
import com.farmverse.service.FarmService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    @Autowired
    private FarmService farmService;

    // Create farm
    @PostMapping
    public Farm createFarm(
            @RequestBody Farm farm,
            Authentication authentication) {

        String email = authentication.getName();

        return farmService.createFarm(farm, email);
    }

    // Get only logged-in user's farms
    @GetMapping
    public List<Farm> getAllFarms(
            Authentication authentication) {

        String email = authentication.getName();

        return farmService.getAllFarms(email);
    }

    // Get farm by ID
    @GetMapping("/{id}")
    public Farm getFarmById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return farmService.getFarmById(id, email);
    }

    // Update farm
    @PutMapping("/{id}")
    public Farm updateFarm(
            @PathVariable Long id,
            @RequestBody Farm farm,
            Authentication authentication) {

        String email = authentication.getName();

        return farmService.updateFarm(id, farm, email);
    }

    // Delete farm
    @DeleteMapping("/{id}")
    public String deleteFarm(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        farmService.deleteFarm(id, email);

        return "Farm deleted successfully";
    }
}