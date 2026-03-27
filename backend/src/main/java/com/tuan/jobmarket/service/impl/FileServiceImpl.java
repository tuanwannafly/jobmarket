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

    // @Override
    // public void createDirectory(String folder) throws URISyntaxException {
    //     URI uri = new URI(folder);
    //     Path path = Paths.get(uri);
    //     File tmpDir = new File(path.toString());
    //     if (!tmpDir.isDirectory()) {
    //         try {
    //             Files.createDirectory(tmpDir.toPath());
    //             System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + tmpDir.toPath());
    //         } catch (IOException e) {
    //             e.printStackTrace();
    //         }
    //     } else {
    //         System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
    //     }

    // }

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
        // Lấy extension thực từ tên file gốc (lowercase)
        String extLower = originalFilename.toLowerCase();
        boolean isValid = ALLOWED_EXTENSIONS.stream().anyMatch(extLower::endsWith);
        if (!isValid) {
            throw new StorageException(
                    "Invalid file extension. Only allows: " + ALLOWED_EXTENSIONS);
        }

        // Lấy extension để gắn vào URL sau khi upload (ví dụ ".pdf", ".docx")
        String fileExt = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx >= 0) {
            fileExt = originalFilename.substring(dotIdx).toLowerCase(); // ".pdf" / ".docx" / ".doc"
        }

        // 3. Xác định resource_type:
        //    - "image" cho jpg/jpeg/png
        //    - "raw" cho pdf/doc/docx (Cloudinary không auto-serve binary nếu dùng "auto")
        String resourceType = "raw";
        if (extLower.endsWith("jpg") || extLower.endsWith("jpeg") || extLower.endsWith("png")) {
            resourceType = "image";
        }

        // 4. Tạo public_id thủ công: tên gốc (không dấu) + timestamp + extension
        //    Ví dụ: "resume_myfile_1714000000000.pdf"
        //    Quan trọng: public_id CÓ extension → secure_url Cloudinary cũng sẽ có extension
        //    → trình duyệt nhận dạng đúng loại file khi xem và tải xuống.
        String baseName = originalFilename.substring(0, dotIdx >= 0 ? dotIdx : originalFilename.length())
                .replaceAll("[^a-zA-Z0-9_\\-]", "_"); // loại bỏ ký tự đặc biệt
        String publicId = folder + "/" + baseName + "_" + System.currentTimeMillis() + fileExt;

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id",    publicId,         // đặt thủ công → URL có extension
                        "resource_type", resourceType,
                        "type",         "upload",         // đảm bảo public delivery
                        "access_mode",  "public",         // bất kỳ ai cũng xem được qua URL
                        "overwrite",    false));

        // 5. Trả về secure URL (https) từ Cloudinary
        //    Vì public_id đã chứa extension (.pdf/.docx/.doc), secure_url sẽ tự động có đuôi đúng.
        String secureUrl = (String) uploadResult.get("secure_url");
        if (secureUrl == null) {
            throw new StorageException("Upload to Cloudinary failed. No URL returned.");
        }

        return secureUrl;
    }

    // @Override
    // public long getFileLength(String fileName, String folder) throws URISyntaxException {
    //     URI uri = new URI(baseURI + folder + "/" + fileName);
    //     Path path = Paths.get(uri);

    //     File tmpDir = new File(path.toString());

    //     // file không tồn tại, hoặc file là 1 director => return 0
    //     if (!tmpDir.exists() || tmpDir.isDirectory())
    //         return 0;
    //     return tmpDir.length();
    // }

    // @Override
    // public InputStreamResource getResource(String fileName, String folder)
    //         throws URISyntaxException, FileNotFoundException {
    //     URI uri = new URI(baseURI + folder + "/" + fileName);
    //     Path path = Paths.get(uri);

    //     File file = new File(path.toString());
    //     return new InputStreamResource(new FileInputStream(file));
    // }

    @Override
    public void delete(String publicId) throws IOException {
        // TODO Auto-generated method stub
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
    
}
