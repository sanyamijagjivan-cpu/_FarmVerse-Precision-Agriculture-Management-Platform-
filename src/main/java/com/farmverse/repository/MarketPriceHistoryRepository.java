package com.farmverse.repository;

import com.farmverse.entity.MarketPriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MarketPriceHistoryRepository
        extends JpaRepository<MarketPriceHistory, Long> {

    List<MarketPriceHistory> findByCropNameAndRecordedDateBetweenOrderByRecordedDateAsc(
            String cropName,
            LocalDate startDate,
            LocalDate endDate
    );
}