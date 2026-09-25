# 🚀 Ekosmart Platform — Vercel Deployment Guide

This guide walks you through deploying the complete **Ekosmart EV Battery Solution & Spare Parts Platform** to **Vercel** with **MongoDB Atlas**.

---

## 🏗️ Architecture Overview

The system consists of 4 main components:
1. **Backend API (`backend/`)**: Express.js REST API with MongoDB & Serverless support.
2. **Customer Website (`frontend/`)**: React + Vite Customer Portal (Service Complaints, Warranty Tracking & Registration).
3. **Admin Portal (`admin-portal/`)**: React + Vite Admin Dashboard (Staff, Content CMS, Forms, Complaints, Diagnostics).
4. **Employee Portal (`employee-portal/`)**: React + Vite Field Technician Workspace (Task Queue, Soft ID Badges, Diagnostic Reports).

---

## 📋 Pre-Deployment Checklist

### 1. Set Up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free or shared cluster.
2. Under **Database Access**, create a user with read/write privileges (e.g., `ekosmart_admin`).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Vercel Serverless Functions can connect.
4. Click **Connect** -> **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ekosmart?retryWrites=true&w=majority
   ```

---

## 🚢 Recommended Deployment Method: 4 Vercel Projects (Monorepo)

Deploying each folder as a separate Vercel project is the cleanest, most scalable approach with independent domains.

### 🌐 Project 1: Backend API (`backend/`)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New...** -> **Project**.
2. Select your Git Repository.
3. Configure settings:
   - **Project Name**: `ekosmart-backend-api`
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend` (Click *Edit* and select `backend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   | Variable | Value |
   | :--- | :--- |
   | `DATABASE_URL` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/ekosmart?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `ekosmart_secure_production_jwt_key_2026_ebs_super_secret` |
   | `NODE_ENV` | `production` |
5. Click **Deploy**. Note down your assigned domain (e.g. `https://ekosmart-backend-api.vercel.app`).

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
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` |
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
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` |
   | `VITE_FRONTEND_URL` | `https://ekosmart-customer-portal.vercel.app` |
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
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://ekosmart-backend-api.vercel.app/api/v1` |
   | `VITE_API_HOST` | `https://ekosmart-backend-api.vercel.app` |
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
     "database": { "state": "connected", "readyState": 1 }
   }
   ```
2. **Admin Portal Login**:
   Visit `https://ekosmart-admin-portal.vercel.app` and log in with:
   - **Email**: `admin@ekosmart.com`
   - **Password**: `admin123`
3. **Customer Portal Navigation**:
   Visit `https://ekosmart-customer-portal.vercel.app` and test:
   - `/complaint/register` (Dynamic Division Forms)
   - `/warranty/check` (Battery Warranty Lookup)
   - `/warranty/register` (Authorized Staff Login Gate)
   - `/contact` (CMS Division Helplines)
4. **Employee Portal**:
   Visit `https://ekosmart-employee-portal.vercel.app` and test technician dashboard, assigned tasks, and Soft ID badge generator.

---

## 🔄 CLI Deployment with Vercel CLI (Alternative)

If you prefer using the terminal with `vercel-cli`:

```bash
# Install Vercel CLI globally
npm install -g vercel

# 1. Deploy Backend
cd backend
vercel --prod

# 2. Deploy Frontend
cd ../frontend
vercel --prod

# 3. Deploy Admin Portal
cd ../admin-portal
vercel --prod

# 4. Deploy Employee Portal
cd ../employee-portal
vercel --prod
```
