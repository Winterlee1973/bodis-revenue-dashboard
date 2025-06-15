# Netlify Deployment Guide

## Quick Deploy to Netlify

### Option 1: Drag & Drop (Easiest)
1. **Zip the project files**:
   ```bash
   zip -r bodis-dashboard.zip . -x "node_modules/*" "*.git*" "test-*.js" "api-server.js" "server.js"
   ```

2. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag the zip file to deploy

3. **Done!** Your dashboard will be live at `https://your-site-name.netlify.app`

### Option 2: Git Deploy (Recommended)
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Files Structure for Netlify

### Required Files:
- ✅ `index.html` - Main dashboard
- ✅ `script.js` - Dashboard logic  
- ✅ `netlify.toml` - Netlify configuration
- ✅ `netlify/functions/bodis-api.js` - Serverless API function
- ✅ `package.json` - Project configuration

### Files to Exclude:
- ❌ `server.js` - Not needed for Netlify
- ❌ `api-server.js` - Not needed for Netlify  
- ❌ `test-*.js` - Development files
- ❌ `node_modules/` - Auto-installed by Netlify

## How It Works on Netlify

1. **Static Files**: `index.html` and `script.js` are served directly
2. **API Calls**: Routed to `/.netlify/functions/bodis-api`
3. **Serverless Function**: Handles Bodis API requests (avoids CORS)
4. **Environment**: Your API key is embedded in the function

## Benefits of Netlify Deployment

- ✅ **Free hosting** with custom domain
- ✅ **HTTPS by default**
- ✅ **Global CDN** for fast loading
- ✅ **Serverless functions** for API calls
- ✅ **No server maintenance** required
- ✅ **Auto-deploy** from Git (optional)

## Live Dashboard Features

Once deployed, your dashboard will have:
- 📊 Real-time Bodis revenue data
- 📱 Mobile-responsive design
- 🔄 Manual refresh functionality  
- 💰 7-day revenue breakdown
- 📈 Daily averages and totals

## Troubleshooting

### If the dashboard shows "Loading..." forever:
1. Check browser console for errors
2. Verify the Netlify function is deployed
3. Test the API endpoint directly: `https://your-site.netlify.app/.netlify/functions/bodis-api`

### If API calls fail:
1. Check that `netlify/functions/bodis-api.js` contains your correct API key
2. Verify Netlify build logs for function deployment errors
3. Test locally first with `netlify dev`