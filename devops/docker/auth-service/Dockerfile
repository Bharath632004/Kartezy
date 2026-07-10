FROM maven:3.9.6-eclipse-temurin-21 as build
RUN apt-get update && apt-get install -y ca-certificates
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /app
COPY . .
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
