package com.farmverse.service;

import com.farmverse.dto.CropRequest;
import com.farmverse.entity.Crop;
import com.farmverse.entity.Farm;
import com.farmverse.repository.CropRepository;
import com.farmverse.repository.FarmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private FarmRepository farmRepository;

    public Crop createCrop(CropRequest request) {

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        Crop crop = new Crop();

        crop.setCropName(request.getCropName());
        crop.setCropType(request.getCropType());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setExpectedHarvestDate(request.getExpectedHarvestDate());
        crop.setFarm(farm);

        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public Crop getCropById(Long id) {

        return cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));
    }

    public List<Crop> getCropsByFarm(Long farmId) {

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        return cropRepository.findByFarm(farm);
    }

    public Crop updateCrop(Long id, CropRequest request) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        crop.setCropName(request.getCropName());
        crop.setCropType(request.getCropType());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setExpectedHarvestDate(request.getExpectedHarvestDate());
        crop.setFarm(farm);

        return cropRepository.save(crop);
    }

    public void deleteCrop(Long id) {

        if (!cropRepository.existsById(id)) {
            throw new RuntimeException("Crop not found");
        }

        cropRepository.deleteById(id);
    }
}