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
