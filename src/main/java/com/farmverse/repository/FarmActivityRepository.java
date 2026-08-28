package com.farmverse.repository;

import com.farmverse.entity.Farm;
import com.farmverse.entity.FarmActivity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmActivityRepository
        extends JpaRepository<FarmActivity, Long> {

    List<FarmActivity> findByFarm(Farm farm);
}