package com.example.E_Waste_Management_System.service.impl;

import com.example.E_Waste_Management_System.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;


    @Override
    public String storeFile(MultipartFile file) {
        String original = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String filename = UUID.randomUUID().toString() + "_" + original;
        try {
            Path target = Paths.get(uploadDir).resolve(filename);
            Files.createDirectories(target.getParent());
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return filename;  // ✅ return only filename, not full path
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + original, e);
        }
    }


    @Override
    public List<String> storeFiles(MultipartFile[] files) {
        if (files == null) return Collections.emptyList();
        return Arrays.stream(files)
                .filter(f -> !f.isEmpty())
                .map(this::storeFile)
                .collect(Collectors.toList());
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Unable to read file: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("File not found " + filename, e);
        }
    }

    @Override
    public Path getUploadDir() {
        return Paths.get(uploadDir);
    }
}


//    @Override
//    public String storeFile(MultipartFile file) {
//        String original = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
//        String filename = UUID.randomUUID().toString() + "_" + original;
//        try {
//            Path target = Paths.get(uploadDir).resolve(filename);
//            Files.createDirectories(target.getParent());
//            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
//            return filename;
//        } catch (IOException e) {
//            throw new RuntimeException("Could not store file " + original, e);
//        }
//    }