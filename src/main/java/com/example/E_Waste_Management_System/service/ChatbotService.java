package com.example.E_Waste_Management_System.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatbotService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String SYSTEM_PROMPT = """
            You are a helpful virtual assistant for an E-Waste Management System. Your role is to assist users with:
            
            FOR USERS:
            - Explain how to request e-waste pickup services
            - Help track pickup request status
            - Guide through registration and login processes
            - Provide information about accepted e-waste items (phones, laptops, tablets, computers, TVs, monitors, printers, batteries, chargers, cables, etc.)
            - Answer questions about recycling and environmental benefits
            
            FOR PICKUP PERSONS:
            - Assist with viewing assigned pickups
            - Guide through pickup completion process
            - Help with OTP verification
            - Provide route and scheduling information
            
            FOR ADMINS:
            - Help navigate admin dashboard
            - Explain user and request management features
            - Assist with analytics and reporting
            
            ACCEPTED E-WASTE ITEMS:
            - Mobile devices: phones, tablets, smartwatches
            - Computers: laptops, desktops, monitors, keyboards, mice
            - TVs and displays: LED, LCD, CRT TVs, projectors
            - Accessories: chargers, cables, power banks, headphones
            - Office equipment: printers, scanners, fax machines
            - Gaming: consoles, controllers
            - Batteries: all types
            - Any electronic device that plugs in or uses batteries
            
            PICKUP PROCESS:
            1. User registers/logs in to the system
            2. User submits pickup request with item details
            3. User selects preferred date and time
            4. System assigns a pickup person
            5. Pickup person collects items at scheduled time
            6. User receives confirmation and receipt
            
            TYPICAL TIMELINE:
            - Pickup requests are usually scheduled within 2-3 business days
            - Same-day pickup may be available for urgent requests
            - Pickup persons typically arrive within a 2-hour window
            
            Always be helpful, friendly, and guide users to the appropriate actions. Keep responses conversational and concise.
            """;

    public String getChatbotResponse(String userMessage) {
        // Check if OpenAI API key is configured
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_API_KEY_HERE")) {
            System.out.println("⚠️ OpenAI API key not configured, using fallback responses");
            return handleFallbackResponse(userMessage);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            List<Map<String, String>> messages = Arrays.asList(
                    Map.of("role", "system", "content", SYSTEM_PROMPT),
                    Map.of("role", "user", "content", userMessage)
            );

            Map<String, Object> body = Map.of(
                    "model", "gpt-3.5-turbo",
                    "messages", messages,
                    "max_tokens", 300,
                    "temperature", 0.7,
                    "presence_penalty", 0.1,
                    "frequency_penalty", 0.1
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            Map response = restTemplate.postForObject(url, request, Map.class);

            var choices = (List<Map<String, Object>>) response.get("choices");
            var message = (Map<String, Object>) choices.get(0).get("message");

            return message.get("content").toString();

        } catch (Exception e) {
            System.err.println("❌ OpenAI API Error: " + e.getMessage());
            return handleFallbackResponse(userMessage);
        }
    }

    public String detectIntent(String userMessage) {
        String msg = userMessage.toLowerCase();

        // Greeting intents
        if (msg.matches(".*(hello|hi|hey|good morning|good afternoon|good evening).*")) {
            return "greeting";
        }

        // Pickup request intents
        if (msg.matches(".*(pickup|collect|request|schedule|book|dispose|get rid).*")) {
            return "pickup_request";
        }

        // Item information intents
        if (msg.matches(".*(what.*items|what.*accept|what.*collect|what.*take|laptop|phone|computer|tv|battery|printer|monitor|device|electronic).*")) {
            return "items_info";
        }

        // Tracking intents
        if (msg.matches(".*(track|status|where|when|progress|update|check.*request).*")) {
            return "track_request";
        }

        // Login intents
        if (msg.matches(".*(login|sign in|access|account).*")) {
            return "login";
        }

        // Registration intents
        if (msg.matches(".*(register|sign up|create account|join).*")) {
            return "register";
        }

        // Support intents
        if (msg.matches(".*(help|support|problem|issue|contact).*")) {
            return "support";
        }

        // E-waste information intents
        if (msg.matches(".*(what.*e-?waste|what.*electronic waste|why.*recycle|environment|benefit).*")) {
            return "ewaste_info";
        }

        // Admin intents
        if (msg.matches(".*(admin|manage|dashboard|analytics|report).*")) {
            return "admin";
        }

        // Pickup person intents
        if (msg.matches(".*(complete|finish|otp|verify|pickup person|driver|collector).*")) {
            return "pickup_operations";
        }

        // General help intent
        if (msg.matches(".*(what.*help|what.*do|capabilities|features).*")) {
            return "general_help";
        }

        return "general";
    }

    public String getContextualResponse(String userMessage, String intent) {
        switch (intent) {
            case "greeting":
                return "👋 Hello! Welcome to our E-Waste Management System! I can help you with:\n\n" +
                        "📦 **Request a Pickup** - Schedule e-waste collection\n" +
                        "📍 **Track Requests** - Check your pickup status\n" +
                        "🔐 **Account Help** - Login or registration assistance\n" +
                        "♻️ **Learn About E-Waste** - Environmental impact & accepted items\n" +
                        "🎧 **Get Support** - Contact our team\n\n" +
                        "What would you like to do today?";

            case "general_help":
                return "I can help you with:\n\n" +
                        "✅ Request e-waste pickup (phones, laptops, TVs, batteries, etc.)\n" +
                        "✅ Track your pickup requests\n" +
                        "✅ Login or create an account\n" +
                        "✅ Learn what items we accept\n" +
                        "✅ Understand the pickup process\n" +
                        "✅ Contact customer support\n" +
                        "✅ Guide for pickup persons and admins\n\n" +
                        "Just ask me anything! For example: \"I have 3 laptops to dispose\" or \"How do I track my request?\"";

            case "pickup_request":
                String items = extractItems(userMessage);
                String timing = extractTiming(userMessage);

                String response = "📦 Great! I can help you schedule a pickup for your e-waste.\n\n";

                if (!items.isEmpty()) {
                    response += "**Items detected:** " + items + "\n\n";
                }

                if (!timing.isEmpty()) {
                    response += "**Preferred time:** " + timing + "\n\n";
                }

                response += "**To proceed:**\n" +
                        "1️⃣ Login to your account (or register if new)\n" +
                        "2️⃣ Go to 'Request Pickup' page\n" +
                        "3️⃣ Select your items and preferred date/time\n" +
                        "4️⃣ Provide pickup address\n" +
                        "5️⃣ Submit request\n\n" +
                        "We typically schedule pickups within 2-3 business days. " +
                        "You'll receive confirmation via SMS and email!";

                return response;

            case "items_info":
                return "♻️ **We Accept All Types of E-Waste:**\n\n" +
                        "📱 **Mobile Devices:**\n" +
                        "• Smartphones, feature phones, tablets\n" +
                        "• Smartwatches, fitness trackers, e-readers\n\n" +
                        "💻 **Computing Equipment:**\n" +
                        "• Laptops, desktops, servers\n" +
                        "• Keyboards, mice, webcams, hard drives\n\n" +
                        "📺 **Display Devices:**\n" +
                        "• LED/LCD/CRT TVs, monitors, projectors\n\n" +
                        "🔌 **Accessories:**\n" +
                        "• Chargers, power banks, cables, adapters\n" +
                        "• Headphones, speakers, earphones\n\n" +
                        "🖨️ **Office Equipment:**\n" +
                        "• Printers, scanners, fax machines, shredders\n\n" +
                        "🎮 **Gaming & Entertainment:**\n" +
                        "• Game consoles, controllers, remote controls\n\n" +
                        "🔋 **Batteries:**\n" +
                        "• All types - rechargeable and non-rechargeable\n\n" +
                        "✅ Items can be working or broken - we accept them all!";

            case "track_request":
                return "📍 **Track Your Pickup Request:**\n\n" +
                        "**Step 1:** Login to your account\n" +
                        "**Step 2:** Navigate to 'My Requests' section\n" +
                        "**Step 3:** View all your requests and their status\n\n" +
                        "**Request Status Meanings:**\n" +
                        "• ⏳ **Pending** - Request received, awaiting assignment\n" +
                        "• 👤 **Assigned** - Pickup person assigned to your request\n" +
                        "• 🚛 **In Progress** - Pickup person is on the way\n" +
                        "• ✅ **Completed** - Items successfully collected\n\n" +
                        "You'll also receive SMS and email notifications for status updates!";

            case "login":
                return "🔐 **Login to Your Account:**\n\n" +
                        "We have 3 types of accounts:\n\n" +
                        "**👤 User Account:**\n" +
                        "• For residents requesting pickups\n" +
                        "• Access: /login\n\n" +
                        "**🚛 Pickup Person Account:**\n" +
                        "• For collection staff\n" +
                        "• Access: /pickup/login\n\n" +
                        "**👨‍💼 Admin Account:**\n" +
                        "• For system administrators\n" +
                        "• Access: /admin/login\n\n" +
                        "Which type of account do you need to access?";

            case "register":
                return "📝 **Create Your Free Account:**\n\n" +
                        "**Benefits of Registration:**\n" +
                        "✅ Schedule e-waste pickups anytime\n" +
                        "✅ Track all your requests\n" +
                        "✅ Receive SMS/email notifications\n" +
                        "✅ Earn eco-points for recycling\n" +
                        "✅ View environmental impact reports\n\n" +
                        "**Registration is quick and free!**\n" +
                        "Visit /register to create your account in just 2 minutes.";

            case "ewaste_info":
                return "♻️ **What is E-Waste?**\n\n" +
                        "E-waste (electronic waste) refers to discarded electrical or electronic devices. " +
                        "India generates over 3.2 million tonnes of e-waste annually!\n\n" +
                        "**Why Recycle E-Waste?**\n" +
                        "🌍 **Environmental Protection:**\n" +
                        "• Prevents toxic materials (lead, mercury) from contaminating soil/water\n" +
                        "• Reduces carbon footprint\n\n" +
                        "♻️ **Resource Recovery:**\n" +
                        "• Recovers valuable metals (gold, silver, copper)\n" +
                        "• 95% of materials can be recycled\n\n" +
                        "🏆 **Your Impact:**\n" +
                        "• Every 1kg e-waste recycled saves 2kg CO₂\n" +
                        "• Supports circular economy\n\n" +
                        "**Our Process:**\n" +
                        "✅ Certified recycling facility\n" +
                        "✅ Zero landfill disposal\n" +
                        "✅ Secure data destruction\n" +
                        "✅ Environmentally safe processing";

            case "support":
                return "🎧 **Customer Support:**\n\n" +
                        "📞 **Phone:** 1800-E-WASTE (1800-392783)\n" +
                        "⏰ Available 24/7\n\n" +
                        "📧 **Email:** support@ewaste-management.com\n" +
                        "⏰ Response within 2 hours\n\n" +
                        "💬 **Live Chat:** Monday-Saturday, 9 AM - 6 PM\n\n" +
                        "🌍 **Regional Support:** Available in Hindi, English, Tamil, Telugu\n\n" +
                        "How can we assist you today?";

            case "admin":
                return "👨‍💼 **Admin Panel Features:**\n\n" +
                        "📊 **Dashboard:** Real-time analytics and metrics\n" +
                        "👥 **User Management:** Manage all user accounts\n" +
                        "🚛 **Pickup Management:** Assign and track pickup persons\n" +
                        "📋 **Request Management:** View and manage all requests\n" +
                        "📈 **Reports:** Generate analytics and performance reports\n" +
                        "⚙️ **Configuration:** System settings and preferences\n\n" +
                        "**Access:** Visit /admin/login with your admin credentials.";

            case "pickup_operations":
                return "🚛 **For Pickup Persons:**\n\n" +
                        "**Daily Operations:**\n" +
                        "📋 View assigned pickups for the day\n" +
                        "🗺️ Optimized route planning\n" +
                        "📱 Customer contact information\n" +
                        "✅ Mark pickups as completed\n" +
                        "🔢 OTP verification system\n\n" +
                        "**Pickup Process:**\n" +
                        "1. Login to pickup person dashboard\n" +
                        "2. View your assigned pickups\n" +
                        "3. Navigate to customer location\n" +
                        "4. Verify customer OTP\n" +
                        "5. Collect and weigh items\n" +
                        "6. Provide pickup receipt\n" +
                        "7. Mark as completed in system\n\n" +
                        "**Access:** /pickup/login";

            default:
                return "I'm here to help with your E-Waste management needs! You can ask me about:\n\n" +
                        "• Requesting pickups\n" +
                        "• Tracking requests\n" +
                        "• Accepted items\n" +
                        "• Login/registration\n" +
                        "• Environmental impact\n\n" +
                        "What would you like to know?";
        }
    }

    private String handleFallbackResponse(String userMessage) {
        String intent = detectIntent(userMessage);
        return getContextualResponse(userMessage, intent);
    }

    private String extractItems(String message) {
        List<String> foundItems = new ArrayList<>();
        String msg = message.toLowerCase();

        if (msg.contains("laptop")) foundItems.add(countItems(msg, "laptop") + " laptop(s)");
        if (msg.contains("phone")) foundItems.add(countItems(msg, "phone") + " phone(s)");
        if (msg.contains("tablet")) foundItems.add(countItems(msg, "tablet") + " tablet(s)");
        if (msg.contains("tv") || msg.contains("television")) foundItems.add("TV(s)");
        if (msg.contains("computer")) foundItems.add(countItems(msg, "computer") + " computer(s)");
        if (msg.contains("printer")) foundItems.add(countItems(msg, "printer") + " printer(s)");
        if (msg.contains("monitor")) foundItems.add(countItems(msg, "monitor") + " monitor(s)");
        if (msg.contains("battery") || msg.contains("batteries")) foundItems.add("batteries");

        return String.join(", ", foundItems);
    }

    private String countItems(String message, String item) {
        // Try to extract number before the item name
        String pattern = "(\\d+)\\s+" + item;
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(message);
        if (m.find()) {
            return m.group(1);
        }
        return "some";
    }

    private String extractTiming(String message) {
        String msg = message.toLowerCase();

        if (msg.contains("friday")) {
            if (msg.contains("afternoon")) return "Friday afternoon";
            if (msg.contains("morning")) return "Friday morning";
            if (msg.contains("evening")) return "Friday evening";
            return "Friday";
        }
        if (msg.contains("monday")) return "Monday";
        if (msg.contains("tuesday")) return "Tuesday";
        if (msg.contains("wednesday")) return "Wednesday";
        if (msg.contains("thursday")) return "Thursday";
        if (msg.contains("saturday")) return "Saturday";
        if (msg.contains("sunday")) return "Sunday";
        if (msg.contains("today")) return "today";
        if (msg.contains("tomorrow")) return "tomorrow";
        if (msg.contains("weekend")) return "this weekend";

        return "";
    }

    public Map<String, Object> getChatbotResponseWithActions(String userMessage) {
        String intent = detectIntent(userMessage);
        String response = getContextualResponse(userMessage, intent);
        List<Map<String, String>> quickReplies = getQuickRepliesForIntent(intent);

        return Map.of(
                "response", response,
                "intent", intent,
                "quickReplies", quickReplies
        );
    }

    private List<Map<String, String>> getQuickRepliesForIntent(String intent) {
        switch (intent) {
            case "greeting":
            case "general_help":
                return Arrays.asList(
                        Map.of("text", "Request Pickup 📦", "action", "pickup_request"),
                        Map.of("text", "Track Request 📍", "action", "track_request"),
                        Map.of("text", "Login 🔐", "action", "login"),
                        Map.of("text", "What Items? ♻️", "action", "items_info")
                );

            case "pickup_request":
                return Arrays.asList(
                        Map.of("text", "Start Request", "action", "redirect:/user/submit-request"),
                        Map.of("text", "Login First", "action", "login"),
                        Map.of("text", "What Items Accepted?", "action", "items_info")
                );

            case "items_info":
                return Arrays.asList(
                        Map.of("text", "Request Pickup Now", "action", "pickup_request"),
                        Map.of("text", "Learn More", "action", "ewaste_info")
                );

            case "track_request":
                return Arrays.asList(
                        Map.of("text", "View My Requests", "action", "redirect:/user/my-requests"),
                        Map.of("text", "Login", "action", "login"),
                        Map.of("text", "Call Support", "action", "tel:+918003927830")
                );

            case "login":
                return Arrays.asList(
                        Map.of("text", "User Login", "action", "redirect:/login"),
                        Map.of("text", "Pickup Person", "action", "redirect:/pickup/login"),
                        Map.of("text", "Admin Login", "action", "redirect:/admin/login")
                );

            case "register":
                return Arrays.asList(
                        Map.of("text", "Register Now", "action", "redirect:/register"),
                        Map.of("text", "Learn Benefits", "action", "general_help")
                );

            case "support":
                return Arrays.asList(
                        Map.of("text", "Call Support", "action", "tel:+918003927830"),
                        Map.of("text", "Send Email", "action", "mailto:support@ewaste-management.com")
                );

            case "ewaste_info":
                return Arrays.asList(
                        Map.of("text", "Request Pickup", "action", "pickup_request"),
                        Map.of("text", "What Items?", "action", "items_info")
                );

            default:
                return Arrays.asList(
                        Map.of("text", "Main Menu", "action", "greeting"),
                        Map.of("text", "Get Help", "action", "support")
                );
        }
    }

    public String getChatbotResponseWithContext(String userMessage, Map<String, Object> context) {
        return getChatbotResponse(userMessage);
    }
}


//package com.example.E_Waste_Management_System.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.*;
//
//@Service
//public class ChatbotService {
//
//    @Value("${openai.api.key}")
//    private String apiKey;
//
//    private static final String SYSTEM_PROMPT = """
//        You are a helpful virtual assistant for an E-Waste Management System.
//
//        SYSTEM OVERVIEW:
//        This is an e-waste collection and recycling platform that connects residents with pickup services.
//
//        KEY FEATURES:
//        - Users can schedule e-waste pickups online
//        - Track pickup requests in real-time
//        - Three user roles: Users (residents), Pickup Persons (collectors), and Admins
//        - Secure authentication with JWT tokens
//        - SMS/Email notifications
//        - Digital receipts and eco-points system
//
//        ACCEPTED E-WASTE ITEMS:
//        - Mobile phones, tablets, smartwatches
//        - Laptops, computers, keyboards, mice
//        - TVs, monitors, projectors
//        - Chargers, cables, power banks, adapters
//        - Printers, scanners, fax machines
//        - Batteries (all types - lithium, alkaline, lead-acid)
//        - Small kitchen appliances
//        - Audio equipment (headphones, speakers)
//
//        USER WORKFLOW:
//        1. Register/Login to account
//        2. Submit pickup request with item details and photos
//        3. Select preferred date and time
//        4. Wait for pickup person assignment (status: Pending → Assigned)
//        5. Pickup person arrives (status: In Progress)
//        6. Hand over items and verify with OTP
//        7. Receive digital receipt (status: Completed)
//
//        PICKUP PERSON WORKFLOW:
//        1. Login to pickup dashboard
//        2. View assigned pickups with customer details
//        3. Navigate to pickup location
//        4. Collect e-waste items
//        5. Get OTP from customer to verify collection
//        6. Mark pickup as completed
//
//        ADMIN CAPABILITIES:
//        - Manage users and pickup persons
//        - Assign pickups to available collectors
//        - View analytics and reports
//        - Monitor system performance
//        - Handle escalations
//
//        ENVIRONMENTAL IMPACT:
//        - Proper disposal prevents toxic chemicals from entering landfills
//        - Recovers valuable materials (gold, silver, copper, rare earth metals)
//        - Reduces carbon footprint through responsible recycling
//        - Users earn eco-points for each successful pickup
//
//        PRICING & SERVICE:
//        - Free pickup service for residential users
//        - All pickups are doorstep collection
//        - No minimum quantity required
//        - Service available 6 days a week (Monday-Saturday)
//        - Typical response time: 24-48 hours
//
//        SAFETY & SECURITY:
//        - All pickup persons are verified and trained
//        - Secure data destruction for storage devices
//        - Certificate of recycling provided on request
//        - GPS tracking for pickup persons
//        - Insurance coverage for valuable items
//
//        ANSWER GUIDELINES:
//        - Be conversational and friendly
//        - Answer questions directly based on the system information above
//        - If asked about specific user data (like "where is my pickup person"), explain they need to login to track
//        - For technical issues, guide users to appropriate features or support
//        - Use emojis appropriately to make responses engaging
//        - If you don't know something specific, be honest and direct to support
//        - Keep responses concise but informative (2-4 sentences ideal)
//
//        Always prioritize helping users accomplish their goals efficiently.
//        """;
//
//    public String getChatbotResponse(String userMessage) {
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//            String url = "https://api.openai.com/v1/chat/completions";
//
//            // Enhanced message structure with system context
//            List<Map<String, String>> messages = Arrays.asList(
//                    Map.of("role", "system", "content", SYSTEM_PROMPT),
//                    Map.of("role", "user", "content", userMessage)
//            );
//
//            Map<String, Object> body = Map.of(
//                    "model", "gpt-3.5-turbo",
//                    "messages", messages,
//                    "max_tokens", 300,
//                    "temperature", 0.7,
//                    "presence_penalty", 0.1,
//                    "frequency_penalty", 0.1
//            );
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            headers.setBearerAuth(apiKey);
//
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//            Map response = restTemplate.postForObject(url, request, Map.class);
//
//            var choices = (List<Map<String, Object>>) response.get("choices");
//            var message = (Map<String, Object>) choices.get(0).get("message");
//
//            return message.get("content").toString();
//
//        } catch (Exception e) {
//            return handleFallbackResponse(userMessage);
//        }
//    }
//
//    // Intent detection for better routing
//    public String detectIntent(String userMessage) {
//        String msg = userMessage.toLowerCase();
//
//        // Greeting intents
//        if (msg.matches(".*(hello|hi|hey|good morning|good afternoon|good evening|greetings|namaste).*")) {
//            return "greeting";
//        }
//
//        // 2. Specific service questions (BEFORE pickup_request)
//        if (msg.matches(".*(doorstep|do you.*provide|do you.*come|service area).*")) {
//            return "service_info";
//        }
//
//        // 3. Items/What to recycle (BEFORE pickup_request)
//        if (msg.matches(".*(what.*items|which.*items|what.*accept|can i.*recycle).*")) {
//            return "recyclable_items";
//        }
//
//        // 4. Pricing (BEFORE pickup_request)
//        if (msg.matches(".*(price|cost|charge|fee|free|how much).*")) {
//            return "pricing";
//        }
//
//        // Pickup request intents
//        if (msg.matches(".*(pickup|collect|request|schedule|book|dispose|recycle|want to give|donate).*") ||
//                msg.matches(".*(how to.*request|how do i.*pickup|schedule.*pickup).*")) {
//            return "pickup_request";
//        }
//
//        // Tracking intents
//        if (msg.matches(".*(track|status|where|when|progress|update|check.*request|my request|find.*order).*")) {
//            return "track_request";
//        }
//
//        // Items/What can be recycled
//        if (msg.matches(".*(what.*items|which.*items|what.*accept|what.*recycle|what.*e-waste|what.*electronic|can i.*recycle|accepted items|item list).*")) {
//            return "recyclable_items";
//        }
//
//        // Pricing/Cost
//        if (msg.matches(".*(price|cost|charge|fee|free|pay|money|how much).*")) {
//            return "pricing";
//        }
//
//        // Login intents
//        if (msg.matches(".*(login|sign in|log in|access|enter.*account).*")) {
//            return "login";
//        }
//
//        // Registration intents
//        if (msg.matches(".*(register|sign up|create account|new account|join|signup).*")) {
//            return "register";
//        }
//
//        // Support intents
//        if (msg.matches(".*(help|support|problem|issue|contact|emergency|complaint|not working).*")) {
//            return "support";
//        }
//
//        // How it works / Process
//        if (msg.matches(".*(how.*work|how.*process|explain|what.*procedure|steps|workflow).*")) {
//            return "how_it_works";
//        }
//
//        // Environment/Benefits
//        if (msg.matches(".*(environment|benefit|why.*recycle|eco|green|impact|pollution|save.*planet).*")) {
//            return "environmental_benefits";
//        }
//
//        // Safety/Security
//        if (msg.matches(".*(safe|secure|trust|verified|data.*protection|privacy|certificate).*")) {
//            return "safety_security";
//        }
//
//        // Service/Delivery questions - CHECK THIS BEFORE pickup_request
//        if (msg.matches(".*(doorstep|door step|home.*collection|come.*home|visit.*home|deliver|service area|coverage area).*") ||
//                msg.matches(".*(do you.*come|do you.*provide|do you.*offer).*")) {
//            return "service_info";
//        }
//
//        // Pickup request intents (keep existing)
//        if (msg.matches(".*(how to.*request|how do i.*pickup|schedule.*pickup|want.*pickup|book.*pickup).*")) {
//            return "pickup_request";
//        }
//
//        return "general";
//    }
//
//    // Contextual response based on intent
//    public String getContextualResponse(String userMessage, String intent) {
//        switch (intent) {
//            case "greeting":
//                return "👋 Hello! Welcome to our E-Waste Management System! I can help you with pickup requests, tracking, login, and more. What would you like to do today?";
//
//            case "pickup_request":
//                return "📦 I'd be happy to help you request an e-waste pickup! To get started, you'll need to:\n\n1. Login to your account\n2. Go to 'Request Pickup'\n3. Select your e-waste items\n4. Choose a convenient date and time\n5. Provide pickup address\n\nWould you like me to guide you to the pickup request form?";
//
//            case "track_request":
//                return "📍 To track your pickup request:\n\n1. Login to your account\n2. Go to 'My Requests'\n3. Enter your Request ID\n4. View real-time status updates\n\nYou can also receive SMS/email notifications. Do you have your Request ID ready?";
//
//            case "login":
//                return "🔐 I can help you access your account. We have different login portals:\n\n• User Login - For requesting pickups\n• Pickup Person Login - For collection staff\n• Admin Login - For system management\n\nWhich type of account do you need to access?";
//
//            case "register":
//                return "📝 Great! Creating an account will let you:\n\n✅ Schedule e-waste pickups\n✅ Track your requests\n✅ Earn eco-points for recycling\n✅ Get pickup notifications\n\nReady to register? I'll guide you to the registration form!";
//
//            case "support":
//                return "🎧 I'm here to help! For additional support:\n\n📞 Phone: +91-1800-EWASTE\n📧 Email: support@ewaste.com\n💬 Live Chat: 9 AM - 6 PM\n\nWhat specific issue can I help you with?";
//
//            case "admin":
//                return "👨‍💼 Admin features include:\n\n• User Management\n• Pickup Person Management\n• Request Management\n• Analytics & Reports\n• System Configuration\n\nPlease login with admin credentials to access these features.";
//
//            case "pickup_operations":
//                return "🚛 For pickup operations:\n\n• View assigned pickups\n• Complete pickup process\n• Verify customer OTP\n• Update pickup status\n• Route optimization\n\nLogin with your pickup person account to access these features.";
//
//            case "recyclable_items":
//                return "📱 We accept all types of e-waste:\n\n" +
//                        "✅ **Electronics:** Phones, tablets, laptops, computers\n" +
//                        "✅ **Accessories:** Chargers, cables, power banks, keyboards\n" +
//                        "✅ **Displays:** TVs, monitors, projectors\n" +
//                        "✅ **Batteries:** All types (lithium, alkaline, lead-acid)\n" +
//                        "✅ **Appliances:** Small kitchen items, printers, scanners\n" +
//                        "✅ **Audio:** Headphones, speakers, old audio systems\n\n" +
//                        "No minimum quantity required!";
//
//            case "pricing":
//                return "💰 **Great news - our service is completely FREE!**\n\n" +
//                        "✅ No pickup charges\n" +
//                        "✅ No service fees\n" +
//                        "✅ Free doorstep collection\n" +
//                        "✅ No minimum quantity required\n\n" +
//                        "Plus, you earn eco-points for every successful recycling! 🌱";
//
//            case "how_it_works":
//                return "🔄 **Here's how our e-waste pickup works:**\n\n" +
//                        "1️⃣ **Register** - Create your free account\n" +
//                        "2️⃣ **Request** - Submit pickup details with photos\n" +
//                        "3️⃣ **Schedule** - Choose convenient date & time\n" +
//                        "4️⃣ **Assignment** - Get pickup person assigned (24-48hrs)\n" +
//                        "5️⃣ **Collection** - Verified collector arrives at your door\n" +
//                        "6️⃣ **Verification** - Confirm with OTP\n" +
//                        "7️⃣ **Done** - Get digital receipt & eco-points!\n\n" +
//                        "Want to schedule a pickup now?";
//
//            case "environmental_benefits":
//                return "🌍 **Why E-Waste Recycling Matters:**\n\n" +
//                        "♻️ Prevents toxic chemicals from landfills\n" +
//                        "💎 Recovers valuable materials (gold, copper, rare metals)\n" +
//                        "🌱 Reduces carbon footprint by 80%\n" +
//                        "🏭 Saves energy compared to mining new materials\n" +
//                        "🐠 Protects water and soil from contamination\n\n" +
//                        "Every device you recycle makes a difference!";
//
//            case "safety_security":
//                return "🔒 **Your Safety is Our Priority:**\n\n" +
//                        "✅ All pickup persons are verified & trained\n" +
//                        "✅ Background checks completed\n" +
//                        "✅ GPS tracking enabled\n" +
//                        "✅ Secure data destruction for storage devices\n" +
//                        "✅ Insurance coverage for valuable items\n" +
//                        "✅ Certificate of recycling available\n\n" +
//                        "You're in safe hands!";
//
//            case "service_info":
//                return "✅ **Yes, we provide FREE doorstep collection!**\n\n" +
//                        "🚪 We come to your home/office\n" +
//                        "📅 Available Monday-Saturday\n" +
//                        "⏰ Flexible time slots\n" +
//                        "🆓 Completely free service\n" +
//                        "📍 GPS-tracked pickup persons\n\n" +
//                        "Just schedule a pickup and we'll handle the rest!";
//
//            default:
//                return getChatbotResponse(userMessage);
//        }
//    }
//
//    private String handleFallbackResponse(String userMessage) {
//        String intent = detectIntent(userMessage);
//        String contextualResponse = getContextualResponse(userMessage, intent);
//
//        if (intent.equals("general")) {
//            // For truly general questions, provide helpful default
//            return "I'm your E-Waste Management assistant! I can help you with:\n\n" +
//                    "📦 Scheduling pickups\n" +
//                    "📍 Tracking requests\n" +
//                    "📱 What items we accept\n" +
//                    "💰 Pricing (it's free!)\n" +
//                    "🌍 Environmental impact\n" +
//                    "🔐 Account help\n\n" +
//                    "What would you like to know?";
//        }
//
//        return contextualResponse;
//    }
//
//
//    // Enhanced response with quick actions
//    public Map<String, Object> getChatbotResponseWithActions(String userMessage) {
//        String intent = detectIntent(userMessage);
//        String response = getContextualResponse(userMessage, intent);
//
//        List<Map<String, String>> quickReplies = getQuickRepliesForIntent(intent);
//
//        return Map.of(
//                "response", response,
//                "intent", intent,
//                "quickReplies", quickReplies
//        );
//    }
//
//    private List<Map<String, String>> getQuickRepliesForIntent(String intent) {
//        switch (intent) {
//            case "greeting":
//                return Arrays.asList(
//                        Map.of("text", "Request Pickup 📦", "action", "pickup_request"),
//                        Map.of("text", "Track Request 📍", "action", "track_request"),
//                        Map.of("text", "Login 🔐", "action", "login"),
//                        Map.of("text", "Register 📝", "action", "register")
//                );
//
//            case "service_info":
//                return Arrays.asList(
//                        Map.of("text", "Schedule Pickup Now", "action", "redirect:/user/submit-request"),
//                        Map.of("text", "What Items Accepted?", "action", "recyclable_items"),
//                        Map.of("text", "View Pricing", "action", "pricing")
//                );
//
//            case "pickup_request":
//                return Arrays.asList(
//                        Map.of("text", "Start Request", "action", "redirect:/user/pickup-request"),
//                        Map.of("text", "Login First", "action", "login"),
//                        Map.of("text", "Learn More", "action", "help")
//                );
//
//            case "track_request":
//                return Arrays.asList(
//                        Map.of("text", "Enter Request ID", "action", "input:request_id"),
//                        Map.of("text", "View All Requests", "action", "redirect:/user/my-requests"),
//                        Map.of("text", "Login", "action", "login")
//                );
//
//            case "login":
//                return Arrays.asList(
//                        Map.of("text", "User Login", "action", "redirect:/auth/login"),
//                        Map.of("text", "Pickup Person", "action", "redirect:/auth/pickup-login"),
//                        Map.of("text", "Admin Login", "action", "redirect:/auth/admin-login")
//                );
//
//            case "register":
//                return Arrays.asList(
//                        Map.of("text", "Register Now", "action", "redirect:/auth/register"),
//                        Map.of("text", "Learn Benefits", "action", "help")
//                );
//
//            case "support":
//                return Arrays.asList(
//                        Map.of("text", "Call Support", "action", "tel:+911800392783"),
//                        Map.of("text", "Send Email", "action", "mailto:support@ewaste.com"),
//                        Map.of("text", "Live Chat", "action", "redirect:/support/chat")
//                );
//
//            case "admin":
//                return Arrays.asList(
//                        Map.of("text", "Admin Login", "action", "redirect:/auth/admin-login"),
//                        Map.of("text", "View Dashboard", "action", "redirect:/admin/dashboard")
//                );
//
//            case "pickup_operations":
//                return Arrays.asList(
//                        Map.of("text", "Pickup Login", "action", "redirect:/auth/pickup-login"),
//                        Map.of("text", "View Pickups", "action", "redirect:/pickup/dashboard")
//                );
//
//            default:
//                return Arrays.asList(
//                        Map.of("text", "Main Menu", "action", "greeting"),
//                        Map.of("text", "Get Help", "action", "support")
//                );
//        }
//    }
//
//    // Method to handle conversation context and memory
//    public String getChatbotResponseWithContext(String userMessage, Map<String, Object> context) {
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//            String url = "https://api.openai.com/v1/chat/completions";
//
//            // Build conversation history with context
//            List<Map<String, String>> messages = new ArrayList<>();
//            messages.add(Map.of("role", "system", "content", buildContextualSystemPrompt(context)));
//
//            // Add conversation history if available
//            if (context.containsKey("conversation_history")) {
//                List<Map<String, String>> history = (List<Map<String, String>>) context.get("conversation_history");
//                messages.addAll(history);
//            }
//
//            messages.add(Map.of("role", "user", "content", userMessage));
//
//            Map<String, Object> body = Map.of(
//                    "model", "gpt-3.5-turbo",
//                    "messages", messages,
//                    "max_tokens", 350,
//                    "temperature", 0.7
//            );
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            headers.setBearerAuth(apiKey);
//
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//            Map response = restTemplate.postForObject(url, request, Map.class);
//
//            var choices = (List<Map<String, Object>>) response.get("choices");
//            var message = (Map<String, Object>) choices.get(0).get("message");
//
//            return message.get("content").toString();
//
//        } catch (Exception e) {
//            return handleFallbackResponse(userMessage);
//        }
//    }
//
//    private String buildContextualSystemPrompt(Map<String, Object> context) {
//        StringBuilder prompt = new StringBuilder(SYSTEM_PROMPT);
//
//        if (context.containsKey("user_role")) {
//            String role = (String) context.get("user_role");
//            prompt.append("\n\nCURRENT USER CONTEXT:\n");
//            prompt.append("User Role: ").append(role).append("\n");
//
//            switch (role.toLowerCase()) {
//                case "user":
//                    prompt.append("Focus on pickup requests, tracking, and user account features.\n");
//                    break;
//                case "pickup":
//                    prompt.append("Focus on pickup operations, OTP verification, and route management.\n");
//                    break;
//                case "admin":
//                    prompt.append("Focus on system management, analytics, and administrative functions.\n");
//                    break;
//            }
//        }
//
//        if (context.containsKey("is_logged_in") && (Boolean) context.get("is_logged_in")) {
//            prompt.append("User is logged in - provide personalized assistance.\n");
//        } else {
//            prompt.append("User is not logged in - guide them to login/register when needed.\n");
//        }
//
//        return prompt.toString();
//    }
//}