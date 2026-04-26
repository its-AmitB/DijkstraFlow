# DijkstraFlow - Deployment Guide

## 🚨 Fixed Issues

The following issues have been resolved:

1. **Removed duplicate `ajv` dependency** — Was causing module resolution conflicts
2. **Removed circular dependencies** — Fixed references in `dijkstra_algo` file
3. **Cleaned up package.json files** — Removed unnecessary and conflicting dependencies
4. **Added proper deployment configuration** — Created `render.yaml` for easy Render deployment
5. **Fixed build scripts** — Simplified and improved the build process

## 🚀 Deployment to Render

### Option 1: Using `render.yaml` (Recommended)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) and connect your GitHub repository
3. Render will automatically detect the `render.yaml` file
4. It will deploy **two services**:
   - **Frontend** (Static Site)
   - **Backend** (Web Service)

### Option 2: Manual Setup

#### Frontend Deployment (Static Site)
1. Create a new **Static Site** on Render
2. Connect your GitHub repository (`DijkstraFlow`)
3. Set the following:
   - **Build Command**: `npm run install-deps && npm run build`
   - **Publish Directory**: `frontend/build`

#### Backend Deployment (Web Service)
1. Create a new **Web Service** on Render
2. Connect your GitHub repository (`DijkstraFlow`)
3. Set the following:
   - **Build Command**: `cd backend/baceknd && npm install`
   - **Start Command**: `cd backend/baceknd && npm start`

## 🛠️ Local Development

### Quick Setup (Recommended)

```bash
# On Windows
deploy-prep.bat

# On Linux / macOS
chmod +x deploy-prep.sh
./deploy-prep.sh
```

### Manual Setup:
```bash
# Install dependencies
npm run install-deps

# Build frontend
npm run build

# Start backend (in separate terminal)
npm start
```

## 📋 Environment Variables

For production deployment, you may need to set:
- `NODE_ENV=production`
- Any API keys or database URLs your app requires

## 🔧 Troubleshooting

### Common Issues:

1. **Module not found errors**: Run the deployment preparation script to clean and reinstall dependencies
2. **Build failures**: Ensure Node.js version 18+ is being used (check .nvmrc file)
3. **CORS issues**: Update the backend CORS configuration for your production domain

### If you still get ajv errors:
1. Delete all node_modules folders
2. Delete all package-lock.json files
3. Run `npm run install-deps`
4. Run `npm run build`

## 📁 Project Structure

```
Dijkstra-s_visualizer/
├── frontend/          # React frontend
├── backend/baceknd/   # Express backend
├── render.yaml        # Render deployment config
├── deploy-prep.sh     # Deployment preparation script
└── package.json       # Root package.json with build scripts
```
