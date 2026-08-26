package com.farmverse.repository;

import com.farmverse.entity.Irrigation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IrrigationRepository extends JpaRepository<Irrigation, Long> {

    List<Irrigation> findByFarmId(Long farmId);
}