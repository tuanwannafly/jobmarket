package com.tuan.jobmarket.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tuan.jobmarket.util.error.StorageException;

@Service
public interface FileService {
    String store(MultipartFile file, String folder) throws IOException, StorageException;
    void delete(String publicId) throws IOException;
}
