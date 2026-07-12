package com.kartezy.ocrservice.service;

import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service for OCR (Optical Character Recognition) operations.
 * <p>
 * This service provides methods to extract text from various types of documents and images.
 * The methods are currently placeholders and will throw {@link UnsupportedOperationException} until
 * the actual OCR models (e.g., Tesseract, Google Vision AI, AWS Textract) are integrated.
 * </p>
 */
@Service
public class OcrService {

    /**
     * Performs OCR on an invoice image to extract structured data (e.g., vendor, date, line items, total).
     * @param image the invoice image as a byte array
     * @return a map containing the extracted fields from the invoice
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> extractInvoiceData(byte[] image) {
        throw new UnsupportedOperationException("Invoice OCR is not implemented yet.");
    }

    /**
     * Performs OCR on a bill image to extract structured data (e.g., biller, amount, due date).
     * @param image the bill image as a byte array
     * @return a map containing the extracted fields from the bill
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> extractBillData(byte[] image) {
        throw new UnsupportedOperationException("Bill OCR is not implemented yet.");
    }

    /**
     * Performs OCR on a product label or barcode image to extract product information (e.g., product code, brand, description).
     * @param image the product image as a byte array
     * @return a map containing the extracted product information
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> extractProductInfo(byte[] image) {
        throw new UnsupportedOperationException("Product OCR is not implemented yet.");
    }

    /**
     * Performs OCR on a document image to extract plain text.
     * @param image the document image as a byte array
     * @return the extracted text as a string
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public String extractText(byte[] image) {
        throw new UnsupportedOperationException("Document OCR is not implemented yet.");
    }

    /**
     * Performs OCR on an ID card (e.g., passport, driver's license) for KYC purposes.
     * @param image the ID card image as a byte array
     * @return a map containing the extracted fields (e.g., name, ID number, date of birth, expiry date)
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> extractKycData(byte[] image) {
        throw new UnsupportedOperationException("KYC OCR is not implemented yet.");
    }

    /**
     * Performs OCR on a receipt image to extract expense-related data (e.g., merchant, date, total, tax).
     * @param image the receipt image as a byte array
     * @return a map containing the extracted fields from the receipt
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> extractReceiptData(byte[] image) {
        throw new UnsupportedOperationException("Receipt OCR is not implemented yet.");
    }
}