# Xeno Shopify Insights Dashboard

This project is a multi-tenant Shopify Data Ingestion & Insights Service, built as the final assignment for the Xeno Forward Deployed Engineer (FDE) Internship application. It simulates how Xeno helps enterprise retailers onboard, integrate, and analyze their customer data in real-time.

Author: Yogesh Kisslay

Submission Date: September 11, 2025 

---
### ✨ Live Demo
Frontend (Vercel): https://xeno-shopify-assignment.vercel.app

Backend API (Railway): https://xeno-shopify-assignment-production.up.railway.app


---
### ✅ Features Implemented
 1. This project covers all required features and several optional ones to demonstrate a robust, real-world architecture.

2. Secure User Authentication:Full email/password registration flow with JWT-based login. The system uses an instant verification model for deployment stability.
3. Automatic Onboarding: For new users, the application automatically triggers a one-time historical data ingestion process on their first login, creating a seamless onboarding experience.

4. Real-time Data Sync: A comprehensive webhook system listens for Shopify events (`Order Creation`, `Order Cancellation`, `Order Update/Fulfillment`, `Customer Creation`) and updates the database in real-time.
5. Scalable Background Processing: Asynchronous job handling using a **Redis** queue (BullMQ) and a separate Node.js worker process. This ensures the API remains fast and responsive, even under heavy webhook load.
6. Interactive Insights Dashboard:
   
   1. KPIs: Real-time cards for Total Revenue, Total Orders, and Total Customers.
   
   2. Top Customers: A live-updating list of the top 5 customers by total spend.
   
   3. Orders Chart: An interactive line chart showing orders over time, complete with a date-range filter.
7. Multi-Tenant Architecture: The database schema is designed with a `storeId` on all relevant tables to ensure data is perfectly isolated for each connected store.
8. Creative & Responsive UI: A modern, fully responsive "glassmorphism" UI built with React and Tailwind CSS, featuring smooth animations powered by Framer Motion.
9. Professional Deployment: The entire stack is deployed to modern cloud platforms (Vercel & Railway), using a CI/CD workflow from GitHub.

---
### 🏗️ Architecture Diagram
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

  1.The React Frontend fetches calculated data from the API Server.
    
  2.Shopify sends real-time event Webhooks to the API Server.
    
  3.The API Server's only job for webhooks is to quickly add them as jobs to the Redis Queue.

  4.The separate Worker process picks up jobs from the queue and performs the slow database operations on the MySQL Database.

---
### 🛠️ Tech Stack
#### Category Technology

    Frontend :React.js, Vite, Tailwind CSS, Axios
    Backend :Node.js, Express.js
    Database :MySQL, Prisma (ORM)
    Queueing :Redis, BullMQ
    Deployment :Vercel (Frontend), Railway (Backend)
    Libraries :Framer Motion, Recharts, JWT

---
### 🚀 Local Setup Instructions
#### Prerequisites
   1. Node.js (v18 or later)
    
  2.  MySQL Server
    
3. Docker Desktop (or a native Redis installation)
    
  4. A Shopify Development Store with API credentials

#### 1. Clone the Repository
    git clone https://github.com/YogeshKisslay/xeno-shopify-assignment.git
    cd xeno-shopify-assignment

#### 2. Backend Setup (/server directory)
  1. Navigate to the `server` folder: `cd server`.

  2. Install dependencies: `npm install`.

  3. Create a `.env` file and fill in the following variables:

            DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
            JWT_SECRET="YOUR_SUPER_SECRET_KEY"
            REDIS_URL="redis://localhost:6379"
            
            ##### Shopify Credentials
            SHOPIFY_STORE_URL="your-store-name.myshopify.com"
            SHOPIFY_ADMIN_ACCESS_TOKEN="your_shopify_admin_access_token"
            
            # Frontend URL (for local testing)
            FRONTEND_URL="http://localhost:5173"

  4. Apply the database schema: `npx prisma migrate dev`.

  5. Start the Redis container: `docker run -d -p 6379:6379 --name my-redis redis`.

#### 3. Frontend Setup (/client directory)
  1. Navigate to the client folder:`cd ../client`.

  2. Install dependencies: `npm install`.

  3. The frontend is configured to use a proxy, so no `.env` file is needed for local development.
 
#### 4. Webhook Setup (Using ngrok)
To test the real-time data sync locally, Shopify's servers need a way to send messages to your backend server running on `localhost`. We use `ngrok` to create a secure public URL for this.

1.  In a **fourth terminal**, navigate to the `server` folder.
2.  Install ngrok if you haven't already: `npm install ngrok`.
3.  Run ngrok to expose your backend's port (5001):
    ```bash
    ./node_modules/.bin/ngrok http 5001
    ```
4.  `ngrok` will give you a public "Forwarding" URL that looks like `https://random-string.ngrok-free.app`. **Copy this HTTPS URL.**
5.  In your Shopify Admin, go to **Settings -> Notifications -> Webhooks**. Create webhooks for the following events, using your ngrok URL for each:
    - **Order creation:** `[your-ngrok-url]/api/webhooks/order-created`
    - **Order cancellation:** `[your-ngrok-url]/api/webhooks/order-cancelled`
    - **Order update:** `[your-ngrok-url]/api/webhooks/order-updated`
    - **Customer creation:** `[your-ngrok-url]/api/webhooks/customer-created`

**Important:** The `ngrok` terminal must remain running to keep the webhook connection live.

#### 6. Running the Application
To run the full application with real-time webhooks, you need to run **four separate processes** in four separate terminals.

**Important Note on Scripts:** The main branch of this repository contains start:prod and start:worker scripts in server/package.json that include a sleep 15 command. This is a workaround for deployment stability on Railway and will cause errors if run locally. For local development, please ensure your scripts do not include the sleep or npx prisma migrate deploy commands
##### The correct local scripts should be:
     "scripts": {
       "start": "nodemon -r dotenv/config server.js",
       "start:prod": "node server.js",
       "start:worker": "node src/worker.js",
       "test": "echo \"Error no test specified\" && exit 1"
     },

- **Terminal 1 (Backend API):** `cd server` -> `npm start`
- **Terminal 2 (Worker):** `cd server` -> `npm run start:worker`
- **Terminal 3 (Frontend):** `cd client` -> `npm run dev`
- **Terminal 4 (Ngrok Tunnel):** `cd server` -> `./node_modules/.bin/ngrok http 5001`

---
### 🗄️ Database Schema (Prisma)
    // User model for dashboard authentication
    model User {
      id        Int      @id @default(autoincrement())
      email     String   @unique
      name      String?
      password  String
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    
    // Represents a single Shopify store (tenant)
    model Store {
      id                       Int      @id @default(autoincrement())
      shopifyId                String   @unique
      storeUrl                 String   @unique
      accessToken              String
      hasIngestedInitialData   Boolean  @default(false)
      createdAt                DateTime @default(now())
      updatedAt                DateTime @updatedAt
      customers                Customer[]
      products                 Product[]
      orders                   Order[]
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


---
### 📝 Assumptions & Limitations
  1. Single Tenant Config: While the architecture is multi-tenant by design, the current implementation is configured for a single store via `.env` variables. A full multi-tenant onboarding flow (like Shopify OAuth) would be the next step.

  2. Webhook Security: The webhook endpoints do not currently verify Shopify's HMAC signature. In a production environment, this is a critical security step.

  3. UI Refresh Mechanism: The dashboard uses polling for simplicity. For a true real-time experience, WebSockets would be a better solution.

---
### 🔮 Next Steps to Productionize
  1. Implement Shopify OAuth: Create a proper onboarding flow where merchants can connect their stores.

  2. Webhook Signature Verification: Add a middleware to verify the X-Shopify-Hmac-SHA256 header on all incoming webhooks.
    
  3. Comprehensive Logging & Monitoring: Integrate a logging service (like Winston) and an error monitoring service (like Sentry).

  4. Switch to WebSockets: Replace frontend polling with a WebSocket connection for instant UI updates.
