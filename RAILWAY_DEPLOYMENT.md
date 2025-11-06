# Railway Deployment Guide

## 🚂 Deploy Server to Railway

### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository connected

### Environment Variables

Add these environment variables in Railway dashboard:

```env
PORT=8000
NODE_ENV=production
MONGO_URL=mongodb+srv://toantra349:toantoan123@ktpm.dwb8wtz.mongodb.net/mydb?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
```

### Health Check

The server includes a health check endpoint at `/health` that Railway uses to verify the app is running:

```bash
curl https://your-app.railway.app/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-06T15:00:00.000Z",
  "uptime": 123.45,
  "mongodb": "connected"
}
```

### Deployment Steps

1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `sgu25_doan_ktpm` repository

2. **Configure Service**
   - Root Directory: `server_app`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all required variables listed above

4. **Deploy**
   - Railway will automatically deploy on push to `main` branch
   - Monitor logs in Railway dashboard

### Troubleshooting

#### Container keeps restarting (SIGTERM)
✅ **Fixed**: Added health check endpoint and graceful shutdown handlers

#### MongoDB Connection Issues
- Verify `MONGO_URL` environment variable is correct
- Check MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Ensure database user has correct permissions

#### Port Binding Issues  
✅ **Fixed**: Server uses `process.env.PORT` and binds to `0.0.0.0`

### Monitoring

Check application health:
```bash
# Health check
curl https://your-app.railway.app/health

# Root endpoint
curl https://your-app.railway.app/

# API test
curl https://your-app.railway.app/api/Product
```

### Graceful Shutdown

The server handles `SIGTERM` and `SIGINT` signals gracefully:
- Closes HTTP server
- Closes MongoDB connection
- Exits cleanly

This prevents Railway from killing the process abruptly.

### Configuration File

`railway.toml` is included with optimal settings:
- Health check path: `/health`
- Health check timeout: 300 seconds
- Restart policy: on failure only
- Max retries: 3

### Support

If issues persist:
1. Check Railway logs
2. Verify all environment variables
3. Test health endpoint
4. Check MongoDB Atlas connection
