package com.farmverse.repository;

import com.farmverse.entity.DiseaseScan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiseaseScanRepository
        extends JpaRepository<DiseaseScan, Long> {

    List<DiseaseScan> findTop10ByOrderByScannedAtDesc();
}