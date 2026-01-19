# Use official Java 21 image
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy everything from backend folder
COPY . .

# Build the app
RUN ./mvnw clean package -DskipTests
RUN cp target/*.jar app.jar

# Run the app
CMD ["java", "-jar", "app.jar"]
