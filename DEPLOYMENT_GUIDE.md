# 🚀 Deployment Guide for Creator Platform

## Project Structure
- **Frontend**: React app in `creator-platform/` folder
- **Backend**: Node.js Express API in `backend/` folder  
- **Database**: MongoDB Atlas (already configured)

## 📋 Deployment Steps

### 1. Deploy Backend to Railway

#### Option A: Web Dashboard (Recommended)
1. Go to [railway.app](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Mixpad Projects`
5. **Configure the service:**
   - **Service Name**: `creator-platform-backend`
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`

#### Environment Variables (Add in Railway Dashboard)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://prasannavadk_db_user:DcNyfo4h5BlmMkUp@cluster0.ojj7xdb.mongodb.net/creator-platform?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024-secure
PORT=5000
```

#### Option B: CLI (Alternative)
```bash
cd backend
railway link  # Link to existing project: social-platform
railway deploy
```

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Configure:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `creator-platform`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Environment Variables (Add in Vercel)
```bash
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

**Note**: Replace `your-railway-backend-url` with your actual Railway URL after backend deployment.

### 3. Database Setup (Already Done ✅)
- MongoDB Atlas cluster is already configured
- Connection string is already set in environment variables

## 🔧 Configuration Files Created

### Backend Configuration:
- `backend/railway.json` - Railway deployment config
- `railway.toml` - Root Railway config
- `backend/config.production.js` - Production settings

### Frontend Configuration:
- `creator-platform/src/config/api.js` - API configuration
- Updated CORS settings in `backend/server.js`

## 🌐 URLs After Deployment

- **Backend API**: `https://social-platform-production-xxxx.up.railway.app`
- **Frontend**: `https://your-app-name.vercel.app`
- **Database**: MongoDB Atlas (already running)

## 🔍 Testing Deployment

### Backend Health Check:
```
GET https://your-railway-url.railway.app/health
```

### Frontend Test:
1. Visit your Vercel URL
2. Try logging in/signing up
3. Check browser console for any API errors

## 🐛 Troubleshooting

### Common Issues:
1. **CORS errors**: Update `FRONTEND_URL` environment variable in Railway
2. **API not found**: Check `REACT_APP_API_URL` in Vercel environment variables
3. **Database connection**: Verify MongoDB Atlas IP whitelist (set to 0.0.0.0/0)

### Railway CLI Issues:
If CLI commands fail, use the web dashboard instead. The dashboard is more reliable for initial setup.

## 📝 Next Steps After Deployment

1. **Update Frontend Environment Variable**: 
   - Copy your Railway backend URL
   - Update `REACT_APP_API_URL` in Vercel dashboard
   - Redeploy frontend

2. **Custom Domain** (Optional):
   - Add custom domain in Vercel
   - Update CORS settings in Railway with your domain

3. **Monitoring**:
   - Check Railway logs for backend issues
   - Monitor Vercel analytics for frontend performance

## 🎯 Quick Deployment Checklist

- [ ] Backend deployed to Railway with environment variables
- [ ] Frontend deployed to Vercel 
- [ ] Environment variables configured correctly
- [ ] CORS settings updated
- [ ] API health check working
- [ ] Frontend can connect to backend API
- [ ] User authentication working
- [ ] Database operations functioning

## 💡 Alternative Deployment Options

### If Railway doesn't work:
- **Render.com**: Great alternative for backend
- **Netlify**: Alternative for frontend

### If you want everything on one platform:
- **Railway**: Can host both frontend and backend
- **Vercel**: Can host both with serverless functions

## 🚨 Important Security Notes

1. **Change JWT Secret**: Update `JWT_SECRET` in Railway to a secure random string
2. **Environment Variables**: Never commit `.env` files to GitHub
3. **CORS**: Only allow your frontend domain in production
4. **MongoDB**: Use strong passwords and IP restrictions

---

Your project is now ready for deployment! Start with the Railway web dashboard for the backend, then deploy the frontend to Vercel.
