# Multi-stage Docker build for Banking Transaction Management System

# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies for caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root group and user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Copy built JAR artifact from build stage
COPY --from=build /app/target/banking-transaction-management-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Environment variables defaults
ENV DB_HOST=postgres \
    DB_PORT=5432 \
    DB_NAME=banking_db \
    DB_USERNAME=postgres \
    DB_PASSWORD=postgres \
    JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

ENTRYPOINT ["java", "-jar", "app.jar"]
