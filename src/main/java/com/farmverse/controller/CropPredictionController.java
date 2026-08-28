package com.farmverse.controller;

import com.farmverse.dto.CropPredictionRequest;
import com.farmverse.dto.CropPredictionResponse;
import com.farmverse.service.CropPredictionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crops")
public class CropPredictionController {

    @Autowired
    private CropPredictionService cropPredictionService;

    @PostMapping("/predict")
    public CropPredictionResponse predictCrop(
            @RequestBody CropPredictionRequest request) {

        return cropPredictionService.predictCrop(request);
    }
}