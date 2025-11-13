package com.example.E_Waste_Management_System.service;

import com.example.E_Waste_Management_System.Model.Certificate;
import com.example.E_Waste_Management_System.Model.User;
import org.springframework.core.io.Resource;

import java.util.List;

public interface CertificateService {
    void checkAndGenerateCertificate(User user);

    // Alternative implementation using absolute positioning with better control
    String generateCertificatePdfWithPrecisePositioning(User user, int completedRequests);

    List<Certificate> getUserCertificates(User user);
    Certificate getCertificateById(Long id);
    Resource getCertificateFile(String filename);
    String generateCertificatePdf(User user, int completedRequests);
}