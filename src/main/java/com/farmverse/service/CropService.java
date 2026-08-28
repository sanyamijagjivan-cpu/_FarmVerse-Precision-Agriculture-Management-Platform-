package com.farmverse.service;

import com.farmverse.dto.CropRequest;
import com.farmverse.entity.Crop;
import com.farmverse.entity.Farm;
import com.farmverse.entity.User;
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

    // CREATE CROP
    public Crop createCrop(CropRequest request, User user) {

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        // Make sure the farm belongs to the logged-in user
        if (!farm.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You do not have access to this farm");
        }

        Crop crop = new Crop();

        crop.setCropName(request.getCropName());
        crop.setCropType(request.getCropType());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setExpectedHarvestDate(request.getExpectedHarvestDate());
        crop.setFarm(farm);

        return cropRepository.save(crop);
    }

    // GET ALL CROPS BELONGING TO USER
    public List<Crop> getAllCrops(User user) {

        return cropRepository.findAll()
                .stream()
                .filter(crop ->
                        crop.getFarm()
                                .getUser()
                                .getId()
                                .equals(user.getId()))
                .toList();
    }

    // GET ONE CROP
    public Crop getCropById(Long id, User user) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Crop not found"));

        checkOwnership(crop, user);

        return crop;
    }

    // GET CROPS BY FARM
    public List<Crop> getCropsByFarm(
            Long farmId,
            User user) {

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        return cropRepository.findByFarm(farm);
    }

    // UPDATE CROP
    public Crop updateCrop(
            Long id,
            CropRequest request,
            User user) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Crop not found"));

        checkOwnership(crop, user);

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        crop.setCropName(request.getCropName());
        crop.setCropType(request.getCropType());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setExpectedHarvestDate(
                request.getExpectedHarvestDate());
        crop.setFarm(farm);

        return cropRepository.save(crop);
    }

    // DELETE CROP
    public void deleteCrop(Long id, User user) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Crop not found"));

        checkOwnership(crop, user);

        cropRepository.delete(crop);
    }

    // CHECK CROP OWNERSHIP
    private void checkOwnership(
            Crop crop,
            User user) {

        if (!crop.getFarm()
                .getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not have access to this crop");
        }
    }

    // CHECK FARM OWNERSHIP
    private void checkFarmOwnership(
            Farm farm,
            User user) {

        if (!farm.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not have access to this farm");
        }
    }
}