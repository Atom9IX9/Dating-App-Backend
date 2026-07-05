## Author

**Yaroslav Vorobjov**  
Group: 24

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

## Project Setup

```bash
npm run setup
npm install
npm run dev:docker
```

Sources will be available at: `http://localhost:5000` by default.

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
```
