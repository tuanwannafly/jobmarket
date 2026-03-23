package com.tuan.jobmarket.controller;

import java.io.IOException;
import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tuan.jobmarket.domain.response.file.ResUploadFileDTO;
import com.tuan.jobmarket.service.FileService;
import com.tuan.jobmarket.util.annotation.ApiMessage;
import com.tuan.jobmarket.util.error.StorageException;

@RestController
@RequestMapping("/api/v1")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @ApiMessage("Upload single file")
    public ResponseEntity<ResUploadFileDTO> upload(
            @RequestParam(name = "file", required = false) MultipartFile file,
            @RequestParam(name = "folder", defaultValue = "general") String folder
    ) throws IOException, StorageException {

        String fileUrl = this.fileService.store(file, folder);

        ResUploadFileDTO res = new ResUploadFileDTO(fileUrl, Instant.now());
        return ResponseEntity.ok().body(res);
    }
}
