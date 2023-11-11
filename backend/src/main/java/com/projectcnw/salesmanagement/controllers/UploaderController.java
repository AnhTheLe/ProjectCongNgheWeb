package com.sapo.salemanagement.controllers;

import com.projectcnw.salesmanagement.dto.ResponseObject;
import com.projectcnw.salesmanagement.services.ImageUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("admin/upload")
public class UploaderController {
    private final ImageUploader imageUploader;
    @Autowired
    public UploaderController(ImageUploader imageUploader) {
        this.imageUploader = imageUploader;
    }

    @PostMapping("/image")
    public ResponseEntity<ResponseObject> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        File imageFile = File.createTempFile("image", file.getOriginalFilename());
        file.transferTo(imageFile);
        String url = imageUploader.uploadImage(imageFile);
        return ResponseEntity.ok(ResponseObject.builder()
                .responseCode(200)
                .message("Success")
                .data(url)
                .build());
    }
}