
package com.farmverse.controller;

import com.farmverse.service.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiAssistantService;

    // =====================================================
    // NORMAL AI ASSISTANT
    // General friendly AI
    // =====================================================

    @PostMapping("/ask")
    public String askAssistant(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return "Please provide a question.";
        }

        return aiAssistantService.askGeneralAssistant(question);
    }


    // =====================================================
    // FARMING AI ASSISTANT
    // Agriculture related only
    // =====================================================

    @PostMapping("/farming")
    public String askFarmingAssistant(
            @RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return "Please provide a farming question.";
        }

        return aiAssistantService.askFarmingAssistant(question);
    }
}
