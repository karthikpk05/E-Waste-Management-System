package com.example.E_Waste_Management_System.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CertificateDTO {
    private Long id;
    private String title;
    private String issuedAt;
    private Integer completedRequests;
    private String recognitionText;
}