package com.farmverse.controller;

import com.farmverse.entity.Irrigation;
import com.farmverse.service.IrrigationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/irrigation")
@CrossOrigin(origins = "http://localhost:5173")
public class IrrigationController {

    private final IrrigationService irrigationService;

    public IrrigationController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    // ==============================
    // ADD IRRIGATION SCHEDULE
    // ==============================

    @PostMapping
    public ResponseEntity<Irrigation> createIrrigation(
            @RequestBody Irrigation irrigation,
            @RequestParam Long farmId,
            Authentication authentication) {

        Irrigation saved = irrigationService.createIrrigation(
                irrigation,
                farmId,
                authentication
        );

        return ResponseEntity.ok(saved);
    }

    // ==============================
    // GET IRRIGATION FOR FARM
    // ==============================

    @GetMapping("/farm/{farmId}")
    public ResponseEntity<List<Irrigation>> getIrrigationByFarm(
            @PathVariable Long farmId,
            Authentication authentication) {

        List<Irrigation> irrigations =
                irrigationService.getIrrigationByFarm(
                        farmId,
                        authentication
                );

        return ResponseEntity.ok(irrigations);
    }

    // ==============================
    // GET SINGLE IRRIGATION
    // ==============================

    @GetMapping("/{id}")
    public ResponseEntity<Irrigation> getIrrigation(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                irrigationService.getIrrigation(
                        id,
                        authentication
                )
        );
    }

    // ==============================
    // UPDATE IRRIGATION
    // ==============================

    @PutMapping("/{id}")
    public ResponseEntity<Irrigation> updateIrrigation(
            @PathVariable Long id,
            @RequestParam Long farmId,
            @RequestBody Irrigation irrigation,
            Authentication authentication) {

        Irrigation updated =
                irrigationService.updateIrrigation(
                        id,
                        irrigation,
                        farmId,
                        authentication
                );

        return ResponseEntity.ok(updated);
    }

    // ==============================
    // DELETE IRRIGATION
    // ==============================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIrrigation(
            @PathVariable Long id,
            Authentication authentication) {

        irrigationService.deleteIrrigation(
                id,
                authentication
        );

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Irrigation deleted successfully"
                )
        );
    }
}