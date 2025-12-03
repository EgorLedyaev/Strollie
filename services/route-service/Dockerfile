# ЭТАП 1: Сборка
FROM gradle:8-jdk17-alpine AS build

WORKDIR /app

# Копируем конфиги Gradle для кеширования зависимостей
COPY build.gradle settings.gradle ./
RUN gradle clean build --no-daemon > /dev/null 2>&1 || true

# Копируем исходники
COPY src ./src

# Собираем bootJar
RUN gradle bootJar --no-daemon

# ЭТАП 2: Запуск
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]