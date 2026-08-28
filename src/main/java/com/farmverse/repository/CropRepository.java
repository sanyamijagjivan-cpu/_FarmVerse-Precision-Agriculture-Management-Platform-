package com.farmverse.repository;

import com.farmverse.entity.Crop;
import com.farmverse.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByFarm(Farm farm);
}