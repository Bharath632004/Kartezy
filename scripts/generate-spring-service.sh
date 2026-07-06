#!/bin/bash

# Script to generate a Spring Boot service skeleton

SERVICE_NAME=$1
SERVICE_PATH="backend/$SERVICE_NAME"

if [ -z "$SERVICE_NAME" ]; then
    echo "Usage: $0 <service-name>"
    exit 1
fi

# Create directory structure
mkdir -p "$SERVICE_PATH/src/main/java/com/kartezy/${SERVICE_NAME//-}"
mkdir -p "$SERVICE_PATH/src/main/resources"

# Convert service name to package name (replace hyphens with underscores)
PACKAGE_NAME="com.kartezy.$(echo "$SERVICE_NAME" | tr '-' '_')"

# Create the main application class
cat > "$SERVICE_PATH/src/main/java/com/kartezy/${SERVICE_NAME//-}/${SERVICE_NAME^}Application.java" <<EOF
package $PACKAGE_NAME;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${SERVICE_NAME^}Application {
    public static void main(String[] args) {
        SpringApplication.run(${SERVICE_NAME^}Application.class, args);
    }
}
EOF

# Create a simple controller in the same package
cat > "$SERVICE_PATH/src/main/java/com/kartezy/${SERVICE_NAME//-}/${SERVICE_NAME^}Controller.java" <<EOF
package $PACKAGE_NAME;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ${SERVICE_NAME^}Controller {

    @GetMapping("/")
    public String home() {
        return "Welcome to $SERVICE_NAME service";
    }

    @GetMapping("/health")
    public String health() {
        return "$SERVICE_NAME is healthy";
    }
}
EOF

# Create application.yml
cat > "$SERVICE_PATH/src/main/resources/application.yml" <<EOF
server:
  port: 8080

spring:
  application:
    name: $SERVICE_NAME
EOF

# Create pom.xml
cat > "$SERVICE_PATH/pom.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.kartezy</groupId>
    <artifactId>$SERVICE_NAME</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>$SERVICE_NAME</name>
    <description>$SERVICE_NAME service for Kartezy</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.kartezy</groupId>
            <artifactId>shared</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
EOF

echo "Generated service: $SERVICE_NAME"