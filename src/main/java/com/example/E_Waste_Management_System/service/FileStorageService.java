package com.example.E_Waste_Management_System.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

public interface FileStorageService {
    String storeFile(MultipartFile file);
    List<String> storeFiles(MultipartFile[] files);
    Resource loadAsResource(String filename);
    Path getUploadDir();
}
