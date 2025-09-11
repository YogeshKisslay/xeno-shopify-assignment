Xeno Shopify Insights Dashboard
This project is a multi-tenant Shopify Data Ingestion & Insights Service, built as the final assignment for the Xeno Forward Deployed Engineer (FDE) Internship application. It simulates how Xeno helps enterprise retailers onboard, integrate, and analyze their customer data in real-time.

Author: Yogesh Kisslay
Submission Date: September 11, 2025

✨ Live Demo
[Link to your deployed Frontend on Vercel]

(Note: The backend is deployed on Render's free tier, which may spin down after a period of inactivity. The first load might be slow as the service restarts.)

✅ Features Implemented
This project covers all required features and several optional ones to demonstrate a robust, real-world architecture.

Secure User Authentication: Full email/password flow with registration, JWT-based login, and email verification using Nodemailer.

Real-time Data Sync: A comprehensive webhook system that listens for Shopify events (Order Creation, Order Cancellation, Order Update/Fulfillment, Customer Creation) and updates the database in real-time.

Scalable Background Processing: Asynchronous job handling using a Redis queue (BullMQ) and a separate Node.js worker process. This ensures the API remains fast and responsive, even under heavy webhook load.

Historical Data Ingestion: Manual API endpoints to pull all historical data (Customers, Products, Orders) from a Shopify store for initial setup.

Interactive Insights Dashboard:

KPIs: Real-time cards for Total Revenue, Total Orders, and Total Customers.

Top Customers: A live-updating list of the top 5 customers by total spend.

Orders Chart: An interactive line chart showing orders over time, complete with a date-range filter.

Multi-Tenant Architecture: The database schema is designed with a storeId on all relevant tables to ensure data is perfectly isolated for each connected store.

Creative & Responsive UI: A modern, fully responsive "glassmorphism" UI built with React and Tailwind CSS, featuring smooth animations powered by Framer Motion.

Professional Tooling: Utilizes Prisma as an ORM, Docker for managing the Redis instance, and a clean, feature-based project structure.

🏗️ Architecture Diagram
The application is designed with a clear separation of concerns, ensuring scalability and maintainability.

graph TD
    subgraph User
        A[React Frontend on Vercel]
    end

    subgraph Shopify
        B[Shopify Store]
    end

    subgraph Backend on Render
        C[Node.js API Server]
        D[Node.js Worker]
        E[Redis Queue]
        F[MySQL Database]
    end

    A -- REST API Calls --> C
    C -- Jobs --> E
    D -- Listens for Jobs --> E
    D -- Reads/Writes --> F
    C -- Reads --> F
    B -- Webhooks --> C
    C -- Manual Ingestion --> B

Flow:

The React Frontend fetches calculated data from the API Server.

Shopify sends real-time event Webhooks to the API Server.

The API Server's only job for webhooks is to quickly add them as jobs to the Redis Queue.

The separate Worker process picks up jobs from the queue and performs the slow database operations on the MySQL Database.

🛠️ Tech Stack
Category

Technology

Frontend

React.js, Vite, Tailwind CSS, Axios

Backend

Node.js, Express.js

Database

MySQL, Prisma (ORM)

Queueing

Redis, BullMQ

DevOps

Docker (for local Redis)

Libraries

Framer Motion, Recharts, Nodemailer, JWT

🚀 Local Setup Instructions
Prerequisites
Node.js (v18 or later)

MySQL Server

Docker Desktop (or a native Redis installation)

A Shopify Development Store with API credentials

1. Clone the Repository
git clone [https://github.com/YogeshKisslay/xeno-shopify-assignment.git](https://github.com/YogeshKisslay/xeno-shopify-assignment.git)
cd xeno-shopify-assignment

2. Backend Setup (/server directory)
Navigate to the server folder: cd server.

Install dependencies: npm install.

Create a .env file and fill in the following variables:

DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
REDIS_URL="redis://localhost:6379"

# Shopify Credentials
SHOPIFY_STORE_URL="your-store-name.myshopify.com"
SHOPIFY_ADMIN_ACCESS_TOKEN="your_shopify_admin_access_token"

# Gmail Credentials for Nodemailer
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"

Apply the database schema: npx prisma migrate dev.

Start the Redis container: docker run -d -p 6379:6379 --name my-redis redis.

3. Frontend Setup (/client directory)
Navigate to the client folder: cd ../client.

Install dependencies: npm install.

The frontend is configured to use a proxy, so no .env file is needed for local development.

4. Running the Application
You need to run three separate processes in three separate terminals.

Terminal 1 (Backend API): cd server -> npm start

Terminal 2 (Worker): cd server -> npm run start:worker

Terminal 3 (Frontend): cd client -> npm run dev

🗄️ Database Schema (Prisma)
// User model for dashboard authentication
model User {
  id                 Int      @id @default(autoincrement())
  email              String   @unique
  name               String?
  password           String
  isVerified         Boolean  @default(false)
  verificationToken  String?  @unique
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

// Represents a single Shopify store (tenant)
model Store {
  id          Int      @id @default(autoincrement())
  shopifyId   String   @unique
  storeUrl    String   @unique
  accessToken String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  customers Customer[]
  products  Product[]
  orders    Order[]
}

// Stores customer data for a specific store
model Customer {
  id          Int      @id @default(autoincrement())
  shopifyId   String   @unique
  email       String?
  firstName   String?
  lastName    String?
  totalSpent  Float    @default(0)
  ordersCount Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  store       Store    @relation(fields: [storeId], references: [id])
  storeId     Int
  orders      Order[]
}

// Stores product data
model Product {
  id        Int      @id @default(autoincrement())
  shopifyId String   @unique
  title     String
  vendor    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  store     Store    @relation(fields: [storeId], references: [id])
  storeId   Int
}

// Stores order data
model Order {
  id               Int      @id @default(autoincrement())
  shopifyId        String   @unique
  totalPrice       Float
  fulfillmentStatus String
  processedAt      DateTime
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  store            Store    @relation(fields: [storeId], references: [id])
  storeId          Int
  customer         Customer @relation(fields: [customerId], references: [id])
  customerId       Int
  @@map("orders")
}

📝 Assumptions & Limitations
Single Tenant Config: While the architecture is multi-tenant by design, the current implementation is configured for a single store via .env variables. A full multi-tenant onboarding flow (like Shopify OAuth) would be the next step.

Webhook Security: The webhook endpoints do not currently verify Shopify's HMAC signature. In a production environment, this is a critical security step.

UI Refresh Mechanism: The dashboard uses polling for simplicity. For a true real-time experience, WebSockets would be a better solution.

Manual Ingestion Errors: The manual ingestion scripts do not currently have robust error handling or retry logic for individual records.

🔮 Next Steps to Productionize
Implement Shopify OAuth: Create a proper onboarding flow where merchants can connect their stores and have their credentials stored securely.

Webhook Signature Verification: Add a middleware to verify the X-Shopify-Hmac-SHA256 header on all incoming webhooks.

Comprehensive Logging & Monitoring: Integrate a logging service and an error monitoring service to track application health.

Switch to WebSockets: Replace frontend polling with a WebSocket connection for instant UI updates.
