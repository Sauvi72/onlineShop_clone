# 🚀 Fullstack Deployment Guide

This project is set up to deploy the **Backend on Render** and the **Frontend on Vercel**.

---

## 1. 🌐 Step 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub / GitLab repository.
3. Configure the following settings:
   - **Name**: `fullstack-backend` (or any name you choose)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. *(Optional)* Add Environment Variables under **Advanced**:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Optional)* Your MongoDB Atlas connection string (if using MongoDB instead of in-memory fallback)
   - `ALLOWED_ORIGINS`: *(Optional)* `https://your-frontend.vercel.app`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g., `https://fullstack-backend-xxxx.onrender.com`).

---

## 2. ⚡ Step 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-app.onrender.com` *(Paste the Render backend URL from Step 1 without trailing slash)*
5. Click **Deploy**.

---

## 3. 🛠️ Local Development

### Run Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```
