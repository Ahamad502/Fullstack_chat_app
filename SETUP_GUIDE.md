# 🚀 Complete Local Setup Guide - Chat App with GCP

This guide will walk you through **step-by-step** to run the project locally using **Google Cloud Platform (GCP)** for image storage instead of Cloudinary.

---

## 📋 Prerequisites Checklist

Before you start, ensure you have:

- ✅ **Node.js 16+** - [Download here](https://nodejs.org)
- ✅ **MongoDB** (local or Atlas) - [Setup guide](#-step-2-setup-mongodb)
- ✅ **Google Account** - For GCP
- ✅ **Git** (optional) - For version control
- ✅ **VS Code** or any code editor
- ✅ **Command Line/Terminal** access

---

## 🎯 Setup Process Overview

```
1. Prerequisites Setup
   ├── Install Node.js
   └── Setup MongoDB
   
2. GCP Configuration
   ├── Create GCP Project
   ├── Setup Cloud Storage Bucket
   └── Create Service Account
   
3. Project Setup
   ├── Clone/Download project
   ├── Install dependencies
   └── Configure environment variables
   
4. Start Development
   ├── Run Backend
   ├── Run Frontend
   └── Test application
```

---

# PART 1: PREREQUISITES SETUP

## 📌 Step 1: Install Node.js

### For Windows:

1. Go to [nodejs.org](https://nodejs.org)
2. Download **LTS version** (Long Term Support)
3. Run the installer
4. Follow installation wizard (default settings are fine)
5. Check installation:

```bash
node --version
npm --version
```

Should show version numbers like `v18.x.x` and `9.x.x`

---

## 📌 Step 2: Setup MongoDB

### Option A: Cloud MongoDB (Recommended - Easiest)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign up** (use Google account for quick setup)
3. Create organization and project
4. Click **Create a Cluster**
   - Select **M0 Sandbox** (Free tier)
   - Choose region closest to you
   - Click **Create Cluster** (takes 2-3 minutes)

5. Setup Database Access:
   - Go to **Database Access**
   - Click **Add New Database User**
   - Username: `chatapp`
   - Password: Create a strong password (save it!)
   - Click **Add User**

6. Setup Network Access:
   - Go to **Network Access**
   - Click **Add IP Address**
   - Select **Allow from anywhere** (for development)
   - Click **Confirm**

7. Get Connection String:
   - Go to **Databases** > **Connect**
   - Choose **Drivers** > **Node.js**
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://chatapp:mypassword123@cluster0.mongodb.net/chatdb`

### Option B: Local MongoDB (Advanced)

1. Download [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Install and run MongoDB service
3. Connection string: `mongodb://localhost:27017/chatdb`

---

# PART 2: GCP CONFIGURATION (Image Storage)

## 📌 Step 3: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with Google account
3. Click **Select a Project** dropdown (top-left)
4. Click **NEW PROJECT**
5. Fill details:
   - **Project name**: `chat-app`
   - **Organization**: Select (or skip)
   - Click **CREATE**
6. Wait for project creation (2-3 minutes)
7. Select your new project from dropdown

---

## 📌 Step 4: Enable Cloud Storage API

1. In GCP Console, search for **Cloud Storage API**
2. Click on the result
3. Click **ENABLE** button
4. Wait for confirmation

---

## 📌 Step 5: Create Storage Bucket

1. Go to **Cloud Storage** > **Buckets** (left sidebar)
2. Click **CREATE BUCKET**
3. Fill the form:

| Field | Value |
|-------|-------|
| **Name** | `chatapp-images-123` (must be unique globally) |
| **Location type** | Region |
| **Region** | Choose closest to you |
| **Storage class** | Standard |
| **Access control** | Uniform |
| **Public access** | ✅ Allow public read |
| **Encryption** | Google-managed encryption |

4. Click **CREATE**

---

## 📌 Step 6: Create Service Account

1. Go to **APIs & Services** > **Credentials** (left sidebar)
2. Click **CREATE CREDENTIALS** > **Service Account**
3. Fill details:
   - **Service account name**: `chat-app-service`
   - Click **CREATE AND CONTINUE**
4. Grant permissions:
   - Click dropdown for role
   - Search for **Storage Admin**
   - Select it
   - Click **CONTINUE** > **DONE**

5. Create Key:
   - Find your service account in the list
   - Click the email (service account name)
   - Go to **KEYS** tab
   - Click **ADD KEY** > **Create new key**
   - Choose **JSON**
   - Click **CREATE**
   - A JSON file downloads automatically (save it!)

6. Rename the JSON file to `gcp-key.json` and place in `backend/` folder

---

## 📌 Step 7: Make Bucket Public (Allow Image Access)

1. Go to **Cloud Storage** > **Buckets**
2. Click your bucket name
3. Go to **PERMISSIONS** tab
4. Click **GRANT ACCESS**
5. Add:
   - **New principals**: `allUsers`
   - **Role**: Storage Object Viewer
   - Click **SAVE**

This allows anyone to view (but not modify) images in the bucket.

---

# PART 3: PROJECT SETUP

## 📌 Step 8: Download/Clone Project

Choose one option:

**Option A: Download ZIP**
1. Go to GitHub repository
2. Click **Code** > **Download ZIP**
3. Extract to `C:\Users\YourUsername\Desktop\` or any location

**Option B: Clone (if you have Git)**
```bash
git clone https://github.com/username/fullstack-chat-app.git
cd fullstack-chat-app
```

---

## 📌 Step 9: Install Project Dependencies

Open **Command Prompt** or **PowerShell** and navigate to project:

```bash
# Navigate to project directory
cd fullstack-chat-app

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

This will take 3-5 minutes depending on internet speed.

---

## 📌 Step 10: Create Environment Variables

### Backend Configuration

1. Navigate to `backend` folder
2. Create file named `.env` (note the dot at start)
3. Copy the JSON key file (`gcp-key.json`) to `backend` folder
4. Fill `.env` with:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://chatapp:QI6dqxASTb8hqYq0@cluster0.bc8lvnf.mongodb.net/chatapp?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (create any random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_12345

# GCP Configuration
GCP_PROJECT_ID=your-gcp-project-id
GCP_BUCKET_NAME=chatapp-images-123
GCP_KEY_FILE=./gcp-key.json
```

**Replace:**
- `YOUR_PASSWORD` - Your MongoDB password
- `your-gcp-project-id` - Your GCP project ID (found in GCP Console)
- `chatapp-images-123` - Your GCP bucket name

### Frontend Configuration (Optional)

1. Navigate to `frontend` folder
2. Create file named `.env.local`
3. Add:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📌 Step 11: Update Backend for GCP

The backend code uses Cloudinary by default. You need to update it to use GCP.

### A. Install GCP Dependency

In `backend` folder, run:

```bash
npm install @google-cloud/storage
```

### B. Create GCP Configuration File

1. In `backend/src/lib/` folder
2. Create new file `gcp.js`
3. Add this code:

```javascript
import { Storage } from "@google-cloud/storage";
import { config } from "dotenv";

config();

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

export async function uploadImageGCP(imageBuffer, filename) {
  try {
    const file = bucket.file(filename);
    
    await file.save(imageBuffer, {
      metadata: {
        contentType: "image/jpeg",
      },
    });

    const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${filename}`;
    return publicUrl;
  } catch (error) {
    console.error("GCP Upload Error:", error);
    throw error;
  }
}

export default bucket;
```

### C. Update Auth Controller

1. Open `backend/src/controllers/auth.controller.js`
2. Replace the `updateProfile` function with:

```javascript
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Convert base64 to buffer
    const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    
    // Create unique filename
    const filename = `profile-${userId}-${Date.now()}.jpg`;
    
    // Upload to GCP
    const { uploadImageGCP } = await import("../lib/gcp.js");
    const imageUrl = await uploadImageGCP(imageBuffer, filename);
    
    // Save to database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
```

3. At the top of the file, replace the Cloudinary import:

```javascript
// Remove this line:
// import cloudinary from "../lib/cloudinary.js";

// (No import needed - we use it inline now)
```

---

# PART 4: RUN THE PROJECT

## 📌 Step 12: Start Backend Server

Open **Command Prompt/PowerShell** in `backend` folder:

```bash
npm run dev
```

Expected output:
```
server is running on PORT:5001
```

✅ Backend is running!

---

## 📌 Step 13: Start Frontend Server

Open **new Command Prompt/PowerShell** in `frontend` folder:

```bash
npm run dev
```

Expected output:
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ Frontend is running!

---

## 📌 Step 14: Access the Application

1. Open browser
2. Go to: **http://localhost:5173**
3. You should see the login/signup page

---

# 🧪 TESTING THE PROJECT

## Test 1: User Registration

1. Click **Sign Up**
2. Fill details:
   - Full Name: Your name
   - Email: test@example.com
   - Password: password123
3. Click **Sign Up**
4. You should be logged in

## Test 2: Upload Profile Picture

1. Go to **Profile** page
2. Click on profile picture area
3. Select an image
4. Image should upload to GCP and display

## Test 3: Send Messages

1. You need at least 2 users to test messaging
2. Create another user (different browser or incognito)
3. Find user in sidebar
4. Click and send message
5. Message should appear in real-time

---

# 🐛 TROUBLESHOOTING

## Problem: "Cannot find module @google-cloud/storage"

**Solution:**
```bash
cd backend
npm install @google-cloud/storage
```

---

## Problem: "MONGODB_URI is not defined" or connection error

**Solution:**
1. Check `.env` file exists in `backend` folder
2. Verify MongoDB connection string is correct
3. Check MongoDB credentials (username/password)
4. Ensure your IP is whitelisted in MongoDB Atlas

---

## Problem: GCP image upload fails

**Solution:**
1. Verify `gcp-key.json` is in `backend` folder
2. Check environment variables in `.env`
3. Ensure bucket is public (Step 7)
4. Check GCP Service Account has Storage Admin role

---

## Problem: Frontend not connecting to backend

**Solution:**
1. Check backend is running on port 5001
2. Verify `.env.local` in frontend folder
3. Check CORS settings in `backend/src/index.js`
4. Ensure frontend URL is `http://localhost:5173`

---

## Problem: "Port 5001 already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=5002
```

---

# 📁 Final Project Structure

```
fullstack-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   │   ├── gcp.js           ← NEW FILE
│   │   │   ├── socket.js
│   │   │   └── ...
│   │   ├── routes/
│   │   ├── models/
│   │   └── index.js
│   ├── .env                      ← CREATE THIS
│   ├── gcp-key.json             ← COPY HERE
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.local               ← CREATE THIS
│   └── package.json
└── README.md
```

---

# ✅ Quick Reference Commands

```bash
# Install dependencies
npm install                           # Root
cd backend && npm install            # Backend
cd frontend && npm install           # Frontend

# Run development
npm run dev                           # Backend (from backend folder)
npm run dev                           # Frontend (from frontend folder)

# Build for production
npm run build                         # Frontend

# Lint code
npm run lint                          # Frontend
```

---

# 🎓 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Backend server port | 5001 |
| `MONGODB_URI` | Database connection | mongodb+srv://... |
| `JWT_SECRET` | Token encryption key | any_random_string |
| `GCP_PROJECT_ID` | GCP project identifier | my-chat-app-123 |
| `GCP_BUCKET_NAME` | GCP storage bucket | chatapp-images-123 |
| `GCP_KEY_FILE` | Service account key path | ./gcp-key.json |

---

# 🚀 Next Steps After Setup

1. ✅ Test all features (registration, messaging, image upload)
2. ✅ Customize application (colors, name, theme)
3. ✅ Create more test users
4. ✅ Test real-time messaging between users
5. ✅ Deploy to production (Vercel, Railway, etc.)

---

## 📞 Support Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Socket.io Tutorial](https://socket.io/docs)

---

**You're all set! Happy coding! 🎉**
