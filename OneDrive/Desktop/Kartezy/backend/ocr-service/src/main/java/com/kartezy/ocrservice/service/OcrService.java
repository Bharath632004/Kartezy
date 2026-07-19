package com.kartezy.ocrservice.service;

import com.kartezy.shared.ai.OCRSchemas.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OcrService {

    private static final Set<String> SUPPORTED_TYPES = Set.of("INVOICE", "RECEIPT", "BILL", "GST", "PAN", "AADHAAR", "BUSINESS_DOCUMENT");

    private static final Map<String, List<Pattern>> IDENTIFICATION_PATTERNS = Map.of(
            "INVOICE", List.of(Pattern.compile("(?:INVOICE|TAX\\s*INVOICE|BILL|SALES\\s*INVOICE)", Pattern.CASE_INSENSITIVE)),
            "GST", List.of(Pattern.compile("\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}Z[A-Z\\d]{1}", Pattern.CASE_INSENSITIVE)),
            "PAN", List.of(Pattern.compile("[A-Z]{5}\\d{4}[A-Z]{1}", Pattern.CASE_INSENSITIVE)),
            "AADHAAR", List.of(Pattern.compile("\\d{4}\\s?\\d{4}\\s?\\d{4}", Pattern.CASE_INSENSITIVE)));

    public OCRResult processDocument(OCRRequest request) {
        String docType = classifyDocument(request.getDocumentType());
        OCRResult result = new OCRResult(UUID.randomUUID().toString(), docType);
        long startTime = System.currentTimeMillis();

        String rawText = extractRawText(request.getDocumentContent());
        result.setRawText(rawText);
        result.setConfidence(calculateConfidence(rawText, docType));

        Map<String, Object> structured = extractStructuredFields(rawText, docType);
        structured.forEach(result::addStructuredData);
        structured.forEach((k, v) -> result.getFields().add(
                new OCRField(k, v != null ? v.toString() : "", v != null && !v.toString().isEmpty() ? 0.85 : 0.0)));

        result.getValidations().addAll(validateExtractedData(structured, docType));
        result.setProcessingTimeMs(System.currentTimeMillis() - startTime);
        return result;
    }

    public OCRResult extractInvoice(byte[] content) {
        OCRRequest req = new OCRRequest(); req.setDocumentType("INVOICE"); req.setDocumentContent(content);
        return processDocument(req);
    }

    public OCRResult extractGST(byte[] content) {
        OCRRequest req = new OCRRequest(); req.setDocumentType("GST"); req.setDocumentContent(content);
        return processDocument(req);
    }

    public OCRResult extractPAN(byte[] content) {
        OCRRequest req = new OCRRequest(); req.setDocumentType("PAN"); req.setDocumentContent(content);
        return processDocument(req);
    }

    public OCRResult extractAadhaar(byte[] content) {
        OCRRequest req = new OCRRequest(); req.setDocumentType("AADHAAR"); req.setDocumentContent(content);
        return processDocument(req);
    }

    public InvoiceData extractInvoiceData(byte[] content) {
        return convertToInvoiceData(extractInvoice(content));
    }

    public List<OCRValidation> validateDocument(byte[] content, String docType) {
        OCRRequest req = new OCRRequest(); req.setDocumentType(docType); req.setDocumentContent(content);
        return processDocument(req).getValidations();
    }

    private String classifyDocument(String docType) {
        if (docType != null && SUPPORTED_TYPES.contains(docType.toUpperCase())) return docType.toUpperCase();
        return "UNKNOWN";
    }

    private String extractRawText(byte[] content) {
        return (content == null || content.length == 0) ? "" : Arrays.toString(Arrays.copyOfRange(content, 0, Math.min(1000, content.length)));
    }

    private Map<String, Object> extractStructuredFields(String text, String docType) {
        return switch (docType) {
            case "INVOICE", "BILL", "RECEIPT" -> extractInvoiceFields(text);
            case "GST" -> extractGSTFields(text);
            case "PAN" -> extractPANFields(text);
            case "AADHAAR" -> extractAadhaarFields(text);
            default -> Map.of("extractedText", text.substring(0, Math.min(500, text.length())), "textLength", text.length());
        };
    }

    private Map<String, Object> extractInvoiceFields(String text) {
        Map<String, Object> fields = new LinkedHashMap<>();
        Matcher m = Pattern.compile("(?:Invoice|Bill|INV)\\s*(?:No|Number|#)?\\s*[:#]?\\s*(\\w+[-/]?\\w+)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("invoiceNumber", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Date|Invoice Date|Bill Date)\\s*[:#]?\\s*(\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4})", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("invoiceDate", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Total|Grand Total|Amount Due)\\s*[:#]?\\s*(?:Rs|₹|INR)?\\s*(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("totalAmount", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Vendor|Seller|From|Supplier|Company)\\s*[:#]?\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("vendorName", m.find() ? m.group(1).trim() : "");
        m = Pattern.compile("\\b(\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}Z[A-Z\\d]{1})\\b").matcher(text);
        fields.put("gstNumber", m.find() ? m.group(1) : "");
        return fields;
    }

    private Map<String, Object> extractGSTFields(String text) {
        Map<String, Object> fields = new LinkedHashMap<>();
        Matcher m = Pattern.compile("\\b(\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}Z[A-Z\\d]{1})\\b").matcher(text);
        fields.put("gstNumber", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Name|Legal Name|Trade Name)\\s*[:#]?\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("legalName", m.find() ? m.group(1).trim() : "");
        return fields;
    }

    private Map<String, Object> extractPANFields(String text) {
        Map<String, Object> fields = new LinkedHashMap<>();
        Matcher m = Pattern.compile("\\b([A-Z]{5}\\d{4}[A-Z]{1})\\b").matcher(text);
        fields.put("panNumber", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Name|Applicant's Name)\\s*[:#]?\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("name", m.find() ? m.group(1).trim() : "");
        return fields;
    }

    private Map<String, Object> extractAadhaarFields(String text) {
        Map<String, Object> fields = new LinkedHashMap<>();
        Matcher m = Pattern.compile("\\b(\\d{4}\\s?\\d{4}\\s?\\d{4})\\b").matcher(text);
        fields.put("aadhaarNumber", m.find() ? m.group(1) : "");
        m = Pattern.compile("(?:Name)\\s*[:#]?\\s*([A-Za-z\\s]+)", Pattern.CASE_INSENSITIVE).matcher(text);
        fields.put("name", m.find() ? m.group(1).trim() : "");
        return fields;
    }

    private double calculateConfidence(String text, String docType) {
        if (text == null || text.isEmpty()) return 0.0;
        List<Pattern> patterns = IDENTIFICATION_PATTERNS.get(docType);
        if (patterns == null) return 0.5;
        double matchRate = patterns.stream().filter(p -> p.matcher(text).find()).count() / (double) patterns.size();
        return Math.min(1.0, 0.5 + matchRate * 0.4);
    }

    private List<OCRValidation> validateExtractedData(Map<String, Object> data, String docType) {
        List<OCRValidation> validations = new ArrayList<>();
        switch (docType) {
            case "GST" -> {
                String gst = (String) data.getOrDefault("gstNumber", "");
                validations.add(new OCRValidation("gstNumber", !gst.isEmpty() && gst.length() == 15,
                        gst.isEmpty() ? "GST number not found" : "Valid", "ERROR"));
            }
            case "PAN" -> {
                String pan = (String) data.getOrDefault("panNumber", "");
                validations.add(new OCRValidation("panNumber", pan.matches("[A-Z]{5}\\d{4}[A-Z]{1}"),
                        pan.isEmpty() ? "PAN not found" : "Valid", "ERROR"));
            }
            case "AADHAAR" -> {
                String uid = (String) data.getOrDefault("aadhaarNumber", "");
                validations.add(new OCRValidation("aadhaarNumber", uid.replaceAll("\\s", "").length() == 12,
                        uid.isEmpty() ? "Aadhaar not found" : "Valid", "ERROR"));
            }
            case "INVOICE", "BILL", "RECEIPT" -> {
                String total = (String) data.getOrDefault("totalAmount", "");
                validations.add(new OCRValidation("totalAmount", !total.isEmpty(),
                        total.isEmpty() ? "Total amount not found" : "Extracted", "WARNING"));
            }
        }
        return validations;
    }

    private InvoiceData convertToInvoiceData(OCRResult result) {
        InvoiceData data = new InvoiceData();
        data.setInvoiceNumber((String) result.getStructuredData().getOrDefault("invoiceNumber", ""));
        data.setInvoiceDate((String) result.getStructuredData().getOrDefault("invoiceDate", ""));
        try { data.setTotalAmount(Double.parseDouble(((String) result.getStructuredData().getOrDefault("totalAmount", "0")).replace(",", ""))); }
        catch (NumberFormatException e) { data.setTotalAmount(0.0); }
        data.setVendorName((String) result.getStructuredData().getOrDefault("vendorName", ""));
        data.setVendorGST((String) result.getStructuredData().getOrDefault("gstNumber", ""));
        return data;
    }
}
