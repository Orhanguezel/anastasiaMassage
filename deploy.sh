#!/bin/bash

echo "🔄 Pulling latest changes..."
cd /var/www/anastasiaMassage

# Force pull, .env korunur çünkü git-ignore'da
git reset --hard
git pull origin main

echo "📦 Installing backend dependencies..."
cd backend
npm install
npm run build

# Backend çalışıyor mu kontrol et
pm2 describe anastasia-backend > /dev/null
if [ $? -ne 0 ]; then
  echo "⚠️ anastasia-backend not running, starting..."
  pm2 start dist/server.js --name anastasia-backend
else
  echo "♻️ Restarting anastasia-backend..."
  pm2 restart anastasia-backend
fi

echo "🌐 Updating frontend..."
cd ../frontend
npm install
npm run build

# Frontend çalışıyor mu kontrol et
pm2 describe frontend-anastasia > /dev/null
if [ $? -ne 0 ]; then
  echo "⚠️ frontend-anastasia not running, starting..."
  PORT=3001 pm2 start npm --name frontend-anastasia -- start
else
  echo "♻️ Restarting frontend-anastasia..."
  pm2 restart frontend-anastasia
fi

pm2 save

echo "✅ Deploy completed!"