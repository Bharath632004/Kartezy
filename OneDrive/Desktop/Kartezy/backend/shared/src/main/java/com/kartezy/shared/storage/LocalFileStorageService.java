package com.kartezy.shared.storage;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@ConditionalOnProperty(name = "kartezy.storage.type", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements FileStorageService {

    @Value("${kartezy.storage.local.path:./uploads}")
    private String basePath;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(basePath));
        } catch (IOException e) {
            log.error("Could not create upload directory: {}", basePath, e);
        }
    }

    @Override
    public String upload(String bucket, String key, MultipartFile file) {
        try {
            return upload(bucket, key, file.getInputStream(), file.getContentType(), file.getSize());
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public String upload(String bucket, String key, InputStream inputStream, String contentType, long size) {
        try {
            Path bucketPath = Paths.get(basePath, bucket);
            Files.createDirectories(bucketPath);
            String uniqueKey = (key != null ? key : UUID.randomUUID().toString());
            Path targetPath = bucketPath.resolve(uniqueKey);
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            String url = "/uploads/" + bucket + "/" + uniqueKey;
            log.info("File uploaded: {}", url);
            return url;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public void delete(String fileUrl) {
        try {
            Path path = Paths.get(basePath, fileUrl.replace("/uploads/", ""));
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", fileUrl, e);
        }
    }

    @Override
    public String getUrl(String bucket, String key) {
        return "/uploads/" + bucket + "/" + key;
    }

    @Override
    public List<String> listFiles(String bucket) {
        try (Stream<Path> walk = Files.walk(Paths.get(basePath, bucket), 1)) {
            return walk.filter(Files::isRegularFile)
                .map(p -> "/uploads/" + bucket + "/" + p.getFileName().toString())
                .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }

    @Override
    public boolean exists(String fileUrl) {
        Path path = Paths.get(basePath, fileUrl.replace("/uploads/", ""));
        return Files.exists(path);
    }
}
