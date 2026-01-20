PUBLISHED LINK: https://relaxed-mermaid-700c70.netlify.app/

- “Frontend runs in Node.js service”
- “Backend runs in Docker service with Java 21”


 Prerequisites

- Frontend: Node.js (v22.x recommended)
- Backend: Java 21 + Maven Wrapper (included in repo)
- Database: MySQL (local or Railway/Render connection string)



Deployment Architecture (Render)

Frontend (React)
- Service Type: Node.js Web Service
- Root Directory: frontend
- Build Command:
cd frontend
npm install
npm run build
- Start Command:
npm start
- Environment: Node.js 22.x


Backend (Spring Boot)
- Service Type: Docker Web Service
- Root Directory: backend
- Dockerfile:
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .


RUN ./mvnw clean package -DskipTests

RUN cp target/*.jar app.jar


CMD ["java", "-jar", "app.jar"]


- Build Command:
cd backend
./mvnw clean package -DskipTests
- Start Command:
java -jar target/*.jar


- Environment Variables (example):
  
SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/<database>

SPRING_DATASOURCE_USERNAME=root

SPRING_DATASOURCE_PASSWORD=********

SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.MySQL8Dialect

SPRING_JPA_SHOW_SQL=true

PORT=8080

JAVA_VERSION=21



Database (MySQL)
- Hosted externally (Railway).
- Connected via environment variables


JWT Token
*********

Dual Authentication Flow: JWT is set both as a secure cookie (SameSite=None; Secure) and returned in the login response body.

Frontend Handling: Axios uses withCredentials: true for cookie‑based auth, and also stores the token in localStorage to attach as an Authorization: Bearer header.

Backend Handling: JwtAuthFilter checks cookies first, then falls back to the header, ensuring compatibility across dev and prod.

Result: Works seamlessly in localhost dev (cookies with SameSite=Lax) and in production (cross‑site cookies or header fallback).



NOTES
*****
- Frontend and backend run independently — you can start either one alone.
- Environment variables are used in production (Render/Railway), but for local dev hardcoded in application.properties.
- Backend JAR is built via Maven Wrapper, so you don’t need Maven installed globally.
