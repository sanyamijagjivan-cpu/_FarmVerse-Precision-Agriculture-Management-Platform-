package com.farmverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AgmarknetService {

    private final WebClient webClient;

    @Value("${data.gov.api.key}")
    private String apiKey;

    public AgmarknetService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://api.data.gov.in")
                .build();
    }

    public String getMarketPrices(
            String state,
            String district,
            String market) {

        return webClient.get()
                .uri(uriBuilder -> {

                    uriBuilder
                            .path("/resource/9ef84268-d588-465a-a308-a864a43d0070")
                            .queryParam("api-key", apiKey)
                            .queryParam("format", "json")
                            .queryParam("limit", 100);

                    if (state != null && !state.isBlank()) {
                        uriBuilder.queryParam(
                                "filters[state]",
                                state
                        );
                    }

                    if (district != null && !district.isBlank()) {
                        uriBuilder.queryParam(
                                "filters[district]",
                                district
                        );
                    }

                    if (market != null && !market.isBlank()) {
                        uriBuilder.queryParam(
                                "filters[market]",
                                market
                        );
                    }

                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}