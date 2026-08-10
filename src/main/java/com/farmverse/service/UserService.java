package com.farmverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.LoginResponse;
import com.farmverse.dto.UserRequest;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.response.ApiResponse;
import com.farmverse.security.JwtUtil;

import com.farmverse.dto.UserProfileResponse;
import com.farmverse.dto.UpdateProfileRequest;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse registerUser(UserRequest userRequest) {

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(userRequest.getPassword())
        );

        userRepository.save(user);

        return new ApiResponse("User registered successfully");
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        String token = jwtUtil.generateToken(loginRequest.getEmail());

        return new LoginResponse(
                "Login successful",
                token
        );
    }


    public UserProfileResponse getProfile(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail()
    );
}

     public UserProfileResponse updateProfile(
        String email,
        UpdateProfileRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setName(request.getName());

    User updatedUser = userRepository.save(user);

    return new UserProfileResponse(
            updatedUser.getId(),
            updatedUser.getName(),
            updatedUser.getEmail()
    );
}
}