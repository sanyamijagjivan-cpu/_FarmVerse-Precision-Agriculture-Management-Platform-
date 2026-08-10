package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.LoginResponse;
import com.farmverse.dto.UpdateProfileRequest;
import com.farmverse.dto.UserProfileResponse;
import com.farmverse.dto.UserRequest;
import com.farmverse.response.ApiResponse;
import com.farmverse.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse registerUser(
            @Valid @RequestBody UserRequest userRequest) {

        return userService.registerUser(userRequest);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @Valid @RequestBody LoginRequest loginRequest) {

        return userService.loginUser(loginRequest);
    }

    @GetMapping("/profile")
    public UserProfileResponse profile(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return userService.getProfile(email);
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            @RequestBody UpdateProfileRequest request,
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return userService.updateProfile(email, request);
    }
}