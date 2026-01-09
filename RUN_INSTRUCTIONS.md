# How to Run the Referral AI Application

This application consists of two parts: a **Backend** server and a **Frontend** React application. You need to run both for the app to work correctly.

## Prerequisites
- Node.js installed on your machine.

## Step 1: Start the Backend Server
The backend runs on port `5000`.

1. Open a terminal.
2. Navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   You should see: `✅ Server running on http://localhost:5000`

## Step 2: Start the Frontend Application
The frontend runs on port `3000`.

1. Open a **new** terminal window or tab.
2. Navigate to the project root folder (where this file is located):
   ```bash
   cd c:\Users\CharishmaReddy\Downloads\referral-ai
   ```
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Start the React app:
   ```bash
   npm start
   ```
   This will automatically open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting
- **Port in Use**: If you see an error that port 3000 or 5000 is in use, verify that you don't have another instance of the app running.
- **Dependencies**: If you see "module not found" errors, make sure to run `npm install` in the respective directory (`root` or `Backend`).
