FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /app
COPY . .
RUN ./mvnw -pl config-server -am -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=0 /app/config-server/target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8888/actuator/health || exit 1