package com.farmverse.controller;

import com.farmverse.dto.CropRequest;
import com.farmverse.entity.Crop;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.service.CropService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    @Autowired
    private CropService cropService;

    @Autowired
    private UserRepository userRepository;

    // CREATE CROP
    @PostMapping
    public Crop createCrop(
            @RequestBody CropRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return cropService.createCrop(request, user);
    }

    // GET ALL USER'S CROPS
    @GetMapping
    public List<Crop> getAllCrops(
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return cropService.getAllCrops(user);
    }

    // GET ONE CROP
    @GetMapping("/{id}")
    public Crop getCropById(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return cropService.getCropById(id, user);
    }

    // GET CROPS BY FARM
    @GetMapping("/farm/{farmId}")
    public List<Crop> getCropsByFarm(
            @PathVariable Long farmId,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return cropService.getCropsByFarm(
                farmId,
                user);
    }

    // UPDATE CROP
    @PutMapping("/{id}")
    public Crop updateCrop(
            @PathVariable Long id,
            @RequestBody CropRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return cropService.updateCrop(
                id,
                request,
                user);
    }

    // DELETE CROP
    @DeleteMapping("/{id}")
    public String deleteCrop(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        cropService.deleteCrop(id, user);

        return "Crop deleted successfully";
    }

    // GET LOGGED-IN USER
    private User getLoggedInUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}