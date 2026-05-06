# TradeLens — Deployment Guide

## Steps to deploy on Vercel

### 1. Upload to GitHub
- Go to github.com → New repository → name it `tradelens`
- Upload all these files keeping the same folder structure

### 2. Deploy on Vercel
- Go to vercel.com
- Sign in with GitHub
- Click "Add New Project"
- Select your `tradelens` repo
- Click Deploy ✅

### 3. Install on your phone (PWA)
- Open the Vercel link in Chrome on Android
- Tap the 3 dots (top right)
- "Add to Home Screen"
- Done — works like a real app ✅

## Project structure
```
tradelens/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx
```
