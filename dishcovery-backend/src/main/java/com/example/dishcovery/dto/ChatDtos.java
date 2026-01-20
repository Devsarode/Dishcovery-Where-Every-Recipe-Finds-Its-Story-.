package com.example.dishcovery.dto;

public class ChatDtos {

    // --- Request ---
    public static class ChatRequest {
        private String prompt;

        public String getPrompt() { return prompt; }
        public void setPrompt(String prompt) { this.prompt = prompt; }
    }

    // --- Response ---
    public static class ChatResponse {
        private String reply;

        public ChatResponse(String reply) { this.reply = reply; }

        public String getReply() { return reply; }
    }
}
