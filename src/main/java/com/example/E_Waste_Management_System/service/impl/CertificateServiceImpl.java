package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.Model.Certificate;
import com.example.E_Waste_Management_System.Model.EwasteRequest;
import com.example.E_Waste_Management_System.Model.Status;
import com.example.E_Waste_Management_System.Model.User;
import com.example.E_Waste_Management_System.repository.CertificateRepository;
import com.example.E_Waste_Management_System.repository.EwasteRequestRepository;
import com.example.E_Waste_Management_System.service.CertificateService;
import com.example.E_Waste_Management_System.service.NotificationService;
import com.example.E_Waste_Management_System.service.NotificationServiceEnhanced;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import org.apache.commons.io.IOUtils;
import java.io.InputStream;


import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.Phrase;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepo;
    private final EwasteRequestRepository ewasteRequestRepo;
    private final NotificationService notificationService;
    private final NotificationServiceEnhanced notificationServiceEnhanced;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void checkAndGenerateCertificate(User user) {
        try {
            // Count completed requests for this user
            List<EwasteRequest> userRequests = ewasteRequestRepo.findByUser(user);
            long completedCount = userRequests.stream()
                    .filter(req -> req.getStatus() == Status.COMPLETED)
                    .count();

            System.out.println("User: " + user.getName() + " has " + completedCount + " completed requests");

            // Check if user has completed requests in multiples of 5
            if (completedCount > 0 && completedCount % 5 == 0) {
                // Check if certificate already exists for this milestone
                long existingCertificates = certificateRepo.countByUser(user);
                long expectedCertificates = completedCount/5;

                System.out.println("Existing certificates: " + existingCertificates + ", Expected: " + expectedCertificates);

                if (existingCertificates < expectedCertificates) {
                    // Generate new certificate
                    String pdfPath = generateCertificatePdf(user, (int) completedCount);

                    Certificate certificate = Certificate.builder()
                            .user(user)
                            .title("Certificate of Appreciation")
                            .filePath(pdfPath)
                            .completedRequests((int) completedCount)
                            .recognitionText("In recognition of your outstanding contribution to environmental sustainability through responsible e-waste management")
                            .issuedAt(LocalDateTime.now())
                            .build();

                    Certificate savedCertificate = certificateRepo.save(certificate);
                    System.out.println("Certificate created with ID: " + savedCertificate.getId());

                    // Send email with certificate attachment
                    try {
                        notificationService.sendCertificateEmail(user, certificate, pdfPath);
                    } catch (Exception emailError) {
                        System.err.println("Failed to send certificate email: " + emailError.getMessage());
                        // Don't fail the certificate generation if email fails
                    }
                    // 🔔 CREATE IN-APP NOTIFICATION FOR CERTIFICATE
                    notificationServiceEnhanced.createCertificateEarnedNotification(user, (int) completedCount);
                }
            }
        } catch (Exception e) {
            System.err.println("Error in checkAndGenerateCertificate: " + e.getMessage());
            e.printStackTrace();
            // Don't rethrow - we don't want certificate generation to fail the main operation
        }
    }

    // Certificate Generator with Background Image Support
    // Replace your existing generateCertificatePdf method in CertificateServiceImpl
    // Add these imports at the top of your CertificateServiceImpl class

    @Override
    public String generateCertificatePdf(User user, int completedRequests) {
        try {
            // Create certificates directory if it doesn't exist
            Path certificatesDir = Paths.get(uploadDir, "certificates");
            Files.createDirectories(certificatesDir);

            String filename = "certificate_" + user.getId() + "_" + UUID.randomUUID().toString() + ".pdf";
            String fullPath = certificatesDir.resolve(filename).toString();

            // Create document in landscape mode
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(fullPath));
            document.open();

            // Get the content byte for adding background and text
            PdfContentByte canvas = writer.getDirectContent();

            // Add background image - CORRECTED VERSION
            boolean backgroundAdded = false;
            try {
                // Fix the typo: "/static.images/" should be "/static/images/"
                InputStream imageStream = getClass().getResourceAsStream("/static/images/certificate-background.png");

                if (imageStream != null) {
                    byte[] imageBytes = IOUtils.toByteArray(imageStream);
                    imageStream.close();

                    Image backgroundImage = Image.getInstance(imageBytes);

                    // Scale image to fit page size
                    backgroundImage.scaleToFit(PageSize.A4.rotate().getWidth(), PageSize.A4.rotate().getHeight());
                    backgroundImage.setAbsolutePosition(0, 0);

                    // Add background image
                    canvas.addImage(backgroundImage);
                    backgroundAdded = true;
                    System.out.println("Background image loaded successfully!");

                } else {
                    System.err.println("Image stream is null - file not found in /static/images/");
                }

            } catch (Exception e) {
                System.err.println("Background image not found, proceeding without background: " + e.getMessage());
            }

            // Fallback: Create golden background if image loading failed
            if (!backgroundAdded) {
                System.out.println("Creating fallback golden background");
                canvas.saveState();
                canvas.setColorFill(new BaseColor(255, 248, 220)); // Light cream
                canvas.rectangle(0, 0, PageSize.A4.rotate().getWidth(), PageSize.A4.rotate().getHeight());
                canvas.fill();

                // Add golden border for better appearance
                canvas.setColorStroke(new BaseColor(218, 165, 32)); // Golden border
                canvas.setLineWidth(8);
                canvas.rectangle(20, 20, PageSize.A4.rotate().getWidth() - 40, PageSize.A4.rotate().getHeight() - 40);
                canvas.stroke();
                canvas.restoreState();
            }

            // Now add text over the background image
            float pageWidth = PageSize.A4.rotate().getWidth();
            float pageHeight = PageSize.A4.rotate().getHeight();

            canvas.beginText();

            // "This certificate is proudly awarded to" - Size 16
            BaseFont regularFont = BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            canvas.setFontAndSize(regularFont, 16);
            canvas.setColorFill(BaseColor.BLACK);

            String awardText = "This certificate is proudly awarded to";
            float awardTextWidth = canvas.getEffectiveStringWidth(awardText, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - awardTextWidth) / 2, pageHeight - 180);
            canvas.showText(awardText);

            // User name - Bold Size 64, stylish
            BaseFont boldFont = BaseFont.createFont(BaseFont.TIMES_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            canvas.setFontAndSize(boldFont, 60);
            canvas.setColorFill(new BaseColor(47, 79, 79)); // Dark slate gray for elegance

            String userName = user.getName().toUpperCase();
            float nameWidth = canvas.getEffectiveStringWidth(userName, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - nameWidth) / 2, pageHeight - 260);
            canvas.showText(userName);

            // Recognition text - Italic Size 14
            BaseFont italicFont = BaseFont.createFont(BaseFont.TIMES_ITALIC, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            canvas.setFontAndSize(italicFont, 14);
            canvas.setColorFill(BaseColor.BLACK);

            // Line 1
            String line1 = "In recognition of your outstanding contribution to environmental sustainability";
            float line1Width = canvas.getEffectiveStringWidth(line1, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line1Width) / 2, pageHeight - 300);
            canvas.showText(line1);

            // Line 2
            String line2 = "through responsible e-waste management.";
            float line2Width = canvas.getEffectiveStringWidth(line2, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line2Width) / 2, pageHeight - 320);
            canvas.showText(line2);

            // Line 3
            String line3 = "You have successfully completed " + completedRequests + " e-waste pickup requests,";
            float line3Width = canvas.getEffectiveStringWidth(line3, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line3Width) / 2, pageHeight - 350);
            canvas.showText(line3);

            // Line 4
            String line4 = "demonstrating your commitment to a cleaner and greener environment.";
            float line4Width = canvas.getEffectiveStringWidth(line4, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line4Width) / 2, pageHeight - 370);
            canvas.showText(line4);

            // Date - Size 12
            canvas.setFontAndSize(regularFont, 12);
            String dateText = "Issued on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
            float dateWidth = canvas.getEffectiveStringWidth(dateText, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - dateWidth) / 2, pageHeight - 410);
            canvas.showText(dateText);

            canvas.endText();
            document.close();

            return "certificates/" + filename;

        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }

//    @Override
//    public String generateCertificatePdf(User user, int completedRequests) {
//        try {
//            // Create certificates directory if it doesn't exist
//            Path certificatesDir = Paths.get(uploadDir, "certificates");
//            Files.createDirectories(certificatesDir);
//
//
//            String filename = "certificate_" + user.getId() + "_" + UUID.randomUUID().toString() + ".pdf";
//            String fullPath = certificatesDir.resolve(filename).toString();
//
//            // Create document in landscape mode
//            Document document = new Document(PageSize.A4.rotate());
//            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(fullPath));
//            document.open();
//
//            // Get the content byte for adding background and text
//            PdfContentByte canvas = writer.getDirectContent();
//
//            // Add background image
//            try {
//                // Path to your certificate background image
//                // You need to place your certificate template image in resources/static/images/
////                String imagePath = getClass().getClassLoader().getResource("static/images/certificate-background.png").getPath();
////                Image backgroundImage = Image.getInstance(imagePath);
//                InputStream imageStream = getClass().getResourceAsStream("/static.images/certificate-background.png");
//                Image backgroundImage = Image.getInstance(IOUtils.toByteArray(imageStream));
//
//                // Scale image to fit page size
//                backgroundImage.scaleToFit(PageSize.A4.rotate().getWidth(), PageSize.A4.rotate().getHeight());
//                backgroundImage.setAbsolutePosition(0, 0);
//
//                // Add background image
//                canvas.addImage(backgroundImage);
//
//            } catch (Exception e) {
//                System.err.println("Background image not found, proceeding without background: " + e.getMessage());
//                // If image not found, create a simple golden background
//                canvas.rectangle(0, 0, PageSize.A4.rotate().getWidth(), PageSize.A4.rotate().getHeight());
//                canvas.setColorFill(new BaseColor(255, 248, 220)); // Light cream
//                canvas.fill();
//            }
//
//            // Now add text over the background image
//            // Get page dimensions for positioning
//            float pageWidth = PageSize.A4.rotate().getWidth();
//            float pageHeight = PageSize.A4.rotate().getHeight();
//
//            // "This certificate is proudly awarded to" - Size 16
//            Font awardedToFont = new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.NORMAL, BaseColor.BLACK);
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("This certificate is proudly awarded to", awardedToFont),
//                    pageWidth / 2, pageHeight - 280, 0);
//
//            // User Name - Bold Size 64, stylish
//            Font nameFont = new Font(Font.FontFamily.TIMES_ROMAN, 64, Font.BOLD, new BaseColor(47, 79, 79));
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase(user.getName(), nameFont),
//                    pageWidth / 2, pageHeight - 360, 0);
//
//            // Recognition text line 1 - Italic Size 14
//            Font recognitionFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.ITALIC, BaseColor.BLACK);
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("In recognition of your outstanding contribution to environmental sustainability", recognitionFont),
//                    pageWidth / 2, pageHeight - 420, 0);
//
//            // Recognition text line 2 - Italic Size 14
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("through responsible e-waste management.", recognitionFont),
//                    pageWidth / 2, pageHeight - 440, 0);
//
//            // Completion details - Italic Size 14
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("You have successfully completed " + completedRequests + " e-waste pickup requests,", recognitionFont),
//                    pageWidth / 2, pageHeight - 480, 0);
//
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("demonstrating your commitment to a cleaner and greener environment.", recognitionFont),
//                    pageWidth / 2, pageHeight - 500, 0);
//
//            // Date
//            Font dateFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.NORMAL, BaseColor.BLACK);
//            String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
//            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
//                    new Phrase("Issued on: " + formattedDate, dateFont),
//                    pageWidth / 2, pageHeight - 560, 0);
//
//            document.close();
//            return "certificates/" + filename;
//
//        } catch (DocumentException | IOException e) {
//            throw new RuntimeException("Failed to generate certificate PDF", e);
//        }
//    }

    // Alternative implementation using absolute positioning with better control
    @Override
    public String generateCertificatePdfWithPrecisePositioning(User user, int completedRequests) {
        try {
            Path certificatesDir = Paths.get(uploadDir, "certificates");
            Files.createDirectories(certificatesDir);

            String filename = "certificate_" + user.getId() + "_" + UUID.randomUUID().toString() + ".pdf";
            String fullPath = certificatesDir.resolve(filename).toString();

            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(fullPath));
            document.open();

            PdfContentByte canvas = writer.getDirectContent();
            float pageWidth = document.getPageSize().getWidth();
            float pageHeight = document.getPageSize().getHeight();

            // Add background image
            try {
                // Load background image from resources
                // Place your certificate background image in src/main/resources/static/images/
                String imagePath = "src/main/resources/static/images/certificate-background.png";
                Image backgroundImage = Image.getInstance(imagePath);

                // Scale and position the image to fill the page
                backgroundImage.scaleToFit(pageWidth, pageHeight);
                backgroundImage.setAbsolutePosition(0, 0);
                canvas.addImage(backgroundImage);

            } catch (Exception e) {
                System.err.println("Could not load background image: " + e.getMessage());
                // Fallback: create colored background
                canvas.saveState();
                canvas.setColorFill(new BaseColor(255, 248, 220));
                canvas.rectangle(0, 0, pageWidth, pageHeight);
                canvas.fill();
                canvas.restoreState();
            }

            // Position text elements precisely to match your template
            canvas.beginText();

            // "This certificate is proudly awarded to" - positioned in upper middle area
            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 16);
            canvas.setTextMatrix(1, 0, 0, 1, pageWidth/2 - 150, pageHeight - 280);
            canvas.showText("This certificate is proudly awarded to");

            // User name - large, bold, centered
            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 64);
            float nameWidth = canvas.getEffectiveStringWidth(user.getName(), false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - nameWidth) / 2, pageHeight - 360);
            canvas.showText(user.getName());

            // Recognition text - italic, smaller, centered
            BaseFont italicFont = BaseFont.createFont(BaseFont.TIMES_ITALIC, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            canvas.setFontAndSize(italicFont, 14);

            String line1 = "In recognition of your outstanding contribution to environmental sustainability";
            float line1Width = canvas.getEffectiveStringWidth(line1, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line1Width) / 2, pageHeight - 420);
            canvas.showText(line1);

            String line2 = "through responsible e-waste management.";
            float line2Width = canvas.getEffectiveStringWidth(line2, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line2Width) / 2, pageHeight - 440);
            canvas.showText(line2);

            String line3 = "You have successfully completed " + completedRequests + " e-waste pickup requests,";
            float line3Width = canvas.getEffectiveStringWidth(line3, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line3Width) / 2, pageHeight - 480);
            canvas.showText(line3);

            String line4 = "demonstrating your commitment to a cleaner and greener environment.";
            float line4Width = canvas.getEffectiveStringWidth(line4, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - line4Width) / 2, pageHeight - 500);
            canvas.showText(line4);

            // Date
            canvas.setFontAndSize(BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), 12);
            String dateText = "Issued on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
            float dateWidth = canvas.getEffectiveStringWidth(dateText, false);
            canvas.setTextMatrix(1, 0, 0, 1, (pageWidth - dateWidth) / 2, pageHeight - 560);
            canvas.showText(dateText);

            canvas.endText();
            document.close();

            return "certificates/" + filename;

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF with background", e);
        }
    }


//    @Override
//    public String generateCertificatePdf(User user, int completedRequests) {
//        try {
//            // Create certificates directory if it doesn't exist
//            Path certificatesDir = Paths.get(uploadDir, "certificates");
//            Files.createDirectories(certificatesDir);
//
//            String filename = "certificate_" + user.getId() + "_" + UUID.randomUUID().toString() + ".pdf";
//            String fullPath = certificatesDir.resolve(filename).toString();
//
//            Document document = new Document(PageSize.A4);
//            PdfWriter.getInstance(document, new FileOutputStream(fullPath));
//            document.open();
//
//            // Create colorful design
//            // Border
//            PdfPTable borderTable = new PdfPTable(1);
//            borderTable.setWidthPercentage(95);
//            PdfPCell borderCell = new PdfPCell();
//            borderCell.setBorderWidth(5);
//            borderCell.setBorderColor(new BaseColor(34, 139, 34)); // Forest Green
//            borderCell.setPadding(20);
//
//            // Inner content table
//            PdfPTable contentTable = new PdfPTable(1);
//            contentTable.setWidthPercentage(100);
//
//            // Title
//            Font titleFont = new Font(Font.FontFamily.HELVETICA, 36, Font.BOLD, new BaseColor(34, 139, 34));
//            Paragraph title = new Paragraph("CERTIFICATE OF APPRECIATION", titleFont);
//            title.setAlignment(Element.ALIGN_CENTER);
//            title.setSpacingAfter(30);
//
//            // Decorative line
//            PdfPTable decorativeLine = new PdfPTable(1);
//            decorativeLine.setWidthPercentage(60);
//            PdfPCell lineCell = new PdfPCell();
//            lineCell.setBorderWidth(2);
//            lineCell.setBorderColor(new BaseColor(255, 215, 0)); // Gold
//            lineCell.setFixedHeight(5);
//            decorativeLine.addCell(lineCell);
//
//            // Main text
//            Font mainFont = new Font(Font.FontFamily.HELVETICA, 16, Font.NORMAL, BaseColor.BLACK);
//            Paragraph mainText = new Paragraph("This certificate is proudly awarded to", mainFont);
//            mainText.setAlignment(Element.ALIGN_CENTER);
//            mainText.setSpacingAfter(20);
//
//            // User name
//            Font nameFont = new Font(Font.FontFamily.HELVETICA, 28, Font.BOLD, new BaseColor(0, 0, 139));
//            Paragraph userName = new Paragraph(user.getName().toUpperCase(), nameFont);
//            userName.setAlignment(Element.ALIGN_CENTER);
//            userName.setSpacingAfter(30);
//
//            // Recognition text
//            Font recognitionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.ITALIC, BaseColor.BLACK);
//            Paragraph recognition = new Paragraph(
//                    "In recognition of your outstanding contribution to environmental sustainability\n" +
//                            "through responsible e-waste management.\n\n" +
//                            "You have successfully completed " + completedRequests + " e-waste pickup requests,\n" +
//                            "demonstrating your commitment to a cleaner and greener environment.",
//                    recognitionFont
//            );
//            recognition.setAlignment(Element.ALIGN_CENTER);
//            recognition.setSpacingAfter(40);
//
//            // Date
//            Font dateFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.BLACK);
//            String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"));
//            Paragraph dateText = new Paragraph("Issued on: " + formattedDate, dateFont);
//            dateText.setAlignment(Element.ALIGN_CENTER);
//            dateText.setSpacingAfter(30);
//
//            // Signature section
//            PdfPTable signatureTable = new PdfPTable(2);
//            signatureTable.setWidthPercentage(80);
//            signatureTable.setWidths(new float[]{1, 1});
//
//            PdfPCell leftSignature = new PdfPCell();
//            leftSignature.setBorder(Rectangle.NO_BORDER);
//            leftSignature.addElement(new Paragraph("_____________________", mainFont));
//            leftSignature.addElement(new Paragraph("System Administrator", new Font(Font.FontFamily.HELVETICA, 10)));
//            leftSignature.setHorizontalAlignment(Element.ALIGN_CENTER);
//
//            PdfPCell rightSignature = new PdfPCell();
//            rightSignature.setBorder(Rectangle.NO_BORDER);
//            rightSignature.addElement(new Paragraph("_____________________", mainFont));
//            rightSignature.addElement(new Paragraph("E-Waste Management Team", new Font(Font.FontFamily.HELVETICA, 10)));
//            rightSignature.setHorizontalAlignment(Element.ALIGN_CENTER);
//
//            signatureTable.addCell(leftSignature);
//            signatureTable.addCell(rightSignature);
//
//            // Add all elements to content
//            PdfPCell contentCell = new PdfPCell();
//            contentCell.setBorder(Rectangle.NO_BORDER);
//            contentCell.addElement(title);
//            contentCell.addElement(decorativeLine);
//            contentCell.addElement(mainText);
//            contentCell.addElement(userName);
//            contentCell.addElement(recognition);
//            contentCell.addElement(dateText);
//            contentCell.addElement(signatureTable);
//
//            contentTable.addCell(contentCell);
//            borderCell.addElement(contentTable);
//            borderTable.addCell(borderCell);
//
//            document.add(borderTable);
//            document.close();
//
//            return "certificates/" + filename; // Return relative path
//
//        } catch (DocumentException | IOException e) {
//            throw new RuntimeException("Failed to generate certificate PDF", e);
//        }
//    }

    @Override
    public List<Certificate> getUserCertificates(User user) {
        return certificateRepo.findByUserOrderByIssuedAtDesc(user);
    }

    @Override
    public Certificate getCertificateById(Long id) {
        return certificateRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }

    @Override
    public Resource getCertificateFile(String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Certificate file not found: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Certificate file not found: " + filename, e);
        }
    }
}