package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.Model.EwasteRequest;
import com.example.E_Waste_Management_System.Model.PickupPerson;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.dto.EwasteResponseDTO;
import com.example.E_Waste_Management_System.Model.Status;
import com.example.E_Waste_Management_System.repository.EwasteRequestRepository;
import com.example.E_Waste_Management_System.repository.PickupPersonRepository;
import com.example.E_Waste_Management_System.repository.UserRepository;
import com.example.E_Waste_Management_System.service.AdminService;
import com.example.E_Waste_Management_System.service.EwasteRequestService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final EwasteRequestService requestService;
    private final AdminService adminService;
    private final UserRepository userRepo;
    private final PickupPersonRepository pickupPersonRepo;
    private final EwasteRequestRepository ewasteRequestRepo;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<User>> allUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<EwasteResponseDTO>> listRequests(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(requestService.getAllRequests(status));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<EwasteResponseDTO> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<EwasteResponseDTO> approve(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.updateStatus(id, Status.APPROVED, null));
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<EwasteResponseDTO> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(requestService.updateStatus(id, Status.REJECTED, reason));
    }

    @PutMapping("/requests/{id}/schedule")
    public ResponseEntity<EwasteResponseDTO> schedule(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            LocalDateTime dt = LocalDateTime.parse(body.get("pickupDateTime"));
            Long pickupPersonId = null;

            // Handle optional pickup person ID - fixed the null parsing issue
            String pickupPersonIdStr = body.get("pickupPersonId");
            if (pickupPersonIdStr != null && !pickupPersonIdStr.trim().isEmpty()
                    && !"null".equals(pickupPersonIdStr) && !"undefined".equals(pickupPersonIdStr)) {
                try {
                    pickupPersonId = Long.parseLong(pickupPersonIdStr);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid pickup person ID format");
                }
            }

            EwasteResponseDTO response = requestService.schedulePickup(id, dt, pickupPersonId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Error scheduling pickup: " + e.getMessage());
        }
    }

    @PostMapping("/pickup-person")
    public ResponseEntity<?> registerPickupPerson(@RequestBody PickupPerson person) {
        try {
            PickupPerson savedPerson = adminService.registerPickupPerson(person);
            // Don’t return encoded password in response
            savedPerson.setPassword(null);
            return ResponseEntity.ok(savedPerson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating pickup person: " + e.getMessage());
        }
    }



//    @PostMapping("/pickup-person")
//    public ResponseEntity<PickupPerson> registerPickupPerson(@RequestBody PickupPerson person) {
//        try {
//            // Validate required fields
//            if (person.getUsername() == null || person.getUsername().trim().isEmpty()) {
//                throw new RuntimeException("Username is required");
//            }
//            if (person.getName() == null || person.getName().trim().isEmpty()) {
//                throw new RuntimeException("Name is required");
//            }
//            if (person.getEmail() == null || person.getEmail().trim().isEmpty()) {
//                throw new RuntimeException("Email is required");
//            }
//            if (person.getPassword() == null || person.getPassword().trim().isEmpty()) {
//                throw new RuntimeException("Password is required");
//            }
//            if (person.getPhone() == null || person.getPhone().trim().isEmpty()) {
//                throw new RuntimeException("Phone is required");
//            }
//
//            // Check if username or email already exists
//            if (pickupPersonRepo.existsByUsername(person.getUsername())) {
//                throw new RuntimeException("Username already exists");
//            }
//            if (pickupPersonRepo.existsByEmail(person.getEmail())) {
//                throw new RuntimeException("Email already exists");
//            }
//
//            // Encode password before saving
//            person.setPassword(passwordEncoder.encode(person.getPassword()));
//
//            PickupPerson savedPerson = pickupPersonRepo.save(person);
//            // Don't return password in response
//            savedPerson.setPassword(null);
//            return ResponseEntity.ok(savedPerson);
//        } catch (Exception e) {
//            throw new RuntimeException("Error creating pickup person: " + e.getMessage());
//        }
//    }

    @GetMapping("/pickup-person")
    public ResponseEntity<List<PickupPerson>> getPickupPersons() {
        List<PickupPerson> persons = pickupPersonRepo.findAll();
        // Remove passwords from response for security
        persons.forEach(person -> person.setPassword(null));
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/report")
    public void generateAdminReport(
            @RequestParam(defaultValue = "30") int days,
            HttpServletResponse response) throws IOException, DocumentException {

        // ✅ Calculate cutoff date
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);

        // ✅ Fetch all requests in last X days
        List<EwasteRequest> requests =
                ewasteRequestRepo.findByCreatedAtAfter(cutoff);

        // ✅ Response headers
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=admin_report.pdf");

        // ✅ Create PDF
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("E-Waste Management System", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        // Date of generation
        document.add(new Paragraph("Generated Date: " +
                LocalDateTime.now().atZone(ZoneId.systemDefault()).toLocalDateTime().toString()));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Report for Last " + days + " Days",
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
        document.add(new Paragraph(" "));

        // Requests Table
        PdfPTable table = new PdfPTable(8); // 8 columns
        table.setWidthPercentage(100);

        Stream.of("Request ID", "Device", "Brand & Model", "Condition", "Date", "Status", "User Name", "User Email")
                .forEach(col -> {
                    PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    table.addCell(cell);
                });

        for (EwasteRequest req : requests) {
            table.addCell(String.valueOf(req.getRequestId()));
            table.addCell(req.getDeviceType());
            table.addCell(req.getBrand()+" "+req.getModel());
            table.addCell(String.valueOf(req.getCondition()));
            table.addCell(req.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().toString());
            table.addCell(req.getStatus().name());

            // ✅ User details
            User user = req.getUser();
            table.addCell(user != null ? user.getName() : "N/A");
            table.addCell(user != null ? user.getEmail() : "N/A");
        }

        document.add(table);
        document.close();
    }

}
