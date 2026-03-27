package com.tuan.jobmarket.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    /**
     * Proxy endpoint: fetch file từ Cloudinary phía server rồi stream về client.
     * Giải quyết lỗi 401 khi browser cố gắng fetch trực tiếp raw resource từ Cloudinary.
     *
     * GET /api/v1/files/proxy?url=https://res.cloudinary.com/...
     * Yêu cầu JWT (protected route).
     */
    @GetMapping("/files/proxy")
    @ApiMessage("Proxy file from external storage")
    public ResponseEntity<byte[]> proxyFile(@RequestParam("url") String fileUrl) {
        // Chỉ cho phép proxy URL từ Cloudinary
        if (fileUrl == null || !fileUrl.startsWith("https://res.cloudinary.com/")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            URL url = new URL(fileUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(10_000);
            conn.setReadTimeout(30_000);
            conn.setRequestMethod("GET");
            // User-Agent giả lập server request (một số CDN block headless request)
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; JobMarketServer/1.0)");

            int status = conn.getResponseCode();
            if (status != 200) {
                return ResponseEntity.status(status).build();
            }

            // Đọc toàn bộ bytes
            try (InputStream is = conn.getInputStream()) {
                byte[] bytes = is.readAllBytes();

                // Xác định Content-Type từ URL
                String urlLower = fileUrl.toLowerCase().split("\\?")[0];
                String contentType = "application/octet-stream";
                if (urlLower.endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (urlLower.endsWith(".docx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                } else if (urlLower.endsWith(".doc")) {
                    contentType = "application/msword";
                } else if (urlLower.endsWith(".png")) {
                    contentType = "image/png";
                } else if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                }

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(contentType));
                // Cho phép browser render inline (không force download)
                headers.set(HttpHeaders.CONTENT_DISPOSITION, "inline");
                // CORS header cho trường hợp frontend gọi cross-origin
                headers.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");

                return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
}
