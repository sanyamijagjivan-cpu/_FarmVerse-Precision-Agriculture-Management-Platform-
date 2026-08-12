package com.farmverse.controller;

import com.farmverse.service.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @PostMapping("/ask")
    public String askAssistant(@RequestBody Map<String, String> request) {

        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return "Please provide a question.";
        }

        return aiAssistantService.askAssistant(question);
    }
}