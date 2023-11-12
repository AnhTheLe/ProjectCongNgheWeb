package com.projectcnw.salesmanagement.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploader {
    private final Cloudinary cloudinary;

    @Autowired
    public ImageUploader(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(File imageFile) throws IOException {

        Map<String, String> result = cloudinary.uploader().upload(imageFile, ObjectUtils.emptyMap());
        return result.get("secure_url");
    }
}
