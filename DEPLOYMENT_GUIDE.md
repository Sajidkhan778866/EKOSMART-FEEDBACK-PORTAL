# 🚀 Ekosmart Platform — Vercel Production Deployment Guide

This guide walks you through deploying the complete **Ekosmart EV Battery Solution & Spare Parts Platform** to **Vercel** with **MongoDB Atlas**.

---

## 🏗️ Architecture Overview

The system consists of 4 main components:
1. **Backend API (`backend/`)**: Express.js REST API with MongoDB Atlas & Vercel Serverless Function support.
2. **Customer Website (`frontend/`)**: React + Vite Customer Portal (Service Complaints, Warranty Tracking & Registration).
3. **Admin Portal (`admin-portal/`)**: React + Vite Admin Dashboard (Staff Management, Content CMS, Dynamic Form Builder, Complaints, Diagnostics).
4. **Employee Portal (`employee-portal/`)**: React + Vite Field Technician Workspace (Task Queue, Soft ID Badges, Diagnostic Reports).

---

## 📋 Pre-Deployment Checklist

### 1. Set Up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free or shared cluster.
2. Under **Database Access**, create a user with read/write privileges (e.g., `ekosmart_admin` with password).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Vercel Serverless Functions can connect without IP restriction errors.
4. Click **Connect** -> **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://ekosmart_admin:<password>@cluster0.abcde.mongodb.net/ekosmart?retryWrites=true&w=majority
   ```

> [!NOTE]
> **Automatic Database Initialization**: You do NOT need to manually run any seed scripts. Upon first connection to your MongoDB Atlas cluster, the backend automatically seeds:
> - SuperAdmin: `admin@ekosmart.com` / `admin123`
> - Demo Employee: `TEST-EMP-001` / `employee123`
> - Demo Staff: `EMP-REN-002` / `employee123`
> - Default Division Complaint & Warranty form schemas and CMS service cards.

---

## 🚢 Recommended Deployment Method: 4 Vercel Projects (Monorepo)

Deploying each folder as a separate Vercel project is the cleanest, most scalable approach with independent URLs.

### 🌐 Project 1: Backend API (`backend/`)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New...** -> **Project**.
2. Select your Git Repository (`EKOSMART-FEEDBACK-PORTAL`).
3. Configure settings:
   - **Project Name**: `ekosmart-backend-api`
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` (Click *Edit* and select `backend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` *(or `MONGODB_URI`)* | `mongodb+srv://<user>:<password>@cluster.mongodb.net/ekosmart?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | `ekosmart_secure_production_jwt_key_2026_ebs_super_secret` | Random secret key for auth tokens |
   | `NODE_ENV` | `production` | Production environment flag |
5. Click **Deploy**. Note down your assigned domain (e.g. `https://ekosmart-backend-api.vercel.app`).
6. **Verify Backend**: Visit `https://ekosmart-backend-api.vercel.app/api/v1/health` to confirm `{"success": true, "database": {"state": "connected"}}`.

---

### 💻 Project 2: Customer Website (`frontend/`)
1. Go to Vercel Dashboard -> **Add New...** -> **Project**.
2. Select the same Git repository.
3. Configure settings:
   - **Project Name**: `ekosmart-customer-portal`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` | Full backend API v1 URL |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` | Backend host domain |
5. Click **Deploy**.

---

### 🛡️ Project 3: Admin Portal (`admin-portal/`)
1. Go to Vercel Dashboard -> **Add New...** -> **Project**.
2. Select the same Git repository.
3. Configure settings:
   - **Project Name**: `ekosmart-admin-portal`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `admin-portal`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` | Full backend API v1 URL |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` | Backend host domain |
   | `VITE_FRONTEND_URL` | `https://ekosmart-customer-portal.vercel.app` | Customer portal URL (for cross-links) |
5. Click **Deploy**.

---

### 🔧 Project 4: Employee & Technician Portal (`employee-portal/`)
1. Go to Vercel Dashboard -> **Add New...** -> **Project**.
2. Select the same Git repository.
3. Configure settings:
   - **Project Name**: `ekosmart-employee-portal`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `employee-portal`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` | Full backend API v1 URL |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` | Backend host domain |
5. Click **Deploy**.

---

## 🧪 Post-Deployment Verification

1. **Backend Health Check**:
   Visit `https://ekosmart-backend-api.vercel.app/api/v1/health`
   Should return:
   ```json
   {
     "success": true,
     "message": "Ekosmart API Server is healthy",
     "database": { "state": "connected", "readyState": 1, "isCloud": true }
   }
   ```
2. **Admin Portal Login**:
   Visit `https://ekosmart-admin-portal.vercel.app` and log in with:
   - **Email**: `admin@ekosmart.com`
   - **Password**: `admin123`
3. **Staff & Employee Portal Login**:
   Visit `https://ekosmart-employee-portal.vercel.app` and log in with:
   - **Employee ID**: `TEST-EMP-001` (or email `rajesh.tech@ekosmart.com`)
   - **Password**: `employee123`
4. **Customer Portal Navigation**:
   Visit `https://ekosmart-customer-portal.vercel.app` and test:
   - `/complaint/register` (Dynamic Division Forms)
   - `/warranty/check` (Battery Warranty Lookup)
   - `/warranty/register` (Authorized Staff Login Gate)
   - `/contact` (CMS Division Helplines)

---

## 🔄 CLI Deployment with Vercel CLI (Alternative)

If you prefer using the terminal with `vercel-cli`:

```bash
# Install Vercel CLI globally
npm install -g vercel

# 1. Deploy Backend
cd backend
vercel --prod

# 2. Deploy Customer Website
cd ../frontend
vercel --prod

# 3. Deploy Admin Portal
cd ../admin-portal
vercel --prod

# 4. Deploy Employee Portal
cd ../employee-portal
vercel --prod
```
