package com.farmverse.controller;

import com.farmverse.dto.DiseaseDetectionRequest;
import com.farmverse.dto.DiseaseDetectionResponse;
import com.farmverse.service.DiseaseDetectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disease-detection")
public class DiseaseDetectionController {

    @Autowired
    private DiseaseDetectionService diseaseDetectionService;

    @PostMapping
    public DiseaseDetectionResponse detectDisease(
            @RequestBody DiseaseDetectionRequest request) {

        return diseaseDetectionService.detectDisease(request);
    }
}