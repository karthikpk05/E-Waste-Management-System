package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
//@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    // Basic chat endpoint (compatible with your existing frontend)
    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        try {
            String userMessage = payload.get("message");

            if (userMessage == null || userMessage.trim().isEmpty()) {
                return Map.of("response", "Please provide a message.");
            }

            String botResponse = chatbotService.getChatbotResponse(userMessage);
            return Map.of("response", botResponse);

        } catch (Exception e) {
            System.err.println("❌ Chat endpoint error: " + e.getMessage());
            e.printStackTrace();

            return Map.of("response",
                    "I'm here to help! You can ask me about:\n\n" +
                            "• Requesting e-waste pickups\n" +
                            "• Tracking your requests\n" +
                            "• Login and registration\n" +
                            "• What items we accept\n" +
                            "• Customer support\n\n" +
                            "What would you like to know?"
            );
        }
    }

    // Enhanced chat endpoint with actions and quick replies
    @PostMapping("/enhanced")
    public ResponseEntity<Map<String, Object>> enhancedChat(@RequestBody Map<String, Object> payload) {
        try {
            String userMessage = (String) payload.get("message");

            if (userMessage == null || userMessage.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("response", "Please provide a message.");
                errorResponse.put("intent", "error");
                errorResponse.put("quickReplies", Arrays.asList(
                        Map.of("text", "Get Help", "action", "general_help")
                ));
                errorResponse.put("status", "success");
                errorResponse.put("timestamp", new Date());

                return ResponseEntity.ok(errorResponse);
            }

            System.out.println("📩 Received message: " + userMessage);

            // Use the service to get response with actions
            Map<String, Object> serviceResponse = chatbotService.getChatbotResponseWithActions(userMessage);

            System.out.println("✅ Generated response: " + serviceResponse.get("response"));

            // Create a new mutable HashMap and copy all data
            Map<String, Object> response = new HashMap<>(serviceResponse);

            // Now we can safely add metadata
            response.put("timestamp", new Date());
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Enhanced chat error: " + e.getMessage());
            e.printStackTrace();

            // Create mutable map for error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("response",
                    "I'm here to help with your E-Waste management needs! What would you like to know about?\n\n" +
                            "• Requesting pickups\n" +
                            "• Tracking requests\n" +
                            "• Accepted items\n" +
                            "• Login/registration");
            errorResponse.put("intent", "general_help");
            errorResponse.put("quickReplies", Arrays.asList(
                    Map.of("text", "Request Pickup 📦", "action", "pickup_request"),
                    Map.of("text", "Track Request 📍", "action", "track_request"),
                    Map.of("text", "What Items? ♻️", "action", "items_info"),
                    Map.of("text", "Get Help 🎧", "action", "support")
            ));
            errorResponse.put("status", "success");
            errorResponse.put("timestamp", new Date());

            return ResponseEntity.ok(errorResponse);
        }
    }

    // Chat with user context (for logged-in users)
    @PostMapping("/contextual")
    public ResponseEntity<Map<String, Object>> contextualChat(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        try {
            String userMessage = (String) payload.get("message");
            Map<String, Object> context = (Map<String, Object>) payload.getOrDefault("context", new HashMap<>());

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                context.put("authenticated", true);
            }

            String response = chatbotService.getChatbotResponseWithContext(userMessage, context);

            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("context", context);
            result.put("timestamp", new Date());
            result.put("status", "success");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("❌ Contextual chat error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("response", "How can I help you today?");
            errorResponse.put("status", "success");
            errorResponse.put("timestamp", new Date());

            return ResponseEntity.ok(errorResponse);
        }
    }

    // Intent detection endpoint
    @PostMapping("/intent")
    public ResponseEntity<Map<String, Object>> detectIntent(@RequestBody Map<String, String> payload) {
        try {
            String userMessage = payload.get("message");
            String intent = chatbotService.detectIntent(userMessage);

            Map<String, Object> result = new HashMap<>();
            result.put("message", userMessage);
            result.put("intent", intent);
            result.put("confidence", getIntentConfidence(userMessage, intent));
            result.put("timestamp", new Date());

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", payload.get("message"));
            errorResponse.put("intent", "general");
            errorResponse.put("confidence", 0.5);
            errorResponse.put("timestamp", new Date());

            return ResponseEntity.ok(errorResponse);
        }
    }

    // Health check for chatbot service
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("service", "E-Waste Management Chatbot");
        health.put("version", "2.0.0");
        health.put("timestamp", new Date());
        health.put("mode", "fallback_enabled");
        health.put("capabilities", Arrays.asList(
                "General conversation",
                "Intent detection",
                "Context-aware responses",
                "Quick actions",
                "Multi-role support",
                "Fallback responses (no OpenAI required)"
        ));

        return ResponseEntity.ok(health);
    }

    // Get available intents
    @GetMapping("/intents")
    public ResponseEntity<Map<String, Object>> getAvailableIntents() {
        Map<String, Object> result = new HashMap<>();
        result.put("intents", Arrays.asList(
                Map.of("name", "greeting", "description", "Welcome and introduction messages"),
                Map.of("name", "pickup_request", "description", "E-waste pickup scheduling"),
                Map.of("name", "items_info", "description", "Information about accepted items"),
                Map.of("name", "track_request", "description", "Request status tracking"),
                Map.of("name", "login", "description", "User authentication guidance"),
                Map.of("name", "register", "description", "New user registration help"),
                Map.of("name", "support", "description", "Customer support assistance"),
                Map.of("name", "ewaste_info", "description", "E-waste and environmental information"),
                Map.of("name", "admin", "description", "Admin panel guidance"),
                Map.of("name", "pickup_operations", "description", "Pickup person operations"),
                Map.of("name", "general_help", "description", "General help and capabilities"),
                Map.of("name", "general", "description", "General conversation and queries")
        ));
        result.put("timestamp", new Date());

        return ResponseEntity.ok(result);
    }

    // Conversation starters endpoint
    @GetMapping("/starters")
    public ResponseEntity<Map<String, Object>> getConversationStarters() {
        Map<String, Object> result = new HashMap<>();
        result.put("starters", Arrays.asList(
                Map.of("text", "How do I request an e-waste pickup?", "category", "pickup"),
                Map.of("text", "I have 3 laptops and 5 phones to dispose", "category", "pickup"),
                Map.of("text", "Track my pickup request", "category", "tracking"),
                Map.of("text", "What items can I recycle?", "category", "info"),
                Map.of("text", "What is e-waste?", "category", "info"),
                Map.of("text", "How do I create an account?", "category", "account"),
                Map.of("text", "Contact customer support", "category", "support"),
                Map.of("text", "What can you help me with?", "category", "help")
        ));
        result.put("timestamp", new Date());

        return ResponseEntity.ok(result);
    }

    // Feedback endpoint for chatbot responses
    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> payload) {
        String messageId = (String) payload.get("messageId");
        String rating = (String) payload.get("rating");
        String comment = (String) payload.getOrDefault("comment", "");

        System.out.println("📊 Feedback received: " + rating + " for message " + messageId);
        if (!comment.isEmpty()) {
            System.out.println("💬 Comment: " + comment);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", "Thank you for your feedback!");
        result.put("timestamp", new Date());

        return ResponseEntity.ok(result);
    }

    // Test endpoint to verify controller is working
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "working");
        result.put("message", "Chatbot controller is functioning correctly");
        result.put("timestamp", new Date());

        return ResponseEntity.ok(result);
    }

    // Helper method to calculate intent confidence
    private double getIntentConfidence(String userMessage, String intent) {
        String msg = userMessage.toLowerCase();

        switch (intent) {
            case "greeting":
                return msg.matches(".*(hello|hi|hey).*") ? 0.95 : 0.7;
            case "pickup_request":
                return (msg.contains("pickup") || msg.contains("collect") || msg.contains("laptop") || msg.contains("phone")) ? 0.9 : 0.6;
            case "track_request":
                return (msg.contains("track") || msg.contains("status")) ? 0.85 : 0.6;
            case "items_info":
                return (msg.contains("items") || msg.contains("accept") || msg.contains("what")) ? 0.85 : 0.6;
            default:
                return 0.5;
        }
    }
}
