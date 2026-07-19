package com.kartezy.datawarehouse.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class DataLakeService {
    private final Path lakeBasePath;

    public DataLakeService(@Value("${warehouse.data-lake.path:/data/kartezy/lake}") String lakePath) {
        this.lakeBasePath = Path.of(lakePath);
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(lakeBasePath);
            Files.createDirectories(lakeBasePath.resolve("orders"));
            Files.createDirectories(lakeBasePath.resolve("customers"));
            Files.createDirectories(lakeBasePath.resolve("merchants"));
            Files.createDirectories(lakeBasePath.resolve("delivery"));
            Files.createDirectories(lakeBasePath.resolve("products"));
            Files.createDirectories(lakeBasePath.resolve("payments"));
            Files.createDirectories(lakeBasePath.resolve("analytics"));
            Files.createDirectories(lakeBasePath.resolve("raw"));
        } catch (IOException e) {
            throw new RuntimeException("Cannot initialize data lake at " + lakeBasePath, e);
        }
    }

    public Path storeRawData(String domain, String partition, String data, String format) throws IOException {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        Path dir = lakeBasePath.resolve("raw").resolve(domain).resolve(partition).resolve(dateStr);
        Files.createDirectories(dir);
        Path file = dir.resolve(partition + "_" + System.currentTimeMillis() + "." + format);
        Files.writeString(file, data);
        return file;
    }

    public Path storeProcessedData(String domain, String data, String format) throws IOException {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        Path dir = lakeBasePath.resolve(domain).resolve(dateStr);
        Files.createDirectories(dir);
        Path file = dir.resolve(domain + "_" + System.currentTimeMillis() + "." + format);
        Files.writeString(file, data);
        return file;
    }

    public long getLakeSize() throws IOException {
        return Files.walk(lakeBasePath)
            .filter(Files::isRegularFile)
            .mapToLong(p -> p.toFile().length())
            .sum();
    }

    public boolean cleanupOldData(int retentionDays) throws IOException {
        LocalDate cutoff = LocalDate.now().minusDays(retentionDays);
        try (var stream = Files.walk(lakeBasePath)) {
            stream.filter(Files::isRegularFile)
                .filter(p -> {
                    try {
                        return Files.getLastModifiedTime(p).toInstant()
                            .isBefore(cutoff.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant());
                    } catch (IOException e) { return false; }
                })
                .forEach(p -> { try { Files.delete(p); } catch (IOException e) { } });
        }
        return true;
    }
}
