# Dating App — Backend

Backend part of a web application for dating and social interaction between users.

## Tech Stack
- **TypeScript** — type-safe backend development  
- **NestJS** — progressive Node.js framework for scalable server-side applications  
- **PostgreSQL** — relational database  
- **ORM** — Sequelize (depending on configuration)  
- **JWT** — authentication and authorization  
- **WebSockets** — real-time communication (chat, notifications)  
- **Swagger (OpenAPI)** — API documentation  
- **Docker & Docker Compose** — containerization and consistent environments  

## Project Goal
Provide a secure, scalable, and high-performance backend for a dating platform, responsible for business logic, data persistence, authentication, and real-time interactions.

## Features
- user registration and authentication (JWT, refresh tokens);
- role-based access control;
- profile creation and editing;
- searching and filtering users;
- real-time messaging (WebSocket gateways);
- public and private meetings management;
- geolocation support for meetings and activities;
- notifications system;
- REST API for frontend integration.

The backend is designed with future scalability and feature expansion in mind.

## Architecture
The project follows a **modular architecture**.

## State & Data Management
- database access via ORM (Sequelize);
- DTOs for request/response validation;

## Security
- JWT access & refresh tokens;
- password hashing (bcrypt);
- environment variable protection.

## API Documentation (Swagger)
- Swagger UI is enabled by default;
- Available at: **http://localhost:5000/api/docs**
- Automatically generated from controllers and DTOs;
- Allows testing endpoints directly from the browser.

## Useful commands
### development
```bash
npm run start:dev
```

### production build
```bash
npm run build
npm run start:prod
```

### linting
```bash
npm run lint
```

### tests
```bash
npm run test
```

### or with Docker (starts all project in one command - recommended)
```bash
docker compose up
```

## Enviroment variables
```env
PORT=5000

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=root
POSTGRES_PASSWORD=your_password
POSTGRES_DB=dating_app_db

JWT_SECRET=your_secret_key
JWT_EXPIRE=36000
JWT_REMEMBER_ME_EXPIRE=2829300
```

### Prerequisites
- **Node.js** v18.x or higher  
- **Docker**  
- **Docker Compose**

### Docker Installation
Install Docker and Docker Compose from the official website:

https://www.docker.com/products/docker-desktop/

Verify installation:
```bash
docker -v
docker compose version
