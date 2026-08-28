package com.farmverse.service;

import com.farmverse.entity.MarketPriceHistory;
import com.farmverse.repository.MarketPriceHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MarketPriceHistoryService {

    private final MarketPriceHistoryRepository repository;

    public MarketPriceHistoryService(
            MarketPriceHistoryRepository repository) {

        this.repository = repository;
    }

    // =====================================================
    // CREATE HISTORY RECORD
    // =====================================================

    public MarketPriceHistory createHistory(
            MarketPriceHistory history) {

        return repository.save(history);
    }

    // =====================================================
    // GET HISTORY BY CROP AND PERIOD
    // =====================================================

    public List<MarketPriceHistory> getHistory(
            String cropName,
            String period) {

        LocalDate endDate = LocalDate.now();

        LocalDate startDate;

        if ("30D".equalsIgnoreCase(period)) {

            startDate = endDate.minusDays(29);

        } else {

            // Default = 7 days
            startDate = endDate.minusDays(6);
        }

        return repository
                .findByCropNameAndRecordedDateBetweenOrderByRecordedDateAsc(
                        cropName,
                        startDate,
                        endDate
                );
    }

    // =====================================================
    // GET ALL HISTORY
    // =====================================================

    public List<MarketPriceHistory> getAllHistory() {

        return repository.findAll();
    }
}