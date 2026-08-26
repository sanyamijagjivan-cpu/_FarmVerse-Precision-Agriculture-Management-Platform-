package com.farmverse.controller;

import com.farmverse.entity.MarketPriceHistory;
import com.farmverse.service.MarketPriceHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market-price-history")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketPriceHistoryController {

    private final MarketPriceHistoryService service;

    public MarketPriceHistoryController(
            MarketPriceHistoryService service) {

        this.service = service;
    }

    // CREATE HISTORY RECORD
    @PostMapping
    public ResponseEntity<MarketPriceHistory> createHistory(
            @RequestBody MarketPriceHistory history) {

        return ResponseEntity.ok(
                service.createHistory(history)
        );
    }

    // GET 7D / 30D HISTORY
    @GetMapping("/{cropName}")
    public ResponseEntity<List<MarketPriceHistory>> getHistory(
            @PathVariable String cropName,
            @RequestParam(defaultValue = "7D") String period) {

        return ResponseEntity.ok(
                service.getHistory(cropName, period)
        );
    }

    // GET ALL HISTORY
    @GetMapping
    public ResponseEntity<List<MarketPriceHistory>> getAllHistory() {

        return ResponseEntity.ok(
                service.getAllHistory()
        );
    }
}