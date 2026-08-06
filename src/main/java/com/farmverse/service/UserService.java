package com.farmverse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmverse.dto.UserRequest;
import com.farmverse.entity.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.response.ApiResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public ApiResponse registerUser(UserRequest userRequest) {

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());

        userRepository.save(user);

        return new ApiResponse("User registered successfully");
    }
}