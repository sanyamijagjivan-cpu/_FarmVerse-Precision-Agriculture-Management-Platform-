package com.farmverse.service;

import com.farmverse.dto.FarmActivityRequest;
import com.farmverse.entity.Farm;
import com.farmverse.entity.FarmActivity;
import com.farmverse.entity.User;
import com.farmverse.repository.FarmActivityRepository;
import com.farmverse.repository.FarmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmActivityService {

    @Autowired
    private FarmActivityRepository activityRepository;

    @Autowired
    private FarmRepository farmRepository;

    // CREATE ACTIVITY
    public FarmActivity createActivity(
            FarmActivityRequest request,
            User user) {

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        FarmActivity activity = new FarmActivity();

        activity.setActivityName(request.getActivityName());
        activity.setDescription(request.getDescription());
        activity.setActivityDate(request.getActivityDate());
        activity.setFarm(farm);

        return activityRepository.save(activity);
    }

    // GET ACTIVITIES BY FARM
    public List<FarmActivity> getActivitiesByFarm(
            Long farmId,
            User user) {

        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        return activityRepository.findByFarm(farm);
    }

    // GET ONE ACTIVITY
    public FarmActivity getActivityById(
            Long id,
            User user) {

        FarmActivity activity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity not found"));

        checkActivityOwnership(activity, user);

        return activity;
    }

    // UPDATE ACTIVITY
    public FarmActivity updateActivity(
            Long id,
            FarmActivityRequest request,
            User user) {

        FarmActivity activity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity not found"));

        checkActivityOwnership(activity, user);

        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() ->
                        new RuntimeException("Farm not found"));

        checkFarmOwnership(farm, user);

        activity.setActivityName(request.getActivityName());
        activity.setDescription(request.getDescription());
        activity.setActivityDate(request.getActivityDate());
        activity.setFarm(farm);

        return activityRepository.save(activity);
    }

    // DELETE ACTIVITY
    public void deleteActivity(
            Long id,
            User user) {

        FarmActivity activity =
                activityRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Activity not found"));

        checkActivityOwnership(activity, user);

        activityRepository.delete(activity);
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

    // CHECK ACTIVITY OWNERSHIP
    private void checkActivityOwnership(
            FarmActivity activity,
            User user) {

        if (!activity.getFarm()
                .getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You do not have access to this activity");
        }
    }
}