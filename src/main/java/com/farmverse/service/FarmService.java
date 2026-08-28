package com.farmverse.service;

import com.farmverse.entity.Farm;
import com.farmverse.entity.User;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new farm for the logged-in user
    public Farm createFarm(Farm farm, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        farm.setUser(user);

        return farmRepository.save(farm);
    }

    // Get only the logged-in user's farms
    public List<Farm> getAllFarms(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return farmRepository.findByUser(user);
    }

    // Get a farm only if it belongs to the logged-in user
    public Farm getFarmById(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return farmRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Farm not found"));
    }

    // Update only the logged-in user's farm
    public Farm updateFarm(Long id, Farm farm, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farm existingFarm = farmRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        existingFarm.setFarmName(farm.getFarmName());
        existingFarm.setLocation(farm.getLocation());
        existingFarm.setArea(farm.getArea());
        existingFarm.setSoilType(farm.getSoilType());

        return farmRepository.save(existingFarm);
    }

    // Delete only the logged-in user's farm
    public void deleteFarm(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farm farm = farmRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        farmRepository.delete(farm);
    }
}