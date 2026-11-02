# EKOSMART — Multi-Business Billing, Inventory, Warranty & Operations Platform

Comprehensive soft-coded EV Battery Solution, Showroom Barcode Billing, Inventory & Stock Management, GST Reports, Warranty Verification, Customer Rewards Wallet, and Service Complaint Management Platform.

## 🚀 Architecture Overview

This monorepo platform consists of four applications:
- **`backend/`**: Node.js & Express TypeScript REST API (`dist/server.js`) with Phusion Passenger startup wrapper (`app.js`), MongoDB (Atlas or Remote), and cPanel Exim SMTP email service for OTP & GST Tax Invoice soft copies.
- **`frontend/`**: Customer Web Portal (React 19 + Vite + Tailwind CSS v4) — Dynamic CMS landing pages, 20-second login prompt, Email + OTP authentication, Customer Referral & Coin Wallet dashboard, Showroom invoice viewer, Warranty lookup, and Service Complaint registration.
- **`admin-portal/`**: Admin & SuperAdmin Management Portal (`/admin` base path) — Multi-business Dashboard, Barcode POS Billing & Soft-Coded Invoice Designer, Soft-Coded Stock & Inventory Manager, Employee & Payroll/Salary Slip Generator, Customer & Referral Wallet Manager, CMS Builder, and Excel/CSV Reports.
- **`employee-portal/`**: Field Staff, Cashier & Technician Workspace (`/employee` base path) — Showroom Barcode Billing POS, Stock Lookup & Movements, Assigned Complaint Queue, Digital ID Card, Leave Management, and Monthly Salary Slips.

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` templates to `.env` in each workspace as needed:
- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`
- `admin-portal/.env.example` -> `admin-portal/.env`
- `employee-portal/.env.example` -> `employee-portal/.env`

### 3. Start Development Servers
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev --prefix backend

# Terminal 2: Customer Frontend (Port 5003)
npm run dev --prefix frontend

# Terminal 3: Admin Portal (Port 5001)
npm run dev --prefix admin-portal

# Terminal 4: Employee Portal (Port 5002)
npm run dev --prefix employee-portal
```

---

## 📦 Production Build

Build all four workspaces (Backend + Admin Portal + Employee Portal + Customer Frontend) with a single command from the repository root:

```bash
npm run build
```

Individual build commands:
- **Backend**: `npm run build --prefix backend` (outputs to `backend/dist/`)
- **Customer Frontend**: `npm run build --prefix frontend` (outputs to `frontend/dist/` and syncs to root `dist/`)
- **Admin Portal**: `npm run build --prefix admin-portal` (outputs to `admin-portal/dist/`)
- **Employee Portal**: `npm run build --prefix employee-portal` (outputs to `employee-portal/dist/`)

---

## 🚢 cPanel Production Deployment

This repository is pre-configured for **cPanel Git Version Control** (`.cpanel.yml`) and **cPanel Setup Node.js App** (Phusion Passenger):

1. **Public Document Root (`/home/ekosmart/public_html/`)**:
   - Customer Frontend (`frontend/dist/`) deploys to `/home/ekosmart/public_html/`
   - Admin Portal (`admin-portal/dist/`) deploys to `/home/ekosmart/public_html/admin/`
   - Employee Portal (`employee-portal/dist/`) deploys to `/home/ekosmart/public_html/employee/`
   - Passenger API Bridge (`api/.htaccess`) deploys to `/home/ekosmart/public_html/api/.htaccess`
2. **Backend Node.js Application (`/home/ekosmart/ekosmart-api/`)**:
   - Compiled backend (`backend/dist/`), `backend/package.json`, and `backend/app.js` deploy outside `public_html` into `/home/ekosmart/ekosmart-api/`.
   - Passenger automatically restarts when `/home/ekosmart/ekosmart-api/tmp/restart.txt` is touched.

See [CPANEL_DEPLOYMENT_GUIDE.md](./CPANEL_DEPLOYMENT_GUIDE.md) for full step-by-step cPanel setup, SMTP configuration, and database backup/restore instructions.

---

## 🗄️ Database Setup, Configuration & Deployment Guide (cPanel & MongoDB)

> **Architecture Note**: This platform's backend is built on **Node.js + Express + Mongoose (MongoDB)** with 18 document models (`Bill`, `BillTemplate`, `Stock`, `StockConfig`, `StockMovement`, `Complaint`, `ComplaintForm`, `ComplaintType`, `Warranty`, `WarrantyForm`, `Customer`, `Referral`, `ReferralSettings`, `WalletTransaction`, `Employee`, `PayrollRecord`, `LeaveRequest`, `Content`, `Page`, `ThemeConfig`, `MediaAsset`, `User`). Standard cPanel MySQL/MariaDB credentials (`3306`) cannot connect to a Mongoose/MongoDB driver; you must use **MongoDB Atlas** (recommended for shared cPanel hosting) or a **MongoDB server instance** (`27017`).

### 1. How to Create a Database (cPanel / MongoDB Atlas)
- **Option A — MongoDB Atlas Cloud (Recommended for Shared cPanel Hosting)**:
  1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and click **Build a Database** (M0 Free Tier or M2/M10 Dedicated).
  2. Choose a cloud region close to your cPanel server (e.g., `ap-south-1` Mumbai).
  3. Name the cluster (e.g., `EkosmartCluster`) and specify the database name `ekosmart` in the connection URI.
- **Option B — cPanel Dedicated/VPS with MongoDB Plugin**:
  1. If your cPanel/WHM server has MongoDB installed, create database `ekosmart` on port `27017`.

### 2. How to Create a Database User
1. In MongoDB Atlas, navigate to **Security** > **Database Access** > **Add New Database User**.
2. Choose **Password** authentication.
3. Enter a username (e.g., `ekosmart_admin`) and generate a strong alphanumeric password.

### 3. How to Assign Necessary Privileges & Network Access
1. **Least-Privilege Role**: Under **Database User Privileges**, select **Built-in Role** -> **Read and write to any database** (`readWriteAnyDatabase`) or scope `readWrite` strictly to the `ekosmart` database. Do **not** grant `atlasAdmin` or superuser roles to the application user.
2. **IP Access List**: Navigate to **Security** > **Network Access** > **Add IP Address**:
   - Add your cPanel server's outbound public IPv4 address (visible in cPanel's left sidebar under **General Information** > **Shared IP Address**), or allow `0.0.0.0/0` so Phusion Passenger workers can connect reliably.

### 4. Where to Configure Environment Variables
- **In cPanel (Recommended for Permanent Persistence)**:
  1. Open **cPanel** > **Software** > **Setup Node.js App** > Edit `ekosmart-api`.
  2. Add `DATABASE_URL` (or `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`) under **Environment variables** and click **Save** + **Restart**.
- **In Backend `.env` File**:
  Place your variables in `/home/ekosmart/ekosmart-api/.env` (never committed to Git).
- **Inside the Protected Admin Portal (`/admin/settings`)**:
  Log into the Admin Portal (`/admin/login`) -> **Settings** -> **Database Setup & Connection Manager**.

### 5. How to Test the Database Connection
- **From Admin UI**: In **Admin Portal** > **Settings** > **Database Setup & Connection Manager**, enter your host, database name, username, and password, then click **Test Connection**. The backend (`POST /api/v1/database/test`) validates the parameters, blocks SSRF/private network scanning, tests an isolated connection with a 6-second timeout, and reports latency without exposing credentials.
- **Via Health Endpoint**: Visit `https://<your-domain>/api/v1/health` to verify `"database": { "state": "connected", "readyState": 1 }`.

### 6. How to Initialize or Migrate the Schema
- **Automatic Idempotent Initialization**: No manual SQL imports or destructive migrations are needed. When the backend connects to MongoDB (or when you click **Reconnect DB** in `/admin/settings`), `ensureDefaultSeedData()` in `backend/src/utils/autoSeed.ts` automatically creates missing collections, indexes, default SuperAdmin (`Smartdrive5640@gmail.com`), default GST Tax Invoice & Salary Slip templates, Stock configuration, and division form schemas **without ever overwriting or deleting existing production records**.

### 7. How to Troubleshoot Connection Failures
| Symptom / Error | Cause | Resolution |
| :--- | :--- | :--- |
| `Server selection timed out` | cPanel server IP is not whitelisted in MongoDB Atlas | Add your cPanel Shared IP (or `0.0.0.0/0`) in MongoDB Atlas **Network Access**. |
| `Authentication failed` (`bad auth`) | Incorrect `DB_USER` or `DB_PASSWORD`, or unencoded special characters | Use the **Admin Database Setup Form** (which automatically URL-encodes special characters) or URL-encode `@`, `:`, `/` in `DATABASE_URL`. |
| `querySrv ENOTFOUND` | Hostname entered into SRV mode is not an Atlas SRV cluster | Switch Database Type to **MongoDB Standard Host (`mongodb://`)** if connecting to an IP or standard hostname with port `27017`. |
| Port `3306` rejected | Attempting to use cPanel MySQL port with MongoDB driver | Use port `27017` (standard MongoDB) or `mongodb+srv://` (MongoDB Atlas). |

### 8. Deploying Backend and Frontend Separately vs. Integrated cPanel
- **In-App vs. cPanel Boundary**:
  - **Inside the Admin Panel (`/admin/settings`)**: You can test connectivity, update runtime database settings, write to `/home/ekosmart/ekosmart-api/.env` (if writable), and trigger live reconnection + schema seeding.
  - **Requires cPanel Access**: Creating the Node.js application container in **Setup Node.js App**, configuring cPanel-level environment variables, creating email accounts in **cPanel Email Accounts**, and pulling commits in **cPanel Git Version Control**.
- **Separate Deployment Procedure**:
  - **Frontend (`frontend/dist`, `admin-portal/dist`, `employee-portal/dist`)**: Static SPA bundles deployed to `/home/ekosmart/public_html/`, `/home/ekosmart/public_html/admin/`, and `/home/ekosmart/public_html/employee/`.
  - **Backend (`backend/dist`, `backend/package.json`, `backend/app.js`)**: Deployed outside `public_html` into `/home/ekosmart/ekosmart-api/` and bridged via `/home/ekosmart/public_html/api/.htaccess`.

