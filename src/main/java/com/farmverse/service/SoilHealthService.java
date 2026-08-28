package com.farmverse.service;

import com.farmverse.dto.SoilHealthRequest;
import com.farmverse.entity.Farm;
import com.farmverse.entity.SoilHealth;
import com.farmverse.entity.User;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.SoilHealthRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SoilHealthService {

    @Autowired
    private SoilHealthRepository soilHealthRepository;

    @Autowired
    private FarmRepository farmRepository;

    public SoilHealth createSoilHealth(
            SoilHealthRequest request,
            User user) {

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        SoilHealth soil = new SoilHealth();

        soil.setSoilType(request.getSoilType());
        soil.setPhLevel(request.getPhLevel());
        soil.setNitrogen(request.getNitrogen());
        soil.setPhosphorus(request.getPhosphorus());
        soil.setPotassium(request.getPotassium());
        soil.setOrganicMatter(request.getOrganicMatter());
        soil.setMoisture(request.getMoisture());
        soil.setTestedDate(request.getTestedDate());
        soil.setFarm(farm);

        return soilHealthRepository.save(soil);
    }

    public List<SoilHealth> getSoilHealth(
            Long farmId,
            User user) {

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        return soilHealthRepository.findByFarm(farm);
    }

    public SoilHealth updateSoilHealth(
            Long id,
            SoilHealthRequest request,
            User user) {

        SoilHealth soil = soilHealthRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Soil record not found"));

        checkFarmOwnership(soil.getFarm(), user);

        soil.setSoilType(request.getSoilType());
        soil.setPhLevel(request.getPhLevel());
        soil.setNitrogen(request.getNitrogen());
        soil.setPhosphorus(request.getPhosphorus());
        soil.setPotassium(request.getPotassium());
        soil.setOrganicMatter(request.getOrganicMatter());
        soil.setMoisture(request.getMoisture());
        soil.setTestedDate(request.getTestedDate());

        return soilHealthRepository.save(soil);
    }

    public void deleteSoilHealth(
            Long id,
            User user) {

        SoilHealth soil = soilHealthRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Soil record not found"));

        checkFarmOwnership(soil.getFarm(), user);

        soilHealthRepository.delete(soil);
    }

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