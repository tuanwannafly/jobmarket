package com.tuan.jobmarket.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tuan.jobmarket.service.FileService;
import com.tuan.jobmarket.util.error.StorageException;

@Service
public class FileServiceImpl implements FileService {

    private final Cloudinary cloudinary;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "jpg", "jpeg", "png", "doc", "docx");

    public FileServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }


    // @Value("${tuanjobmarket.upload-file.base-path}")
    // private String baseURI;

    @Override
    public void createDirectory(String folder) throws URISyntaxException {
        URI uri = new URI(folder);
        Path path = Paths.get(uri);
        File tmpDir = new File(path.toString());
        if (!tmpDir.isDirectory()) {
            try {
                Files.createDirectory(tmpDir.toPath());
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + tmpDir.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }

    }

    @Override
    public String store(MultipartFile file, String folder) throws IOException, StorageException {
        // 1. Validate file không rỗng
        if (file == null || file.isEmpty()) {
            throw new StorageException("File is empty. Please upload a file.");
        }

        // 2. Validate extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new StorageException("Cannot determine file name.");
        }
        String ext = originalFilename.toLowerCase();
        boolean isValid = ALLOWED_EXTENSIONS.stream().anyMatch(ext::endsWith);
        if (!isValid) {
            throw new StorageException(
                    "Invalid file extension. Only allows: " + ALLOWED_EXTENSIONS);
        }

        // 3. Xác định resource_type:
        //    - "image" cho jpg/jpeg/png
        //    - "raw" cho pdf/doc/docx (Cloudinary không auto-serve binary nếu dùng "auto")
        String resourceType = "raw";
        if (ext.endsWith("jpg") || ext.endsWith("jpeg") || ext.endsWith("png")) {
            resourceType = "image";
        }

        // 4. Upload lên Cloudinary
        //    use_filename=true  → giữ tên gốc
        //    unique_filename=true → tự thêm suffix tránh trùng
        //    overwrite=false    → không ghi đè file cũ
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", resourceType,
                        "use_filename", true,
                        "unique_filename", true,
                        "overwrite", false));

        // 5. Trả về secure URL (https)
        String secureUrl = (String) uploadResult.get("secure_url");
        if (secureUrl == null) {
            throw new StorageException("Upload to Cloudinary failed. No URL returned.");
        }
        return secureUrl;
    }

    @Override
    public long getFileLength(String fileName, String folder) throws URISyntaxException {
        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File tmpDir = new File(path.toString());

        // file không tồn tại, hoặc file là 1 director => return 0
        if (!tmpDir.exists() || tmpDir.isDirectory())
            return 0;
        return tmpDir.length();
    }

    @Override
    public InputStreamResource getResource(String fileName, String folder)
            throws URISyntaxException, FileNotFoundException {
        URI uri = new URI(baseURI + folder + "/" + fileName);
        Path path = Paths.get(uri);

        File file = new File(path.toString());
        return new InputStreamResource(new FileInputStream(file));
    }

    @Override
    public void delete(String publicId) throws IOException {
        // TODO Auto-generated method stub
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
    
}
