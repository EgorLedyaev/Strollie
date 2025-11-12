# ===== Build stage =====
FROM gradle:8.7-jdk17 AS builder
WORKDIR /app
COPY build.gradle ./
COPY src ./src
RUN gradle clean bootJar --no-daemon

# ===== Runtime stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]