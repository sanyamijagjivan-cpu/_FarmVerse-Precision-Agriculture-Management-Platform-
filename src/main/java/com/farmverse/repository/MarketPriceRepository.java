package com.farmverse.repository;

import com.farmverse.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketPriceRepository
        extends JpaRepository<MarketPrice, Long>{
}
