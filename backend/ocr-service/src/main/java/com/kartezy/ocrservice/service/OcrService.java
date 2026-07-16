package com.kartezy.ocrservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@Service
public class OcrService {

    private static final Pattern GST_PATTERN = Pattern.compile("\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[1-9A-Z]{1}Z[A-Z0-9]{1}");
    private static final Pattern PAN_PATTERN = Pattern.compile("[A-Z]{5}\\d{4}[A-Z]{1}");
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\d{4}\\s?\\d{4}\\s?\\d{4}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("[6-9]\\d{9}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PINCODE_PATTERN = Pattern.compile("\\d{6}");
    private static final Pattern AMOUNT_PATTERN = Pattern.compile("(?:Rs|INR|₹)\\s*?\\d+(?:,\\d{3})*(?:\\.\\d{2})?");
    private static final Pattern INVOICE_NUMBER_PATTERN = Pattern.compile("(?:INV|INVOICE|INV-)[\\d-/]+", Pattern.CASE_INSENSITIVE);

    @Cacheable(value = "ocrResults", key = "#documentType + '_' + #file.originalFilename")
    public Map<String, Object> extractText(MultipartFile file) throws IOException {
        log.info("Extracting text from file: {}", file.getOriginalFilename());
        String rawText = simulateOcrExtraction(file);

        Map<String, Object> result = new HashMap<>();
        result.put("text", rawText);
        result.put("confidence", calculateConfidence(rawText));
        result.put("wordCount", rawText.split("\\s+").length);
        result.put("language", detectLanguage(rawText));
        result.put("extractedAt", LocalDate.now().format(DateTimeFormatter.ISO_DATE));

        return result;
    }

    @Cacheable(value = "ocrStructured", key = "#documentType + '_' + #file.originalFilename")
    public Map<String, Object> extractStructuredData(MultipartFile file, String documentType) throws IOException {
        log.info("Extracting structured data from {} document: {}", documentType, file.getOriginalFilename());
        String rawText = simulateOcrExtraction(file);

        switch (documentType.toLowerCase()) {
            case "invoice":
                return extractInvoiceData(rawText);
            case "bill":
            case "receipt":
                return extractBillData(rawText);
            case "gst":
                return extractGstData(rawText);
            case "pan":
                return extractPanData(rawText);
            case "aadhaar":
                return extractAadhaarData(rawText);
            case "business":
                return extractBusinessDocumentData(rawText);
            case "kyc":
                return extractKycData(rawText);
            case "product":
                return extractProductInfo(rawText);
            default:
                Map<String, Object> result = new HashMap<>();
                result.put("text", rawText);
                result.put("confidence", calculateConfidence(rawText));
                result.put("documentType", documentType);
                return result;
        }
    }

    public Map<String, Object> validateDocument(MultipartFile file, String documentType) throws IOException {
        log.info("Validating {} document: {}", documentType, file.getOriginalFilename());
        String rawText = simulateOcrExtraction(file);
        List<String> errors = new ArrayList<>();
        Map<String, Object> validation = new HashMap<>();

        switch (documentType.toLowerCase()) {
            case "gst":
                validation = validateGstDocument(rawText, errors);
                break;
            case "pan":
                validation = validatePanDocument(rawText, errors);
                break;
            case "aadhaar":
                validation = validateAadhaarDocument(rawText, errors);
                break;
            case "invoice":
                validation = validateInvoiceDocument(rawText, errors);
                break;
            default:
                validation.put("isValid", true);
                validation.put("confidence", calculateConfidence(rawText));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("valid", errors.isEmpty());
        result.put("errors", errors);
        result.put("validationDetails", validation);
        result.put("confidence", calculateConfidence(rawText));
        return result;
    }

    private Map<String, Object> extractInvoiceData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("invoiceNumber", extractPattern(rawText, INVOICE_NUMBER_PATTERN));
        data.put("vendorName", extractVendorName(rawText));
        data.put("vendorGst", extractPattern(rawText, GST_PATTERN));
        data.put("invoiceDate", extractDate(rawText));
        data.put("dueDate", extractDueDate(rawText));
        data.put("totalAmount", extractAmount(rawText));
        data.put("taxAmount", extractTaxAmount(rawText));
        data.put("lineItems", extractLineItems(rawText));
        data.put("currency", "INR");
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractBillData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("storeName", extractStoreName(rawText));
        data.put("billNumber", extractPattern(rawText, Pattern.compile("(?:BILL|BILL-|REC|REC-)[\\d-/]+", Pattern.CASE_INSENSITIVE)));
        data.put("billDate", extractDate(rawText));
        data.put("items", extractLineItems(rawText));
        data.put("totalAmount", extractAmount(rawText));
        data.put("paymentMethod", extractPaymentMethod(rawText));
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractGstData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("gstNumber", extractPattern(rawText, GST_PATTERN));
        data.put("legalName", extractLegalName(rawText));
        data.put("tradeName", extractTradeName(rawText));
        data.put("gstType", determineGstType(rawText));
        data.put("registrationDate", extractDate(rawText));
        data.put("status", "ACTIVE");
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractPanData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        String panNumber = extractPattern(rawText, PAN_PATTERN);
        data.put("panNumber", panNumber);
        data.put("nameOnCard", extractName(rawText));
        data.put("fatherName", extractFatherName(rawText));
        data.put("dateOfBirth", extractDate(rawText));
        data.put("panType", panNumber != null ? panNumber.substring(3, 4) : "P");
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractAadhaarData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("aadhaarNumber", extractPattern(rawText, AADHAAR_PATTERN));
        data.put("name", extractName(rawText));
        data.put("dateOfBirth", extractDate(rawText));
        data.put("gender", extractGender(rawText));
        data.put("address", extractAddress(rawText));
        data.put("phone", extractPattern(rawText, PHONE_PATTERN));
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractBusinessDocumentData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("businessName", extractVendorName(rawText));
        data.put("registrationNumber", extractPattern(rawText, Pattern.compile("[A-Z]{2}\\d{2}[A-Z]{2}\\d{4}[A-Z0-9]{6}")));
        data.put("gstNumber", extractPattern(rawText, GST_PATTERN));
        data.put("address", extractAddress(rawText));
        data.put("contactNumber", extractPattern(rawText, PHONE_PATTERN));
        data.put("email", extractPattern(rawText, EMAIL_PATTERN));
        data.put("businessType", determineBusinessType(rawText));
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractKycData(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("fullName", extractName(rawText));
        data.put("dateOfBirth", extractDate(rawText));
        data.put("address", extractAddress(rawText));
        data.put("phone", extractPattern(rawText, PHONE_PATTERN));
        data.put("email", extractPattern(rawText, EMAIL_PATTERN));
        data.put("panNumber", extractPattern(rawText, PAN_PATTERN));
        data.put("aadhaarNumber", extractPattern(rawText, AADHAAR_PATTERN));
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    private Map<String, Object> extractProductInfo(String rawText) {
        Map<String, Object> data = new HashMap<>();
        data.put("productName", extractProductName(rawText));
        data.put("brand", extractBrand(rawText));
        data.put("price", extractAmount(rawText));
        data.put("mrp", extractMrp(rawText));
        data.put("expiryDate", extractDate(rawText));
        data.put("batchNumber", extractPattern(rawText, Pattern.compile("BATCH[-:]\\s*[A-Z0-9]+", Pattern.CASE_INSENSITIVE)));
        data.put("confidence", calculateConfidence(rawText));
        return data;
    }

    // Validation methods
    private Map<String, Object> validateGstDocument(String rawText, List<String> errors) {
        Map<String, Object> validation = new HashMap<>();
        String gstNumber = extractPattern(rawText, GST_PATTERN);
        if (gstNumber == null || gstNumber.length() != 15) {
            errors.add("INVALID_GST_FORMAT");
        }
        validation.put("gstNumber", gstNumber);
        validation.put("hasValidFormat", gstNumber != null && gstNumber.length() == 15);
        return validation;
    }

    private Map<String, Object> validatePanDocument(String rawText, List<String> errors) {
        Map<String, Object> validation = new HashMap<>();
        String panNumber = extractPattern(rawText, PAN_PATTERN);
        if (panNumber == null || panNumber.length() != 10) {
            errors.add("INVALID_PAN_FORMAT");
        }
        validation.put("panNumber", panNumber);
        validation.put("hasValidFormat", panNumber != null && panNumber.length() == 10);
        return validation;
    }

    private Map<String, Object> validateAadhaarDocument(String rawText, List<String> errors) {
        Map<String, Object> validation = new HashMap<>();
        String aadhaarNumber = extractPattern(rawText, AADHAAR_PATTERN);
        if (aadhaarNumber == null) {
            errors.add("INVALID_AADHAAR_FORMAT");
        }
        validation.put("aadhaarNumber", aadhaarNumber);
        validation.put("hasValidAadhaarFormat", aadhaarNumber != null);
        return validation;
    }

    private Map<String, Object> validateInvoiceDocument(String rawText, List<String> errors) {
        Map<String, Object> validation = new HashMap<>();
        String invoiceNumber = extractPattern(rawText, INVOICE_NUMBER_PATTERN);
        String gstNumber = extractPattern(rawText, GST_PATTERN);
        String amount = extractAmount(rawText);

        if (invoiceNumber == null) errors.add("MISSING_INVOICE_NUMBER");
        if (gstNumber == null) errors.add("MISSING_GST_NUMBER");
        if (amount == null) errors.add("MISSING_TOTAL_AMOUNT");

        validation.put("hasInvoiceNumber", invoiceNumber != null);
        validation.put("hasGstNumber", gstNumber != null);
        validation.put("hasAmount", amount != null);
        return validation;
    }

    // Simulated OCR extraction (would use Tesseract/Google Cloud Vision/AWS Textract in production)
    private String simulateOcrExtraction(MultipartFile file) throws IOException {
        try {
            byte[] bytes = file.getBytes();
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));

            if (image == null) {
                log.warn("Could not read image from file: {}", file.getOriginalFilename());
                return generateSimulatedText(file.getOriginalFilename());
            }

            log.info("Processing image: {}x{}", image.getWidth(), image.getHeight());
            return generateSimulatedText(file.getOriginalFilename());
        } catch (IOException e) {
            log.error("Failed to process file: {}", file.getOriginalFilename(), e);
            throw e;
        }
    }

    private String generateSimulatedText(String filename) {
        StringBuilder sb = new StringBuilder();
        sb.append("INVOICE/BILL DOCUMENT\n");
        sb.append("====================\n");
        sb.append("Invoice No: INV-2024-").append(Math.abs(filename.hashCode() % 10000)).append("\n");
        sb.append("Date: ").append(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append("\n");
        sb.append("Vendor: Kartezy Vendor Solutions Pvt Ltd\n");
        sb.append("GSTIN: 27AABCU9603R1ZM\n");
        sb.append("PAN: AABCU9603R\n");
        sb.append("Address: 123, Tech Park, Bangalore - 560001\n");
        sb.append("Phone: 9876543210\n");
        sb.append("Email: vendor@kartezy.com\n\n");
        sb.append("Items:\n");
        sb.append("1. Product A - Qty: 2 - Rate: 500 - Amount: 1000\n");
        sb.append("2. Product B - Qty: 1 - Rate: 1500 - Amount: 1500\n");
        sb.append("3. Product C - Qty: 3 - Rate: 200 - Amount: 600\n\n");
        sb.append("Subtotal: 3100\n");
        sb.append("GST (18%): 558\n");
        sb.append("Total: 3658\n");
        sb.append("Payment: UPI - UPIREF123456\n\n");
        sb.append("Aadhaar: 1234 5678 9012\n");
        sb.append("DOB: 15/08/1990\n");
        sb.append("Gender: MALE\n");
        return sb.toString();
    }

    private double calculateConfidence(String text) {
        if (text == null || text.isEmpty()) return 0.0;
        double hasNumbers = text.matches(".*\\d+.*") ? 0.3 : 0.0;
        double hasStructures = text.matches(".*[A-Z]{3,}.*") ? 0.3 : 0.0;
        double hasSpecialChars = text.matches(".*[\\-:/].*") ? 0.2 : 0.0;
        double textLength = Math.min(1.0, text.length() / 500.0) * 0.2;
        return Math.round(Math.min(1.0, hasNumbers + hasStructures + hasSpecialChars + textLength) * 100.0) / 100.0;
    }

    private String detectLanguage(String text) {
        if (text == null || text.isEmpty()) return "unknown";
        if (text.matches(".*[\\u0900-\\u097F].*")) return "hi";
        if (text.matches(".*[\\u0B80-\\u0BFF].*")) return "ta";
        return "en";
    }

    // Extraction helpers
    private String extractPattern(String text, Pattern pattern) {
        java.util.regex.Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group().trim() : null;
    }

    private String extractVendorName(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("vendor") || line.toLowerCase().contains("seller")
                    || line.toLowerCase().contains("supplier")) {
                return line.replaceAll("(?i)vendor|seller|supplier|:", "").trim();
            }
        }
        return null;
    }

    private String extractStoreName(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("store") || line.toLowerCase().contains("shop")) {
                return line.replaceAll("(?i)store|shop|:", "").trim();
            }
        }
        return null;
    }

    private String extractDate(String text) {
        Pattern[] datePatterns = {
                Pattern.compile("\\d{2}/\\d{2}/\\d{4}"),
                Pattern.compile("\\d{4}-\\d{2}-\\d{2}"),
                Pattern.compile("\\d{2}-\\d{2}-\\d{4}")
        };
        for (Pattern p : datePatterns) {
            String match = extractPattern(text, p);
            if (match != null) return match;
        }
        return null;
    }

    private String extractDueDate(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("due date") || line.toLowerCase().contains("due on")) {
                return extractDate(line);
            }
        }
        return null;
    }

    private String extractAmount(String text) {
        java.util.regex.Matcher matcher = Pattern.compile("(?:Rs|INR|₹)\\s*(\\d+(?:,\\d{3})*(?:\\.\\d{2})?|\\d+\\.\\d{2})").matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private String extractTaxAmount(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("gst") || line.toLowerCase().contains("tax")
                    || line.toLowerCase().contains("vat")) {
                java.util.regex.Matcher matcher = AMOUNT_PATTERN.matcher(line);
                if (matcher.find()) return matcher.group();
            }
        }
        return null;
    }

    private List<Map<String, Object>> extractLineItems(String text) {
        List<Map<String, Object>> items = new ArrayList<>();
        String[] lines = text.split("\n");
        boolean inItems = false;

        for (String line : lines) {
            if (line.toLowerCase().contains("items") || line.toLowerCase().contains("products")
                    || line.toLowerCase().contains("description")) {
                inItems = true;
                continue;
            }
            if (inItems && (line.toLowerCase().contains("subtotal") || line.toLowerCase().contains("total"))) {
                break;
            }
            if (inItems && line.matches(".*\\d+.*")) {
                Map<String, Object> item = new HashMap<>();
                item.put("description", line.replaceAll("\\d+.*", "").trim());
                java.util.regex.Matcher qtyMatcher = Pattern.compile("Qty:\\s*(\\d+)", Pattern.CASE_INSENSITIVE).matcher(line);
                java.util.regex.Matcher rateMatcher = Pattern.compile("Rate:\\s*(\\d+)", Pattern.CASE_INSENSITIVE).matcher(line);
                item.put("quantity", qtyMatcher.find() ? qtyMatcher.group(1) : "1");
                item.put("rate", rateMatcher.find() ? rateMatcher.group(1) : "0");
                items.add(item);
            }
        }
        return items;
    }

    private String extractName(String text) {
        for (String line : text.split("\n")) {
            line = line.trim();
            if (line.toLowerCase().startsWith("name") || line.toLowerCase().startsWith("applicant")) {
                return line.replaceAll("(?i)name|applicant|:|\\d", "").trim();
            }
        }
        return null;
    }

    private String extractFatherName(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("father") || line.toLowerCase().contains("guardian")) {
                return line.replaceAll("(?i)father|guardian|:|name|'s", "").trim();
            }
        }
        return null;
    }

    private String extractGender(String text) {
        if (text.contains("MALE") || text.contains("Male")) return "MALE";
        if (text.contains("FEMALE") || text.contains("Female")) return "FEMALE";
        if (text.contains("TRANSGENDER")) return "TRANSGENDER";
        return null;
    }

    private String extractAddress(String text) {
        StringBuilder address = new StringBuilder();
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("address") || line.toLowerCase().contains("addr")) {
                String addr = line.replaceAll("(?i)address|addr|:", "").trim();
                if (!addr.isEmpty()) {
                    if (address.length() > 0) address.append(", ");
                    address.append(addr);
                }
            } else if (address.length() > 0 && line.matches(".*\\d{6}.*")) {
                address.append(", ").append(line.trim());
                break;
            }
        }
        return address.length() > 0 ? address.toString() : null;
    }

    private String extractLegalName(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("legal name") || line.toLowerCase().contains("legal")) {
                return line.replaceAll("(?i)legal|name|:", "").trim();
            }
        }
        return null;
    }

    private String extractTradeName(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("trade name") || line.toLowerCase().contains("trade")) {
                return line.replaceAll("(?i)trade|name|:", "").trim();
            }
        }
        return null;
    }

    private String extractPaymentMethod(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("payment") || line.toLowerCase().contains("paid")) {
                if (line.contains("UPI")) return "UPI";
                if (line.contains("CARD")) return "CARD";
                if (line.contains("CASH") || line.contains("COD")) return "COD";
                if (line.contains("NET BANKING")) return "NET_BANKING";
                if (line.contains("WALLET")) return "WALLET";
            }
        }
        return "UNKNOWN";
    }

    private String extractMrp(String text) {
        for (String line : text.split("\n")) {
            if (line.toUpperCase().contains("MRP") || line.toLowerCase().contains("mrp")) {
                java.util.regex.Matcher matcher = AMOUNT_PATTERN.matcher(line);
                if (matcher.find()) return matcher.group();
            }
        }
        return null;
    }

    private String extractProductName(String text) {
        for (String line : text.split("\n")) {
            line = line.trim();
            if (line.toLowerCase().contains("product") || line.toLowerCase().contains("item")) {
                return line.replaceAll("(?i)product|item|name|:", "").trim();
            }
        }
        return null;
    }

    private String extractBrand(String text) {
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("brand") || line.toLowerCase().contains("mfr")) {
                return line.replaceAll("(?i)brand|mfr|manufacturer|:", "").trim();
            }
        }
        return null;
    }

    private String determineGstType(String text) {
        if (text.contains("COMPOSITION") || text.contains("composition")) return "COMPOSITION";
        if (text.contains("REGULAR") || text.contains("regular")) return "REGULAR";
        if (text.contains("UNREGISTERED") || text.contains("unregistered")) return "UNREGISTERED";
        return "REGULAR";
    }

    private String determineBusinessType(String text) {
        if (text.toLowerCase().contains("private limited") || text.contains("PVT LTD")) return "PRIVATE_LIMITED";
        if (text.toLowerCase().contains("limited") || text.contains("LTD")) return "LIMITED";
        if (text.toLowerCase().contains("partnership")) return "PARTNERSHIP";
        if (text.toLowerCase().contains("proprietor") || text.toLowerCase().contains("sole")) return "SOLE_PROPRIETORSHIP";
        if (text.toLowerCase().contains("llp")) return "LLP";
        return "OTHER";
    }
}
