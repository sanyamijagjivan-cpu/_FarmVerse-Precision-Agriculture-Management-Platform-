package com.farmverse.controller;

import com.farmverse.entity.Farm;
import com.farmverse.service.FarmService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    @Autowired
    private FarmService farmService;

    // Create farm
    @PostMapping
    public Farm createFarm(@RequestBody Farm farm) {
        return farmService.createFarm(farm);
    }

    // Get all farms
    @GetMapping
    public List<Farm> getAllFarms() {
        return farmService.getAllFarms();
    }

    // Get farm by ID
    @GetMapping("/{id}")
    public Farm getFarmById(@PathVariable Long id) {
        return farmService.getFarmById(id);
    }

    // Update farm
    @PutMapping("/{id}")
    public Farm updateFarm(
            @PathVariable Long id,
            @RequestBody Farm farm) {

        return farmService.updateFarm(id, farm);
    }

    // Delete farm
    @DeleteMapping("/{id}")
    public String deleteFarm(@PathVariable Long id) {

        farmService.deleteFarm(id);

        return "Farm deleted successfully";
    }
}