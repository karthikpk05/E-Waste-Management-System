package com.example.E_Waste_Management_System.controller;

import com.example.E_Waste_Management_System.Model.Certificate;
import com.example.E_Waste_Management_System.Model.EwasteRequest;
import com.example.E_Waste_Management_System.dto.CertificateDTO;
import com.example.E_Waste_Management_System.dto.ProfileUpdateRequest;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.repository.EwasteRequestRepository;
import com.example.E_Waste_Management_System.repository.UserRepository;
import com.example.E_Waste_Management_System.service.CertificateService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.E_Waste_Management_System.service.UserService;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService users;
    private final EwasteRequestRepository ewasteRequestRepo;
    private final UserRepository userRepo;
    private final CertificateService certificateService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> profile() {
        return ResponseEntity.ok(users.getCurrentUser());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> update(@RequestBody ProfileUpdateRequest req) {
        return ResponseEntity.ok(users.updateProfile(req));
    }

//    @GetMapping("/{userId}/report")
//    public ResponseEntity<byte[]> generateUserReport(
//            @PathVariable Long userId,
//            @RequestParam int days) {
//
//        LocalDateTime fromDate = LocalDateTime.now().minusDays(days);
//
//        List<EwasteRequest> requests = ewasteRequestRepo
//                .findByUserIdAndCreatedAtAfter(userId, fromDate);
//
//        // Build report content
//        StringBuilder report = new StringBuilder();
//        report.append("E-Waste Pickup Report (Last ").append(days).append(" days)\n\n");
//        for (EwasteRequest req : requests) {
//            report.append("Request ID: ").append(req.getRequestId()).append("\n")
//                    .append("Device: ").append(req.getDeviceType()).append("\n")
//                    .append("Status: ").append(req.getStatus()).append("\n")
//                    .append("Date: ").append(req.getCreatedAt()).append("\n\n");
//        }
//
//        byte[] reportBytes = report.toString().getBytes(StandardCharsets.UTF_8);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.txt")
//                .contentType(MediaType.TEXT_PLAIN)
//                .body(reportBytes);
//    }

    @GetMapping("/report")
    public void generateReport(
            @RequestParam(defaultValue = "7") int days,
            Authentication authentication,
            HttpServletResponse response) throws IOException, DocumentException {

        // ✅ Get current logged-in user
        String email = authentication.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        // ✅ Calculate cutoff date
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);

        // ✅ Fetch requests for this user
        List<EwasteRequest> requests =
                ewasteRequestRepo.findByUserIdAndCreatedAtAfter(userId, cutoff);

        // ✅ Response headers
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");

        // ✅ Create PDF
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("E-Waste Management System", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        // User Details
        document.add(new Paragraph("User Details:", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
        document.add(new Paragraph("Name: " + user.getName()));
        document.add(new Paragraph("Email: " + user.getEmail()));
        document.add(new Paragraph("Phone: " + user.getPhone()));
        document.add(new Paragraph("Pickup Address: " + user.getPickupAddress()));
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Report for Last " + days + " Days", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
        document.add(new Paragraph(" "));

        // ✅ Requests Table with ALL details
        PdfPTable table = new PdfPTable(7); // adjust number of columns
        table.setWidthPercentage(100);

        // Table Header
        Stream.of("Request ID", "Device Type", "Brand & Modal", "Condition", "Quantity", "Status", "Date")
                .forEach(col -> {
                    PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    table.addCell(cell);
                });

        // Table Data
        for (EwasteRequest req : requests) {
            table.addCell(String.valueOf(req.getRequestId()));
            table.addCell(req.getDeviceType());   // assuming field exists
            table.addCell(req.getBrand() + " " + req.getModel());    // assuming field exists

            table.addCell(String.valueOf(req.getCondition()));
            table.addCell(String.valueOf(req.getQuantity()));   // numeric
            table.addCell(req.getStatus().name());
            table.addCell(req.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().toString());
        }

        document.add(table);
        document.close();
    }


    @GetMapping("/certificates")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<CertificateDTO>> getUserCertificates() {
        User user = users.getCurrentUser();
        List<Certificate> certificates = certificateService.getUserCertificates(user);
        List<CertificateDTO> dtos = certificates.stream()
                .map(this::convertToCertificateDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/certificates/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Resource> downloadCertificate(@PathVariable Long id) {
        Certificate certificate = certificateService.getCertificateById(id);

        // Verify ownership
        User currentUser = users.getCurrentUser();
        if (!certificate.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resource file = certificateService.getCertificateFile(certificate.getFilePath());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"Certificate_of_Appreciation.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(file);
    }

    private CertificateDTO convertToCertificateDTO(Certificate certificate) {
        return CertificateDTO.builder()
                .id(certificate.getId())
                .title(certificate.getTitle())
                .issuedAt(certificate.getIssuedAt().toString())
                .completedRequests(certificate.getCompletedRequests())
                .recognitionText(certificate.getRecognitionText())
                .build();
    }
}

//    @GetMapping("/report")
//    public void generateReport(
//            @RequestParam(defaultValue = "7") int days,
//            Authentication authentication,
//            HttpServletResponse response) throws IOException, DocumentException {
//
//        // ✅ Get current logged-in user
//        String email = authentication.getName();
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Long userId = user.getId();
//
//        // ✅ Calculate cutoff date
//        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
//
//        // ✅ Fetch requests for this user
//        List<EwasteRequest> requests =
//                ewasteRequestRepo.findByUserIdAndCreatedAtAfter(userId, cutoff);
//
//        // ✅ Response headers
//        response.setContentType("application/pdf");
//        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");
//
//        // ✅ Create PDF
//        Document document = new Document();
//        PdfWriter.getInstance(document, response.getOutputStream());
//        document.open();
//
//        // Title
//        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
//        Paragraph title = new Paragraph("E-Waste Management System", titleFont);
//        title.setAlignment(Element.ALIGN_CENTER);
//        document.add(title);
//        document.add(new Paragraph(" "));
//
//        // User Details
//        document.add(new Paragraph("User Details:", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph("Name: " + user.getName()));
//        document.add(new Paragraph("Email: " + user.getEmail()));
//        document.add(new Paragraph("Phone: " + user.getPhone()));
//        document.add(new Paragraph("Pickup Address: " + user.getPickupAddress()));
//        document.add(new Paragraph(" "));
//        document.add(new Paragraph("Report for Last " + days + " Days", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph(" "));
//
//        // Requests Table
//        PdfPTable table = new PdfPTable(3);
//        table.setWidthPercentage(100);
//
//        Stream.of("Request ID", "Status", "Date").forEach(col -> {
//            PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
//            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//            table.addCell(cell);
//        });
//
//        for (EwasteRequest req : requests) {
//            table.addCell(String.valueOf(req.getRequestId()));
//            table.addCell(req.getStatus().name());
//            table.addCell(req.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().toString());
//        }
//
//        document.add(table);
//        document.close();
//    }


//    @GetMapping("/{userId}/report")
//    public void generateReport(
//            @PathVariable Long userId,        // ✅ FIXED
//            @RequestParam(defaultValue = "7") int days,
//            HttpServletResponse response) throws IOException, DocumentException {
//
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
//
//        List<EwasteRequest> requests =
//                ewasteRequestRepo.findByUserIdAndCreatedAtAfter(userId, cutoff);
//
//        response.setContentType("application/pdf");
//        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");
//
//        Document document = new Document();
//        PdfWriter.getInstance(document, response.getOutputStream());
//        document.open();
//
//        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
//        Paragraph title = new Paragraph("E-Waste Management System", titleFont);
//        title.setAlignment(Element.ALIGN_CENTER);
//        document.add(title);
//        document.add(new Paragraph(" "));
//
//        document.add(new Paragraph("User Details:", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph("Name: " + user.getName()));
//        document.add(new Paragraph("Email: " + user.getEmail()));
//        document.add(new Paragraph("Phone: " + user.getPhone()));
//        document.add(new Paragraph("Pickup Address: " + user.getPickupAddress()));
//        document.add(new Paragraph(" "));
//        document.add(new Paragraph("Report for Last " + days + " Days", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph(" "));
//
//        PdfPTable table = new PdfPTable(3);
//        table.setWidthPercentage(100);
//
//        Stream.of("Request ID", "Status", "Date").forEach(col -> {
//            PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
//            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//            table.addCell(cell);
//        });
//
//        for (EwasteRequest req : requests) {
//            table.addCell(String.valueOf(req.getRequestId()));
//            table.addCell(req.getStatus().name());
//            table.addCell(req.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate().toString());
//        }
//
//        document.add(table);
//        document.close();
//    }


//    @GetMapping("/{userId}/report")
//    public void generateReport(
//            @RequestParam(defaultValue = "7") int days,
//            @RequestParam Long userId,
//            HttpServletResponse response) throws IOException, DocumentException {
//
//        // Fetch user
//        User user = userRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Calculate cutoff date
//        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
//
//        // Fetch requests for this user within the date range
//        List<EwasteRequest> requests =
//                ewasteRequestRepo.findByUserIdAndCreatedAtAfter(userId, cutoff);
//
//        // Set response headers for PDF download
//        response.setContentType("application/pdf");
//        response.setHeader("Content-Disposition", "attachment; filename=report.pdf");
//
//        // Create PDF
//        Document document = new Document();
//        PdfWriter.getInstance(document, response.getOutputStream());
//        document.open();
//
//        // Title
//        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
//        Paragraph title = new Paragraph("E-Waste Management System", titleFont);
//        title.setAlignment(Element.ALIGN_CENTER);
//        document.add(title);
//        document.add(new Paragraph(" "));
//
//        // User Details
//        document.add(new Paragraph("User Details:", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph("Name: " + user.getName()));
//        document.add(new Paragraph("Email: " + user.getEmail()));
//        document.add(new Paragraph("Phone: " + user.getPhone()));
//        document.add(new Paragraph("Pickup Address: " + user.getPickupAddress()));
//        document.add(new Paragraph(" "));
//        document.add(new Paragraph("Report for Last " + days + " Days", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)));
//        document.add(new Paragraph(" "));
//
//        // Requests Table
//        PdfPTable table = new PdfPTable(3); // 3 columns: ID, Status, Date
//        table.setWidthPercentage(100);
//
//        // Table Header
//        Stream.of("Request ID", "Status", "Date").forEach(col -> {
//            PdfPCell cell = new PdfPCell(new Phrase(col, new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
//            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
//            table.addCell(cell);
//        });
//
//        // Table Rows
//        for (EwasteRequest req : requests) {
//            table.addCell(String.valueOf(req.getRequestId()));
//            table.addCell(req.getStatus().name());
//            table.addCell(req.getCreatedAt()
//                    .atZone(ZoneId.systemDefault())
//                    .toLocalDate()
//                    .toString());
//        }
//
//        document.add(table);
//        document.close();
//    }




