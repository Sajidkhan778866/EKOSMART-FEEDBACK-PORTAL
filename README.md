# EKOSMART-FEEDBACK-PORTAL

Comprehensive EV Battery Solution, Service Complaint Management & Spare Parts Platform for Ekosmart.

## 🚀 Architecture Overview

This monorepo platform consists of:
- **`backend/`**: Node.js & Express REST API with MongoDB & Serverless Function support for Vercel.
- **`frontend/`**: Customer Portal (Service complaints registration, dynamic divisions, battery warranty lookup & staff registration).
- **`admin-portal/`**: Admin Management Dashboard (Staff records, Soft ID Card generator, complaint dispatch, content management).
- **`employee-portal/`**: Field Staff & Technician Portal (Complaint task handling, soft ID badge display, diagnostic logs).

## 🛠️ Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` in each subfolder:
- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`
- `admin-portal/.env.example` -> `admin-portal/.env`
- `employee-portal/.env.example` -> `employee-portal/.env`

### 3. Run Dev Servers
```bash
npm run dev
```
- Customer Frontend: `http://localhost:5003`
- Admin Portal: `http://localhost:5001`
- Employee Portal: `http://localhost:5002`
- Backend API: `http://localhost:5000`

## 📦 Build
```bash
npm run build
```

## 🚢 Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full Vercel + MongoDB Atlas deployment instructions.
