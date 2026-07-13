FROM eclipse-temurin:21-jdk-alpine as build
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY . .
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8888/actuator/health || exit 1