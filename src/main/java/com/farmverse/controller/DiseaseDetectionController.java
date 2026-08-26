
package com.farmverse.controller;

import com.farmverse.dto.DiseaseDetectionResponse;
import com.farmverse.entity.DiseaseScan;
import com.farmverse.service.DiseaseDetectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/disease-detection")
public class DiseaseDetectionController {

    @Autowired
    private DiseaseDetectionService diseaseDetectionService;

    // =====================================================
    // AI DISEASE DETECTION
    // =====================================================

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public DiseaseDetectionResponse detectDisease(

            @RequestPart("image")
            MultipartFile image,

            @RequestPart("cropName")
            String cropName,

            @RequestPart("symptoms")
            String symptoms) {

        return diseaseDetectionService.detectDisease(
                image,
                cropName,
                symptoms
        );
    }

    // =====================================================
    // DISEASE HISTORY
    // =====================================================

    @GetMapping("/history")
    public List<DiseaseScan> getDiseaseHistory() {

        return diseaseDetectionService.getRecentScans();
    }
}

