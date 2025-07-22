FROM eclipse-temurin:17-jdk as builder

WORKDIR /app

COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:17-jre

WORKDIR /app

# Копируем JAR файл из стадии сборки
COPY --from=builder /app/build/libs/*.jar app.jar

# Копируем директорию keystore
COPY --from=builder /app/src/main/resources/keystore /app/keystore

EXPOSE 9100

# Добавляем проверку наличия переменных окружения и указываем путь к keystore 
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-Dauthorization.security.keystore.path=file:/app/keystore/keystore.jks", "-jar", "app.jar"]