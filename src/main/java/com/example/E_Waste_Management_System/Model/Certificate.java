package com.example.E_Waste_Management_System.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false)
    private String title = "Certificate of Appreciation"; // Set default value

    @Column(name = "file_path", nullable = false)
    private String filePath; // Path to the saved PDF file

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "completed_requests", nullable = false)
    private Integer completedRequests; // Number of completed requests at time of issuance

    @Column(name = "recognition_text", length = 500)
    private String recognitionText = "In recognition of your outstanding contribution to environmental sustainability through responsible e-waste management";

    @PrePersist
    protected void onCreate() {
        if (this.issuedAt == null) {
            this.issuedAt = LocalDateTime.now();
        }
        if (this.title == null || this.title.trim().isEmpty()) {
            this.title = "Certificate of Appreciation";
        }
        if (this.recognitionText == null || this.recognitionText.trim().isEmpty()) {
            this.recognitionText = "In recognition of your outstanding contribution to environmental sustainability through responsible e-waste management";
        }
    }
}
