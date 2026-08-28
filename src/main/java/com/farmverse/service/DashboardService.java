package com.farmverse.service;

import com.farmverse.dto.DashboardResponse;
import com.farmverse.repository.FarmRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private FarmRepository farmRepository;

    public DashboardResponse getDashboardData() {

        long totalFarms = farmRepository.count();

        return new DashboardResponse(
                totalFarms,
                "Available",
                "Pending integration",
                "Pending integration"
        );
    }
}