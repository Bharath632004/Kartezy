package com.kartezy.ocrservice.controller;
import com.kartezy.ocrservice.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
/**
 * REST controller for OCR service.
 * Provides endpoints for various OCR functionalities: invoice, bill, product, document, KYC, receipt.
 */
@RestController
@RequestMapping("/ocr")
public class OcrController {
    @Autowired
    private OcrService ocrService;
    /**
     * Extracts data from an invoice image.
     * @param file the uploaded invoice image file
     * @return a map containing the extracted invoice data
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/invoice")
    public ResponseEntity<Map<String, Object>> extractInvoiceData(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        Map<String, Object> result = ocrService.extractInvoiceData(image);
        return ResponseEntity.ok(result);
    }
    /**
     * Extracts data from a bill image.
     * @param file the uploaded bill image file
     * @return a map containing the extracted bill data
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/bill")
    public ResponseEntity<Map<String, Object>> extractBillData(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        Map<String, Object> result = ocrService.extractBillData(image);
        return ResponseEntity.ok(result);
    }
    /**
     * Extracts product information from a product image.
     * @param file the uploaded product image file
     * @return a map containing the extracted product information
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/product")
    public ResponseEntity<Map<String, Object>> extractProductInfo(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        Map<String, Object> result = ocrService.extractProductInfo(image);
        return ResponseEntity.ok(result);
    }
    /**
     * Extracts text from a document image.
     * @param file the uploaded document image file
     * @return the extracted text as a string
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/document")
    public ResponseEntity<String> extractText(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        String text = ocrService.extractText(image);
        return ResponseEntity.ok(text);
    }
    /**
     * Extracts KYC data from an ID card image.
     * @param file the uploaded ID card image file
     * @return a map containing the extracted KYC data
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/kyc")
    public ResponseEntity<Map<String, Object>> extractKycData(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        Map<String, Object> result = ocrService.extractKycData(image);
        return ResponseEntity.ok(result);
    }
    /**
     * Extracts data from a receipt image.
     * @param file the uploaded receipt image file
     * @return a map containing the extracted receipt data
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/receipt")
    public ResponseEntity<Map<String, Object>> extractReceiptData(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] image = file.getBytes();
        Map<String, Object> result = ocrService.extractReceiptData(image);
        return ResponseEntity.ok(result);
    }
    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OCR service is healthy");
    }
}