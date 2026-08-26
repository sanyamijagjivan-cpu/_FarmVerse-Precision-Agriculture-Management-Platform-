package com.farmverse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "market_price_history")
public class MarketPriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cropName;

    @Column(nullable = false)
    private String marketName;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private LocalDate recordedDate;

    public MarketPriceHistory() {
    }

    public MarketPriceHistory(
            Long id,
            String cropName,
            String marketName,
            double price,
            LocalDate recordedDate) {

        this.id = id;
        this.cropName = cropName;
        this.marketName = marketName;
        this.price = price;
        this.recordedDate = recordedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getMarketName() {
        return marketName;
    }

    public void setMarketName(String marketName) {
        this.marketName = marketName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public LocalDate getRecordedDate() {
        return recordedDate;
    }

    public void setRecordedDate(LocalDate recordedDate) {
        this.recordedDate = recordedDate;
    }
}