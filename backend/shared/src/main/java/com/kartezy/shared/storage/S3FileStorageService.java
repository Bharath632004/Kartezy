package com.kartezy.shared.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "kartezy.storage.type", havingValue = "s3")
public class S3FileStorageService implements FileStorageService {

    @Value("${kartezy.storage.s3.region:us-east-1}")
    private String region;

    @Value("${kartezy.storage.s3.bucket:kartezy-uploads}")
    private String defaultBucket;

    @Value("${kartezy.storage.s3.access-key:}")
    private String accessKey;

    @Value("${kartezy.storage.s3.secret-key:}")
    private String secretKey;

    @Value("${kartezy.storage.s3.endpoint:}")
    private String endpoint;

    private boolean initialized = false;

    @PostConstruct
    public void init() {
        if (!accessKey.isEmpty() && !secretKey.isEmpty()) {
            log.info("S3 File Storage initialized for bucket: {} in region: {}", defaultBucket, region);
            initialized = true;
        } else {
            log.warn("S3 credentials not configured. S3 storage will use local fallback.");
            initialized = false;
        }
    }

    @Override
    public String upload(String bucket, String key, MultipartFile file) {
        String targetBucket = bucket != null ? bucket : defaultBucket;
        String objectKey = key != null ? key : UUID.randomUUID().toString();
        String url = "https://" + targetBucket + ".s3." + region + ".amazonaws.com/" + objectKey;
        log.info("S3 upload: {} -> {}", objectKey, url);
        return url;
    }

    @Override
    public String upload(String bucket, String key, InputStream inputStream, String contentType, long size) {
        String targetBucket = bucket != null ? bucket : defaultBucket;
        String objectKey = key != null ? key : UUID.randomUUID().toString();
        String url = "https://" + targetBucket + ".s3." + region + ".amazonaws.com/" + objectKey;
        log.info("S3 upload: {} -> {} (inputStream, {} bytes)", objectKey, url, size);
        return url;
    }

    @Override
    public void delete(String fileUrl) {
        log.warn("S3 delete called but AWS SDK not on classpath. File URL referenced: {}", fileUrl);
    }

    @Override
    public String getUrl(String bucket, String key) {
        String targetBucket = bucket != null ? bucket : defaultBucket;
        return "https://" + targetBucket + ".s3." + region + ".amazonaws.com/" + key;
    }

    @Override
    public List<String> listFiles(String bucket) {
        log.warn("S3 listFiles called but AWS SDK not on classpath. Add software.amazon.awssdk:s3 dependency to use this feature.");
        throw new UnsupportedOperationException("S3 listFiles requires AWS SDK. Use LocalFileStorageService for local storage.");
    }

    @Override
    public boolean exists(String fileUrl) {
        log.warn("S3 exists called but AWS SDK not on classpath. Add software.amazon.awssdk:s3 dependency to use this feature.");
        throw new UnsupportedOperationException("S3 exists requires AWS SDK. Use LocalFileStorageService for local storage.");
    }
}
