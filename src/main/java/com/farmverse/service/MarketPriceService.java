package com.farmverse.service;

import com.farmverse.entity.MarketPrice;
import com.farmverse.repository.MarketPriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketPriceService {

    private final MarketPriceRepository marketPriceRepository;

    public MarketPriceService(
            MarketPriceRepository marketPriceRepository) {

        this.marketPriceRepository = marketPriceRepository;
    }

    // CREATE
    public MarketPrice createMarketPrice(
            MarketPrice marketPrice) {

        return marketPriceRepository.save(marketPrice);
    }

    // READ ALL
    public List<MarketPrice> getAllMarketPrices() {

        return marketPriceRepository.findAll();
    }

    // READ ONE
    public MarketPrice getMarketPriceById(Long id) {

        return marketPriceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Market price not found with id: " + id
                        ));
    }

    // UPDATE
    public MarketPrice updateMarketPrice(
            Long id,
            MarketPrice updatedMarketPrice) {

        MarketPrice existingMarketPrice =
                marketPriceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Market price not found with id: "
                                                + id
                                ));

        existingMarketPrice.setCropName(
                updatedMarketPrice.getCropName()
        );

        existingMarketPrice.setPrice(
                updatedMarketPrice.getPrice()
        );

        existingMarketPrice.setMarketName(
                updatedMarketPrice.getMarketName()
        );

        return marketPriceRepository.save(
                existingMarketPrice
        );
    }

    // DELETE
    public void deleteMarketPrice(Long id) {

        if (!marketPriceRepository.existsById(id)) {

            throw new RuntimeException(
                    "Market price not found with id: " + id
            );
        }

        marketPriceRepository.deleteById(id);
    }
}
