package com.example.dishcovery.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
  private final Path rootLocation;

  public FileStorageService(@Value("${dish.storage.location}") String storageLocation) {
    this.rootLocation = Paths.get(storageLocation).toAbsolutePath().normalize();
    try { Files.createDirectories(rootLocation); } catch(Exception e) { /* ignore */ }
  }

  public String store(MultipartFile file) throws IOException {
    String ext = "";
    String original = file.getOriginalFilename();
    if (original != null && original.contains(".")) {
      ext = original.substring(original.lastIndexOf('.'));
    }
    String filename = UUID.randomUUID().toString() + ext;
    Path target = rootLocation.resolve(filename);
    try (InputStream in = file.getInputStream()) {
      Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
    }
    return filename;
  }

  public Path load(String filename) {
    return rootLocation.resolve(filename).normalize();
  }
}
