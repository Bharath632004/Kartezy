# Kartezy Security Module

This module provides a set of reusable security components for building enterprise applications that comply with various security standards and best practices.

## Features

### Encryption
- `AESUtil`: Utility for AES encryption and decryption using GCM mode.

### Secrets Management
- `SecretsManager`: Interface for interacting with secret stores.
- `AWSSecretsManagerImpl`: AWS Secrets Manager implementation of the SecretsManager interface.
- `SecretUtils`: Utility for generating secrets (passwords, API keys, etc.).

### Audit Logging
- `AuditEvent`: JPA entity for storing audit events.
- `AuditLogService`: Interface for logging security audit events.
- `AuditLogServiceImpl`: JPA-based implementation of AuditLogService.
- `AuditEventRepository`: Spring Data JPA repository for AuditEvent.

### Role-Based Access Control (RBAC)
- `RbacUtils`: Utility for checking roles and permissions using Spring Security.

### Multi-Factor Authentication (MFA)
- `TotpUtil`: Utility for generating and validating Time-based One-Time Passwords (TOTP) as per RFC 6238.

### Fraud Detection
- `FraudDetector`: Interface for fraud detection.
- `SimpleFraudDetector`: Rule-based fraud detector implementation.
- `FraudCheckResult`: Result of a fraud check.

### API Security
- `RateLimiter`: Interface for rate limiting.
- `FixedWindowRateLimiter`: In-memory fixed-window rate limiter.
- `ApiSecurityUtils`: Utility for checking input for common attack patterns (SQL injection, XSS) and basic HTML escaping.

### Spring Boot Auto-Configuration
- `SecurityConfiguration`: Auto-configuration class that registers beans for RateLimiter and AuditLogService when conditions are met.

## Usage

### Maven Dependency
Add the following to your module's pom.xml to depend on the security module:

```xml
<dependency>
    <groupId>com.kartezy</groupId>
    <artifactId>shared</artifactId>
    <version>${project.version}</version>
</dependency>
```

### Configuration
The security module provides Spring Boot auto-configuration. To use the auto-configured beans, ensure that the `SecurityConfiguration` class is picked up by component scanning.

### Examples

#### Encryption
```java
String key = AESUtil.generateKey();
String encrypted = AESUtil.encrypt("secret data", key);
String decrypted = AESUtil.decrypt(encrypted, key);
```

#### Secrets Management (AWS)
```java
SecretsManager secretsManager = new AWSSecretsManagerImpl(awsSecretsManagerClient);
String secret = secretsManager.getSecret("my-secret-key");
secretsManager.putSecret("my-secret-key", "my-secret-value");
```

#### Audit Logging
```java
@Autowired
private AuditLogService auditLogService;

// Log a successful login
auditLogService.loginSuccess("user@example.com", "192.168.1.1");
```

#### RBAC
```java
if (RbacUtils.hasRole("ADMIN")) {
    // Allow access to admin functionality
}
```

#### MFA
```java
String secret = TotpUtil.generateSecret();
// Store the secret for the user (e.g., in the database)
// Later, when the user submits a code:
boolean isValid = TotpUtil.validateTotp(storedSecret, codeFromUser, System.currentTimeMillis());
```

#### Fraud Detection
```java
List<String> blockedIps = Arrays.asList("192.168.1.100", "10.0.0.1");
FraudDetector fraudDetector = new SimpleFraudDetector(blockedIps);
Map<String, Object> context = Map.of(
    "amount", 1500.0,
    "ipAddress", "203.0.113.5",
    "billingCountry", "US",
    "shippingCountry", "CA"
);
FraudCheckResult result = fraudDetector.checkFraud(context);
if (result.isFraudulent()) {
    // Block the transaction
}
```

#### API Security
```java
// Rate limiting
RateLimiter rateLimiter = new FixedWindowRateLimiter();
boolean allowed = rateLimiter.isAllowed("192.168.1.1", 10, 1, TimeUnit.MINUTES); // 10 requests per minute

// Input validation
if (ApiSecurityUtils.containsSqlInjectionPattern(userInput)) {
    // Reject input
}
if (ApiSecurityUtils.containsXssPattern(userInput)) {
    // Sanitize or reject input
}
String safeHtml = ApiSecurityUtils.escapeHtml(userInput);
```

## Compliance

The components in this module are designed to help achieve compliance with the following standards:

- **OWASP Top 10**: Input validation, rate limiting, secure authentication, etc.
- **SOC 2**: Audit logging, access control, change management.
- **ISO 27001**: Risk management (fraud detection), asset management (encryption), access control, cryptography.
- **PCI DSS**: Encryption of cardholder data, access control, logging, vulnerability management.
- **GDPR**: Data protection by design (encryption), data subject rights (audit logging), breach detection.
- **DPDP Act (India)**: Similar to GDPR, focusing on personal data protection.

## Notes

- The `FixedWindowRateLimiter` is an in-memory implementation and is not suitable for clustered environments without a shared cache. For production clusters, consider using a Redis-based rate limiter.
- The `AWSSecretsManagerImpl` requires the AWS SDK for Java v2 to be on the classpath.
- The audit logging requires a running database with the `audit_events` table created. The `AuditEvent` entity is provided for JPA/Hibernate.
- Always follow the principle of least privilege and defense in depth when using these components.

## Future Enhancements

- Add Redis-based rate limiter for distributed systems.
- Add support for other secret managers (HashiCorp Vault, Azure Key Vault, etc.).
- Add more sophisticated fraud detection using machine learning models.
- Add integration with popular SAST/DAST tools for automated security testing.
- Provide a security dashboard service for visualizing security events and metrics.

--- 
*This module is part of the Kartezy enterprise platform.*