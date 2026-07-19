FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

COPY pom.xml .
COPY shared/pom.xml shared/
COPY shared/src shared/src/
COPY finance-service/pom.xml finance-service/
COPY finance-service/src finance-service/src/

# Build shared module first
RUN mvn -f shared/pom.xml clean install -DskipTests -q

# Build finance service
RUN mvn -f finance-service/pom.xml clean package -DskipTests -q

FROM eclipse-temurin:21-jre-jammy AS runtime

RUN groupadd -r kartezy && useradd -r -g kartezy kartezy

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/finance-service/target/finance-service-*.jar app.jar

RUN mkdir -p /app/logs && chown -R kartezy:kartezy /app

USER kartezy

EXPOSE 8096

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl --fail http://localhost:8096/api/finance/actuator/health || exit 1

ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseZGC -XX:ZCollectionInterval=30 -XX:ZFragmentationLimit=10"
ENV SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-prod}

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
