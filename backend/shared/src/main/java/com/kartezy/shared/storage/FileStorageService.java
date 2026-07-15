package com.kartezy.shared.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.List;

/**
 * Abstraction for file storage - supports Local, S3, and cloud storage.
 * Implement this interface for different storage backends.
 */
public interface FileStorageService {

    /**
     * Upload a file and return its URL/path.
     */
    String upload(String bucket, String key, MultipartFile file);

    /**
     * Upload a file from an input stream.
     */
    String upload(String bucket, String key, InputStream inputStream, String contentType, long size);

    /**
     * Delete a file by its URL.
     */
    void delete(String fileUrl);

    /**
     * Get a download URL for a file.
     */
    String getUrl(String bucket, String key);

    /**
     * List all files in a bucket.
     */
    List<String> listFiles(String bucket);

    /**
     * Check if a file exists.
     */
    boolean exists(String fileUrl);
}
