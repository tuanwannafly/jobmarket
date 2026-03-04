package com.tuan.jobmarket.service;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileService {
    void createDirectory(String folder) throws URISyntaxException ;
    String store(MultipartFile file, String folder) throws URISyntaxException, IOException;
}
