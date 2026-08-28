
package com.farmverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.LoginResponse;
import com.farmverse.dto.UpdateProfileRequest;
import com.farmverse.dto.UserProfileResponse;
import com.farmverse.dto.UserRequest;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.response.ApiResponse;
import com.farmverse.security.JwtUtil;

import com.farmverse.dto.ChangePasswordRequest;

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

    // ==============================
    // REGISTER
    // ==============================

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

    // ==============================
    // LOGIN
    // ==============================

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

    // ==============================
// GET PROFILE
// ==============================

public UserProfileResponse getProfile(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getState(),
            user.getDistrict(),
            user.getVillage(),
            user.getFarmerType(),
            user.getFarmingExperience(),
            user.getPreferredLanguage()
    );
}


// ==============================
// UPDATE PROFILE
// ==============================

public UserProfileResponse updateProfile(
        String email,
        UpdateProfileRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setName(request.getName());
    user.setPhone(request.getPhone());
    user.setState(request.getState());
    user.setDistrict(request.getDistrict());
    user.setVillage(request.getVillage());
    user.setFarmerType(request.getFarmerType());
    user.setFarmingExperience(request.getFarmingExperience());
    user.setPreferredLanguage(request.getPreferredLanguage());

    User updatedUser = userRepository.save(user);

    return new UserProfileResponse(
            updatedUser.getId(),
            updatedUser.getName(),
            updatedUser.getEmail(),
            updatedUser.getPhone(),
            updatedUser.getState(),
            updatedUser.getDistrict(),
            updatedUser.getVillage(),
            updatedUser.getFarmerType(),
            updatedUser.getFarmingExperience(),
            updatedUser.getPreferredLanguage()
    );
}


public ApiResponse changePassword(
        String email,
        ChangePasswordRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Check current password
    if (!passwordEncoder.matches(
            request.getCurrentPassword(),
            user.getPassword())) {

        throw new RuntimeException("Current password is incorrect");
    }

    // Encrypt and save new password
    user.setPassword(
            passwordEncoder.encode(request.getNewPassword())
    );

    userRepository.save(user);

    return new ApiResponse("Password changed successfully");
}


}
