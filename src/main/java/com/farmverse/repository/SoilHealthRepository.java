package com.farmverse.repository;

import com.farmverse.entity.Farm;
import com.farmverse.entity.SoilHealth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SoilHealthRepository
        extends JpaRepository<SoilHealth, Long> {

    List<SoilHealth> findByFarm(Farm farm);

    Optional<SoilHealth> findTopByFarmOrderByTestedDateDesc(Farm farm);
}