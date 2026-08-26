package com.farmverse.service;

import com.farmverse.entity.Farm;
import com.farmverse.entity.Irrigation;
import com.farmverse.entity.User;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.IrrigationRepository;
import com.farmverse.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IrrigationService {

    private final IrrigationRepository irrigationRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public IrrigationService(
            IrrigationRepository irrigationRepository,
            FarmRepository farmRepository,
            UserRepository userRepository) {

        this.irrigationRepository = irrigationRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    // ==============================
    // CREATE IRRIGATION
    // ==============================

    public Irrigation createIrrigation(
            Irrigation irrigation,
            Long farmId,
            Authentication authentication) {

        Farm farm = getUserFarm(farmId, authentication);

        irrigation.setFarm(farm);

        if (irrigation.getStatus() == null ||
                irrigation.getStatus().isBlank()) {

            irrigation.setStatus("Scheduled");
        }

        return irrigationRepository.save(irrigation);
    }

    // ==============================
    // GET IRRIGATION BY FARM
    // ==============================

    public List<Irrigation> getIrrigationByFarm(
            Long farmId,
            Authentication authentication) {

        getUserFarm(farmId, authentication);

        return irrigationRepository.findByFarmId(farmId);
    }

    // ==============================
    // GET SINGLE IRRIGATION
    // ==============================

    public Irrigation getIrrigation(
            Long irrigationId,
            Authentication authentication) {

        Irrigation irrigation = irrigationRepository
                .findById(irrigationId)
                .orElseThrow(() ->
                        new RuntimeException("Irrigation not found"));

        getUserFarm(
                irrigation.getFarm().getId(),
                authentication
        );

        return irrigation;
    }

    // ==============================
    // UPDATE IRRIGATION
    // ==============================

    public Irrigation updateIrrigation(
            Long irrigationId,
            Irrigation updatedIrrigation,
            Long farmId,
            Authentication authentication) {

        Irrigation existing = irrigationRepository
                .findById(irrigationId)
                .orElseThrow(() ->
                        new RuntimeException("Irrigation not found"));

        Farm farm = getUserFarm(farmId, authentication);

        existing.setIrrigationType(
                updatedIrrigation.getIrrigationType()
        );

        existing.setWaterAmount(
                updatedIrrigation.getWaterAmount()
        );

        existing.setScheduledDate(
                updatedIrrigation.getScheduledDate()
        );

        existing.setStartTime(
                updatedIrrigation.getStartTime()
        );

        existing.setDurationMinutes(
                updatedIrrigation.getDurationMinutes()
        );

        existing.setStatus(
                updatedIrrigation.getStatus()
        );

        existing.setFarm(farm);

        return irrigationRepository.save(existing);
    }

    // ==============================
    // DELETE IRRIGATION
    // ==============================

    public void deleteIrrigation(
            Long irrigationId,
            Authentication authentication) {

        Irrigation irrigation = irrigationRepository
                .findById(irrigationId)
                .orElseThrow(() ->
                        new RuntimeException("Irrigation not found"));

        getUserFarm(
                irrigation.getFarm().getId(),
                authentication
        );

        irrigationRepository.delete(irrigation);
    }

    // ==============================
    // VERIFY FARM OWNERSHIP
    // ==============================

    private Farm getUserFarm(
            Long farmId,
            Authentication authentication) {

        Farm farm = farmRepository
                .findById(farmId)
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!farm.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to access this farm"
            );
        }

        return farm;
    }
}