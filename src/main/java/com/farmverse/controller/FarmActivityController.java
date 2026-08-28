package com.farmverse.controller;

import com.farmverse.dto.FarmActivityRequest;
import com.farmverse.entity.FarmActivity;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.service.FarmActivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class FarmActivityController {

    @Autowired
    private FarmActivityService activityService;

    @Autowired
    private UserRepository userRepository;

    // CREATE ACTIVITY
    @PostMapping
    public FarmActivity createActivity(
            @RequestBody FarmActivityRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return activityService.createActivity(
                request,
                user);
    }

    // GET ACTIVITIES BY FARM
    @GetMapping("/farm/{farmId}")
    public List<FarmActivity> getActivitiesByFarm(
            @PathVariable Long farmId,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return activityService.getActivitiesByFarm(
                farmId,
                user);
    }

    // GET ONE ACTIVITY
    @GetMapping("/{id}")
    public FarmActivity getActivityById(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return activityService.getActivityById(
                id,
                user);
    }

    // UPDATE ACTIVITY
    @PutMapping("/{id}")
    public FarmActivity updateActivity(
            @PathVariable Long id,
            @RequestBody FarmActivityRequest request,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        return activityService.updateActivity(
                id,
                request,
                user);
    }

    // DELETE ACTIVITY
    @DeleteMapping("/{id}")
    public String deleteActivity(
            @PathVariable Long id,
            Authentication authentication) {

        User user = getLoggedInUser(authentication);

        activityService.deleteActivity(id, user);

        return "Activity deleted successfully";
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