FROM maven:3.9.6-eclipse-temurin-21 as build
ENV HTTP_PROXY="" HTTPS_PROXY="" http_proxy="" https_proxy=""
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
ENV MAVEN_OPTS="-Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true"
WORKDIR /app
COPY . .
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre
ENV HTTP_PROXY="" HTTPS_PROXY="" http_proxy="" https_proxy=""
RUN apt-get update && apt-get install -y ca-certificates curl
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8761/actuator/health || exit 1

FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y ca-certificates curl
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8761/actuator/health || exit 1

FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y ca-certificates curl
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/app.jar"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8761/actuator/health || exit 1