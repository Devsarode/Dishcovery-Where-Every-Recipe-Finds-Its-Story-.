package com.example.dishcovery.controller;

import com.example.dishcovery.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService storage;

    public FileController(FileStorageService storage) {
        this.storage = storage;
    }

    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> upload(@RequestPart("file") MultipartFile file) throws IOException {
        String filename = storage.store(file);
        String url = "/api/files/" + filename; // public URL served below
        return ResponseEntity.ok(new FileUploadResponse(filename, url));
    }

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        Path p = storage.load(filename);
        Resource file = new UrlResource(p.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    public static class FileUploadResponse {
        private String filename;
        private String url;
        public FileUploadResponse(String f, String u){this.filename=f; this.url=u;}
        public String getFilename(){return filename;}
        public String getUrl(){return url;}
    }
}
