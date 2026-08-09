package com.farmverse.service;

import com.farmverse.entity.Farm;
import com.farmverse.repository.FarmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    @Autowired
    private FarmRepository farmRepository;

    // Create a new farm
    public Farm createFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    // Get all farms
    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    // Get farm by ID
    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farm not found"));
    }

    // Update farm
    public Farm updateFarm(Long id, Farm farm) {

        Farm existingFarm = farmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        existingFarm.setFarmName(farm.getFarmName());
        existingFarm.setLocation(farm.getLocation());
        existingFarm.setArea(farm.getArea());
        existingFarm.setSoilType(farm.getSoilType());

        return farmRepository.save(existingFarm);
    }

    // Delete farm
    public void deleteFarm(Long id) {

        if (!farmRepository.existsById(id)) {
            throw new RuntimeException("Farm not found");
        }

        farmRepository.deleteById(id);
    }
}