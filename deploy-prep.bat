@echo off
echo 🚀 Preparing Dijkstra Visualizer for deployment...

REM Clean up any existing node_modules and lock files
echo 🧹 Cleaning up existing dependencies...
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist frontend\package-lock.json del frontend\package-lock.json
if exist backend\baceknd\node_modules rmdir /s /q backend\baceknd\node_modules
if exist backend\baceknd\package-lock.json del backend\baceknd\package-lock.json

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend\baceknd
call npm install
cd ..\..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Build the frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

echo ✅ Deployment preparation complete!
echo 📁 Frontend build is ready in: frontend\build
echo 🖥️  Backend is ready to start with: cd backend\baceknd && npm start
