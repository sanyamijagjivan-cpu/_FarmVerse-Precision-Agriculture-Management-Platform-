package com.farmverse.controller;

import com.farmverse.entity.MarketPrice;
import com.farmverse.service.MarketPriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-prices")
public class MarketPriceController {

    private final MarketPriceService marketPriceService;

    public MarketPriceController(
            MarketPriceService marketPriceService) {

        this.marketPriceService = marketPriceService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<MarketPrice> createMarketPrice(
            @RequestBody MarketPrice marketPrice) {

        MarketPrice savedMarketPrice =
                marketPriceService.createMarketPrice(marketPrice);

        return ResponseEntity.ok(savedMarketPrice);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<MarketPrice>> getAllMarketPrices() {

        return ResponseEntity.ok(
                marketPriceService.getAllMarketPrices()
        );
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<MarketPrice> getMarketPriceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                marketPriceService.getMarketPriceById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MarketPrice> updateMarketPrice(
            @PathVariable Long id,
            @RequestBody MarketPrice marketPrice) {

        return ResponseEntity.ok(
                marketPriceService.updateMarketPrice(
                        id,
                        marketPrice
                )
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarketPrice(
            @PathVariable Long id) {

        marketPriceService.deleteMarketPrice(id);

        return ResponseEntity.noContent().build();
    }
}
