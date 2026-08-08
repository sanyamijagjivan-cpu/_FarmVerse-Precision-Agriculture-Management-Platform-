package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.LoginResponse;
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
    public ApiResponse profile() {
        return new ApiResponse("JWT authentication is working");
}
}