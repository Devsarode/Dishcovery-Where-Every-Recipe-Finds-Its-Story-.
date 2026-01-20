package com.example.dishcovery.controller;

import com.example.dishcovery.dto.ChatDtos.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@RequestBody ChatRequest req) {
        String q = req.getPrompt() == null ? "" : req.getPrompt().toLowerCase();

        String answer;
        if (q.contains("paneer")) {
            answer = "Try 'Paneer Tikka Masala': marinate paneer with yogurt, chili, garam masala; grill; simmer in tomato-cashew gravy.";
        } else if (q.contains("quick") || q.contains("under 15")) {
            answer = "Quick idea: Garlic butter pasta — cook pasta, reserve water, toss with butter, garlic, chili flakes, parsley.";
        } else if (q.contains("vegan")) {
            answer = "Vegan pick: Chickpea & spinach curry — onion, garlic, ginger, tomatoes, spices; add chickpeas & spinach.";
        } else {
            answer = "Tell me ingredients or cuisine (e.g., 'eggs + tomato', 'South Indian breakfast'), and I’ll suggest a recipe.";
        }

        return ResponseEntity.ok(new ChatResponse(answer));
    }
}
