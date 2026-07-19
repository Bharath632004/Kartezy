package com.kartezy.shared.ai;

import java.util.*;

public class OCRSchemas {

    public static class OCRRequest {
        private String documentType;
        private byte[] documentContent;
        private String fileName;
        private Map<String, Object> options;

        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public byte[] getDocumentContent() { return documentContent; }
        public void setDocumentContent(byte[] documentContent) { this.documentContent = documentContent; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public Map<String, Object> getOptions() { return options; }
        public void setOptions(Map<String, Object> options) { this.options = options; }
    }

    public static class OCRResult {
        private String documentId;
        private String documentType;
        private String rawText;
        private double confidence;
        private Map<String, Object> structuredData;
        private List<OCRField> fields;
        private List<OCRValidation> validations;
        private long processingTimeMs;

        public OCRResult(String documentId, String documentType) {
            this.documentId = documentId;
            this.documentType = documentType;
            this.fields = new ArrayList<>();
            this.validations = new ArrayList<>();
            this.structuredData = new HashMap<>();
        }

        public String getDocumentId() { return documentId; }
        public String getDocumentType() { return documentType; }
        public String getRawText() { return rawText; }
        public void setRawText(String rawText) { this.rawText = rawText; }
        public double getConfidence() { return confidence; }
        public void setConfidence(double confidence) { this.confidence = confidence; }
        public Map<String, Object> getStructuredData() { return structuredData; }
        public void addStructuredData(String key, Object value) { this.structuredData.put(key, value); }
        public List<OCRField> getFields() { return fields; }
        public List<OCRValidation> getValidations() { return validations; }
        public long getProcessingTimeMs() { return processingTimeMs; }
        public void setProcessingTimeMs(long processingTimeMs) { this.processingTimeMs = processingTimeMs; }
    }

    public static class OCRField {
        private String name;
        private String value;
        private double confidence;
        private String type;
        private String normalizedValue;

        public OCRField(String name, String value, double confidence) {
            this.name = name;
            this.value = value;
            this.confidence = confidence;
        }

        public String getName() { return name; }
        public String getValue() { return value; }
        public double getConfidence() { return confidence; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getNormalizedValue() { return normalizedValue; }
        public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }
    }

    public static class OCRValidation {
        private String field;
        private boolean valid;
        private String message;
        private String severity;

        public OCRValidation(String field, boolean valid, String message, String severity) {
            this.field = field;
            this.valid = valid;
            this.message = message;
            this.severity = severity;
        }

        public String getField() { return field; }
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public String getSeverity() { return severity; }
    }

    public static class InvoiceData {
        private String invoiceNumber;
        private String vendorName;
        private String vendorGST;
        private String buyerName;
        private String buyerGST;
        private String invoiceDate;
        private double subtotal;
        private double taxAmount;
        private double totalAmount;
        private List<InvoiceLineItem> lineItems;
        private String currency;
        private Map<String, Object> additionalFields;

        public InvoiceData() {
            this.lineItems = new ArrayList<>();
            this.additionalFields = new HashMap<>();
        }

        public String getInvoiceNumber() { return invoiceNumber; }
        public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
        public String getVendorName() { return vendorName; }
        public void setVendorName(String vendorName) { this.vendorName = vendorName; }
        public String getVendorGST() { return vendorGST; }
        public void setVendorGST(String vendorGST) { this.vendorGST = vendorGST; }
        public String getBuyerName() { return buyerName; }
        public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
        public String getBuyerGST() { return buyerGST; }
        public void setBuyerGST(String buyerGST) { this.buyerGST = buyerGST; }
        public String getInvoiceDate() { return invoiceDate; }
        public void setInvoiceDate(String invoiceDate) { this.invoiceDate = invoiceDate; }
        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
        public double getTaxAmount() { return taxAmount; }
        public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }
        public double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
        public List<InvoiceLineItem> getLineItems() { return lineItems; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public Map<String, Object> getAdditionalFields() { return additionalFields; }
    }

    public static class InvoiceLineItem {
        private String itemName;
        private String hsnCode;
        private int quantity;
        private double unitPrice;
        private double gstRate;
        private double amount;

        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public String getHsnCode() { return hsnCode; }
        public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
        public double getGstRate() { return gstRate; }
        public void setGstRate(double gstRate) { this.gstRate = gstRate; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }

    public static class IDDocumentData {
        private String documentType;
        private String idNumber;
        private String name;
        private String dateOfBirth;
        private String gender;
        private String address;
        private String fatherName;
        private String expiryDate;
        private Map<String, Object> additionalFields;

        public IDDocumentData(String documentType) {
            this.documentType = documentType;
            this.additionalFields = new HashMap<>();
        }

        public String getDocumentType() { return documentType; }
        public String getIdNumber() { return idNumber; }
        public void setIdNumber(String idNumber) { this.idNumber = idNumber; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getFatherName() { return fatherName; }
        public void setFatherName(String fatherName) { this.fatherName = fatherName; }
        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
        public Map<String, Object> getAdditionalFields() { return additionalFields; }
    }

    public static class GSTDocumentData {
        private String gstNumber;
        private String legalName;
        private String tradeName;
        private String address;
        private String state;
        private String pincode;
        private String status;
        private String registrationDate;
        private String constitution;
        private String taxablePersonType;
        private Map<String, Object> additionalFields;

        public GSTDocumentData() {
            this.additionalFields = new HashMap<>();
        }

        public String getGstNumber() { return gstNumber; }
        public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }
        public String getLegalName() { return legalName; }
        public void setLegalName(String legalName) { this.legalName = legalName; }
        public String getTradeName() { return tradeName; }
        public void setTradeName(String tradeName) { this.tradeName = tradeName; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRegistrationDate() { return registrationDate; }
        public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }
        public String getConstitution() { return constitution; }
        public void setConstitution(String constitution) { this.constitution = constitution; }
        public String getTaxablePersonType() { return taxablePersonType; }
        public void setTaxablePersonType(String taxablePersonType) { this.taxablePersonType = taxablePersonType; }
        public Map<String, Object> getAdditionalFields() { return additionalFields; }
    }
}
