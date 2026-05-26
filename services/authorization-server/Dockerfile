# --- СТАДИЯ СБОРКИ ---
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Копируем только то, что нужно для разрешения зависимостей
COPY build.gradle settings.gradle ./
COPY gradlew ./gradlew
COPY gradle ./gradle

# Скачиваем зависимости ОТДЕЛЬНЫМ слоем, чтобы кэшировать их
RUN ./gradlew dependencies

# Копируем исходный код
COPY src ./src

# Собираем приложение
RUN ./gradlew bootJar

# --- СТАДИЯ ЗАПУСКА ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# Копируем ТОЛЬКО JAR и keystore из стадии сборки
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 9100

# Добавляем проверку наличия переменных окружения и указываем путь к keystore 
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dauthorization.security.keystore.path=${KEYSTORE_PATH}", "-jar", "app.jar"]