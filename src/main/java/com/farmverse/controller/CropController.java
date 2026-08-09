package com.farmverse.controller;

import com.farmverse.dto.CropRequest;
import com.farmverse.entity.Crop;
import com.farmverse.service.CropService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    @Autowired
    private CropService cropService;

    @PostMapping
    public Crop createCrop(@RequestBody CropRequest request) {
        return cropService.createCrop(request);
    }

    @GetMapping
    public List<Crop> getAllCrops() {
        return cropService.getAllCrops();
    }

    @GetMapping("/{id}")
    public Crop getCropById(@PathVariable Long id) {
        return cropService.getCropById(id);
    }

    @GetMapping("/farm/{farmId}")
    public List<Crop> getCropsByFarm(@PathVariable Long farmId) {
        return cropService.getCropsByFarm(farmId);
    }

    @PutMapping("/{id}")
    public Crop updateCrop(
            @PathVariable Long id,
            @RequestBody CropRequest request) {

        return cropService.updateCrop(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteCrop(@PathVariable Long id) {

        cropService.deleteCrop(id);

        return "Crop deleted successfully";
    }
}