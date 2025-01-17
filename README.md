# Bookstore API

## 📋 Description
This repository contains the backend API for an online store, developed using NestJS and Prisma. It provides robust and scalable endpoints for managing products, orders, and payments. The API integrates with a payment gateway to ensure secure transaction processing. 

## 🚀 Project Structure

### Backend (NestJS)
```
src/
├── application/    # Application layer - Use cases and application services
├── domain/        # Domain layer - Business logic and entities
├── infrastructure/# Infrastructure layer - Framework and external services
└── shared/        # Shared resources - Utils, constants, and common code
```

## 🛠️ Technologies

### Backend
- NestJS v10
- Prisma
- PostgreSQL

## ▤ Database Structure 
![Front test](https://raw.githubusercontent.com/david-fb/Bookstore-api/refs/heads/main/images/ERD.png)
### Core Entities 🏗️

#### Products
```
- Inventory management (title, price, stock)
- Connected to orders via OrderItems
```

#### Customer
```
- Supports guest checkout
- Optional registration (isRegistered flag)
- Stores contact & delivery info
```

#### Orders
```
Central entity that connects:
- Customer (buyer)
- OrderItems (products purchased)
- Delivery (shipping info)
- Transaction (payment)
```

### Supporting Entities ⚡

#### OrderItems
```
- Links Products to Orders
- Tracks quantity and price
```

#### Delivery
```
- Shipping information
- Tracking details
- Status updates
```

#### Transaction
```
- Payment processing info
- Gateway responses
- Payment status tracking
```

### Key Relationships
```
- Customer → Orders (1:N)
- Order → OrderItems → Products (N:N)
- Order → Delivery (1:1)
- Order → Transaction (1:1)
```

## ⚙️ Prerequisites
- Postgres Database
- Node.js (v18+)
- Docker (Optional)

## 🚀 Installation and Configuration

```bash
# Install dependencies
npm install

# Setting environment variables
cp .env.example .env

# Docker (Optional)
docker compose up -d

# Setting Database
npm run prisma:migrate:dev

# Seeding
npm run prisma:seed

# Start in development mode
npm run start:dev

# Build for production
npm run build
```

## 🔧 Setting up the Environment (.env)
```env
PORT=8000
NODE_ENV=development
POSTGRES_USER_DOCKER=admin
POSTGRES_PASSWORD_DOCKER=admin
POSTGRES_DB_DOCKER=bookstore
DATABASE_URL=postgresql://admin:admin@localhost:5433/bookstore
API_KEY=tu_clave_secreta
WOMPI_API_URL=
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_INTEGRITY_KEY=
WOMPI_EVENTS_KEY=
```

## 🧪 Test
```bash
# Running tests
npx jest
```

![Front test](https://raw.githubusercontent.com/david-fb/Bookstore-api/refs/heads/main/images/back.png)