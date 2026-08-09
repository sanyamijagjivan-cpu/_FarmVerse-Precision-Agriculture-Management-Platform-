package com.farmverse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "market_prices")
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cropName;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String marketName;

    public MarketPrice() {
    }

    public MarketPrice(
            Long id,
            String cropName,
            double price,
            String marketName) {

        this.id = id;
        this.cropName = cropName;
        this.price = price;
        this.marketName = marketName;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getMarketName() {
        return marketName;
    }

    public void setMarketName(String marketName) {
        this.marketName = marketName;
    }
}
