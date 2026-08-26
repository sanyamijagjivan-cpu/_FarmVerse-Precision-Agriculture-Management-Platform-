package com.farmverse.controller;

import com.farmverse.service.AgmarknetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agmarknet")
@CrossOrigin(origins = "http://localhost:5173")
public class AgmarknetController {

    private final AgmarknetService agmarknetService;

    public AgmarknetController(AgmarknetService agmarknetService) {
        this.agmarknetService = agmarknetService;
    }

    @GetMapping("/market-prices")
    public ResponseEntity<String> getMarketPrices(
            @RequestParam String state,
            @RequestParam String district,
            @RequestParam(required = false) String market) {

        return ResponseEntity.ok(
                agmarknetService.getMarketPrices(
                        state,
                        district,
                        market
                )
        );
    }
}