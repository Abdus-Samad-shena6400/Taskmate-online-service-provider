# TaskMate Backend - Render Deployment Guide

## ✅ Pre-Deployment Checklist

Your backend is **already configured** for Render deployment! Here's what's ready:

- ✅ CORS configuration (environment-aware)
- ✅ PORT configuration (uses `process.env.PORT` with fallback)
- ✅ Health check endpoint (`GET /health`)
- ✅ Correct start script (`npm start`)
- ✅ Graceful shutdown handlers
- ✅ Security headers
- ✅ MongoDB Atlas connected
- ✅ Email service configured (Gmail SMTP)

---

## 📋 Environment Variables Required on Render

Copy these from your `.env` file and add them to Render dashboard:

```
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://abdussamad:samadshenakhan640@cluster0.bezjb3z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://taskmate-online-service-provider.vercel.app
JWT_SECRET=huhasdksandksandawoidnksladnawda
JWT_EXPIRE=7d
COOKIE_EXPIRE=3
SMPT_HOST=smtp.gmail.com
SMPT_SERVICE=gmail
SMPT_PORT=465
SMPT_MAIL=abdussamad124556@gmail.com
SMPT_PASSWORD=pjej wnnr ivpt klok
```

---

## 🚀 Step-by-Step Deployment to Render

### Step 1: Prepare Git Repository
```bash
# Ensure all changes are committed
cd c:\Users\obaid jan\OneDrive\Desktop\my-all-project\TaskMate-main
git add .
git commit -m "chore: prepare backend for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to **[render.com](https://render.com)** and sign in
2. Click **"New"** → **"Web Service"**
3. Select your GitHub repository
4. Configure:

   | Field | Value |
   |-------|-------|
   | **Name** | `taskmate-backend` (or your choice) |
   | **Environment** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Root Directory** | `backend` |
   | **Plan** | Free (or Paid if needed) |

### Step 3: Add Environment Variables

In the Render dashboard:
1. Go to your service → **Environment**
2. Click **"Add Environment Variable"**
3. Add each variable from the list above
4. **Important:** Do NOT add `.env` file directly

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Once deployment is complete, you'll get a URL like:
   ```
   https://taskmate-backend.onrender.com
   ```

---

## ✔️ Verification Steps

### Test Backend Health:
```bash
# Exchange your-backend.onrender.com with actual URL
curl https://taskmate-backend.onrender.com/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2026-03-30T12:34:56.789Z",
  "environment": "production"
}
```

### Test HomePage:
```bash
curl https://taskmate-backend.onrender.com/

# Expected: Welcome to Task Mate Backend
```

### Test API Connection (after frontend update):
Frontend's API calls should succeed with CORS headers

---

## 🔄 Frontend Update

After backend is deployed on Render:

1. Go to your **Vercel dashboard** → Frontend project → **Environment Variables**
2. Update or add:
   ```
   VITE_API_URL=https://taskmate-backend.onrender.com
   ```
3. Redeploy frontend (Vercel will auto-redeploy on env var change)

---

## 📝 Backend Code Already Includes:

### Port Configuration (index.js)
```javascript
const PORT = process.env.PORT || 4001;
```
✅ Already configured for Render

### CORS Configuration (index.js)
```javascript
const allowedOrigins = [
  "https://taskmate-online-service-provider.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);
```
✅ Updated with your Vercel frontend URL

### Start Script (package.json)
```json
"start": "node api/index.js"
```
✅ Correct for Render

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails** | Check `root directory` is set to `backend` |
| **CORS errors** | Verify `FRONTEND_URL` matches your Vercel URL exactly |
| **Cannot connect to MongoDB** | Check `MONGO_URI` is correct & IP whitelist includes `0.0.0.0/0` in Atlas |
| **Email not sending** | Verify Gmail app password is correct (not regular password) |
| **API timeout** | Render free tier spins down after 15 min inactivity; upgrade to paid for always-on |
| **Port issues** | Don't set PORT to a specific number; let Render assign it (process.env.PORT) |

---

## 📊 CORS Configuration Details

Your backend now correctly handles:
- ✅ Requests from Vercel frontend
- ✅ Local development (localhost:5173)
- ✅ Mobile apps / Postman (no origin)
- ✅ Credentials (cookies, auth headers)
- ✅ Preflight requests (OPTIONS)

---

## Next Steps

1. ✅ Commit changes: `git push origin main`
2. ✅ Deploy backend to Render (follow Step 2-4 above)
3. ✅ Update frontend's `VITE_API_URL` environment variable
4. ✅ Test the full app flow
5. ✅ Monitor backend with Render's dashboard

Good luck! 🚀
