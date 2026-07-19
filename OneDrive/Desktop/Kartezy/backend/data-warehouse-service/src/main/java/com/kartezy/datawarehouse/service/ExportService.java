package com.kartezy.datawarehouse.service;

import com.opencsv.CSVWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Service
public class ExportService {
    private final Path tempDir;

    public ExportService() {
        this.tempDir = Path.of(System.getProperty("java.io.tmpdir"), "kartezy", "exports");
        try { Files.createDirectories(tempDir); } catch (IOException e) { throw new RuntimeException(e); }
    }

    public File exportToCsv(List<Map<String, Object>> data, String filename) throws IOException {
        File file = tempDir.resolve(filename + ".csv").toFile();
        try (CSVWriter writer = new CSVWriter(new FileWriter(file))) {
            if (!data.isEmpty()) {
                writer.writeNext(data.get(0).keySet().toArray(new String[0]));
                for (Map<String, Object> row : data) {
                    writer.writeNext(row.values().stream().map(v -> v != null ? v.toString() : "").toArray(String[]::new));
                }
            }
        }
        return file;
    }

    public File exportToExcel(List<Map<String, Object>> data, String filename) throws IOException {
        File file = tempDir.resolve(filename + ".xlsx").toFile();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Report");
            if (!data.isEmpty()) {
                Row header = sheet.createRow(0);
                CellStyle headerStyle = workbook.createCellStyle();
                Font headerFont = workbook.createFont(); headerFont.setBold(true);
                headerStyle.setFont(headerFont);
                String[] keys = data.get(0).keySet().toArray(new String[0]);
                for (int i = 0; i < keys.length; i++) { Cell cell = header.createCell(i); cell.setCellValue(keys[i]); cell.setCellStyle(headerStyle); }
                for (int r = 0; r < data.size(); r++) {
                    Row row = sheet.createRow(r + 1);
                    Map<String, Object> rowData = data.get(r);
                    for (int c = 0; c < keys.length; c++) {
                        Object val = rowData.get(keys[c]);
                        if (val instanceof Number) row.createCell(c).setCellValue(((Number) val).doubleValue());
                        else row.createCell(c).setCellValue(val != null ? val.toString() : "");
                    }
                }
                for (int i = 0; i < keys.length; i++) sheet.autoSizeColumn(i);
            }
            try (FileOutputStream out = new FileOutputStream(file)) { workbook.write(out); }
        }
        return file;
    }

    public File exportToPdf(String title, List<Map<String, Object>> data, String filename) throws IOException {
        // Generate a simple HTML table and convert via a lightweight approach
        // For a production system, integrate with iText or Apache PDFBox
        File file = tempDir.resolve(filename + ".pdf").toFile();
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>").append(title).append("</title>");
        html.append("<style>body{font-family:Arial,sans-serif;margin:40px}h1{color:#333;border-bottom:2px solid #ff6b35;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background-color:#ff6b35;color:#fff;padding:10px;text-align:left}td{padding:8px;border-bottom:1px solid #ddd}tr:hover{background-color:#f5f5f5}</style></head><body>");
        html.append("<h1>").append(title).append("</h1>");
        if (!data.isEmpty()) {
            html.append("<table><thead><tr>");
            for (String key : data.get(0).keySet()) html.append("<th>").append(key).append("</th>");
            html.append("</tr></thead><tbody>");
            for (Map<String, Object> row : data) {
                html.append("<tr>");
                for (Object val : row.values()) html.append("<td>").append(val != null ? val.toString() : "").append("</td>");
                html.append("</tr>");
            }
            html.append("</tbody></table>");
        }
        html.append("</body></html>");
        Files.writeString(file.toPath(), html.toString());
        return file;
    }
}
