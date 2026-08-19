# ✨ Full Stack Realtime Chat App ✨

![Demo App](/frontend/public/screenshot-for-readme.png)

🚀 **Live Demo:** [https://fullstack-chat-app-livid-five.vercel.app/login](https://fullstack-chat-app-livid-five.vercel.app/login)

[Video Tutorial on Youtube](https://youtu.be/ntKkVrQqBYY)

## 📋 Table of Contents

- [Highlights](#-highlights)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation Steps](#-installation-steps)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Build & Deploy](#-build--deploy)
- [Key Features](#-key-features-explained)
- [API Endpoints](#-api-endpoints)
- [Features Checklist](#-features)
- [Alternative Storage Options](#-alternative-storage-options)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🌟 Highlights

- 🌟 **Tech stack**: MERN + Socket.io + TailwindCSS + Daisy UI
- 🎃 **Authentication & Authorization** with JWT
- 👾 **Real-time messaging** with Socket.io
- 🚀 **Online user status** tracking
- 👌 **Global state management** with Zustand
- 🐞 **Error handling** on both server and client
- 📸 **Image storage** with Azure Storage Blob
- ⭐ **Deployment ready** for FREE!
- ⏳ Scalable and production-ready!

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS + Daisy UI** - Styling framework
- **Zustand** - State Management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Socket.io** - Real-time messaging
- **JWT** - Authentication
- **Azure Storage Blob** - Image storage
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
fullstack-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # User authentication logic
│   │   │   └── message.controller.js   # Message handling
│   │   ├── lib/
│   │   │   ├── cloudinary.js           # Cloudinary configuration
│   │   │   ├── gcp.js                  # GCP Storage configuration
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   ├── socket.js               # Socket.io setup
│   │   │   └── utils.js                # Helper functions
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js           # User schema
│   │   │   └── message.model.js        # Message schema
│   │   ├── routes/
│   │   │   ├── auth.route.js           # Auth endpoints
│   │   │   └── message.route.js        # Message endpoints
│   │   ├── seeds/
│   │   │   └── user.seed.js            # Database seeders
│   │   └── index.js                    # Server entry point
│   ├── .env                            # Environment variables
│   ├── package.json                    # Dependencies
│   └── README-GCP.md                   # GCP setup guide
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthImagePattern.jsx
│   │   │   ├── ChatContainer.jsx       # Main chat interface
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoChatSelected.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── skeletons/              # Loading placeholders
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── store/
│   │   │   ├── useAuthStore.js         # Auth state
│   │   │   ├── useChatStore.js         # Chat state
│   │   │   └── useThemeStore.js        # Theme state
│   │   ├── lib/
│   │   │   ├── axios.js                # Axios instance
│   │   │   └── utils.js                # Utility functions
│   │   ├── constants/
│   │   │   └── index.js                # App constants
│   │   ├── App.jsx                     # Main component
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Global styles
│   ├── public/                         # Static assets
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # TailwindCSS config
│   ├── postcss.config.js               # PostCSS config
│   ├── eslint.config.js                # ESLint rules
│   ├── package.json                    # Dependencies
│   └── README.md                       # Frontend guide
├── .gitignore                          # Git ignore rules
├── LICENSE                             # License
└── README.md                           # This file
```

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Optional Services

For image storage, use:
- **Azure Storage Account** ([Sign up](https://azure.microsoft.com/)) - Recommended

## 📦 Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/fullstack-chat-app.git
cd fullstack-chat-app
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## 🔐 Environment Variables

### MongoDB Setup

1. **Local MongoDB**:
   ```bash
   mongod
   ```
   Connection string: `mongodb://localhost:27017/chat-app`

2. **MongoDB Atlas** (Cloud):
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string from "Connect" button

### Azure Storage Setup

1. Sign up at [Azure](https://azure.microsoft.com/)
2. Create a Storage Account
3. Create a Blob Container named `profile-pictures`
4. Get your Connection String from Access Keys

### Create .env File

Create a `.env` file in the `backend` folder with the following:

```env
# ===== DATABASE =====
MONGODB_URI=mongodb://localhost:27017/chat-app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app?retryWrites=true&w=majority

# ===== SERVER =====
PORT=5001
NODE_ENV=development

# ===== JWT AUTHENTICATION =====
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# ===== AZURE STORAGE (Image Storage) =====
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=profile-pictures
```

## 🎯 Running the Application

### Development Mode

**Option 1: Run Both Servers Simultaneously**

```bash
npm run dev
```

This requires a root `package.json` script. If not configured, use Option 2.

**Option 2: Run Separately (Recommended)**

Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application

Once both servers are running:

- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)
- **WebSocket**: Connected via Socket.io on same port

### Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

## 📦 Build & Deploy

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# This creates a 'dist' folder with optimized files
```

### Start Production Server

```bash
cd backend
npm start
```

The backend will serve the frontend build files from `frontend/dist`.

## 📡 Key Features Explained

### 1. Real-time Messaging 💬

**Technology**: Socket.io

- Messages are delivered instantly without page refresh
- Users see typing indicators
- Message delivery confirmation

**How it works**:
```javascript
// Backend sends message
socket.emit('newMessage', messageData);

// Frontend receives
socket.on('newMessage', (message) => {
  // Update UI
});
```

### 2. Authentication & Authorization 🔐

**Technology**: JWT (JSON Web Tokens)

**Features**:
- Secure user registration
- Login with email/password
- Password hashing with bcrypt
- Protected API routes
- Auto-logout on token expiry

**Flow**:
1. User registers/logs in
2. Server generates JWT token
3. Client stores token (HTTP-only cookie)
4. Token sent with every request
5. Server verifies token

### 3. Online User Status 🟢

**Technology**: Socket.io events

- See which users are online in real-time
- Automatic status update when user connects/disconnects
- Display online indicator next to user name

### 4. Image Sharing 📸

**Technology**: Cloudinary or GCP Storage

**Flow**:
1. User selects image
2. File sent to server
3. Server uploads to Azure Storage Blob
4. Returns secure URL
5. URL stored in database
6. Image displayed in chat

### 5. Global State Management 🗂️

**Technology**: Zustand

Three main stores:
- `useAuthStore` - User authentication state
- `useChatStore` - Chat and messages state
- `useThemeStore` - Theme preferences

**Benefits**:
- Simple and lightweight
- No prop drilling
- Easy debugging
- Less boilerplate

### 6. Error Handling 🐞

**Frontend**:
- Try-catch blocks
- User-friendly error messages
- Fallback UI components

**Backend**:
- Express error middleware
- Validation errors
- Database error handling

## 🔗 API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: { user, token }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user, token }
```

#### Logout User
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: { message: "Logged out successfully" }
```

#### Check Auth Status
```
GET /api/auth/check
Authorization: Bearer <token>

Response: { user }
```

#### Update Profile
```
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "profilePic": <file>,
  "fullName": "Updated Name"
}

Response: { user }
```

### Message Routes

#### Get All Users
```
GET /api/messages/users
Authorization: Bearer <token>

Response: [{ id, fullName, profilePic, lastMessage }, ...]
```

#### Get Messages with User
```
GET /api/messages/:userId
Authorization: Bearer <token>

Response: [{ _id, senderId, text, image, timestamp }, ...]
```

#### Send Message
```
POST /api/messages/send/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Hello!",
  "image": "image_url (optional)"
}

Response: { message }
```

## 🎨 Features

✅ **User Registration & Login** - Secure authentication
✅ **Real-time Chat** - Instant messaging
✅ **Image Sharing** - Upload and share images
✅ **User Online Status** - See who's online
✅ **Profile Management** - Update profile picture and name
✅ **Theme Customization** - Light/Dark mode
✅ **Responsive Design** - Works on all devices
✅ **Error Handling** - Graceful error messages
✅ **Loading States** - Skeleton loaders
✅ **Socket.io Events** - Real-time updates

## 🔄 Socket.io Events

### Client to Server

```javascript
'sendMessage' - Send a new message
'userTyping' - Notify user is typing
'userStopTyping' - Notify user stopped typing
'userOnline' - Notify user is online
'userOffline' - Notify user went offline
```

### Server to Client

```javascript
'newMessage' - Receive new message
'userTyping' - User is typing
'userStopTyping' - User stopped typing
'userOnline' - User came online
'userOffline' - User went offline
'onlineUsers' - List of online users
```

## 📝 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  profilePic: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model

```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  text: String,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Azure Storage Setup

### Azure Storage Blob
- ✅ Integrated with Azure ecosystem
- ✅ Scalable and reliable
- ✅ Good documentation
- ✅ Pay-as-you-go pricing
- ✅ Enterprise-grade security

### Setup Instructions
1. Create an Azure account
2. Create a Storage Account
3. Create a Blob Container
4. Get your Connection String
5. Add to `.env` file

## 🚀 Deployment

### Frontend Deployment

**Vercel** (Recommended):
```bash
npm install -g vercel
cd frontend
vercel
```

**Netlify**:
- Connect GitHub repo
- Set build command: `npm run build`
- Set publish directory: `dist`

### Backend Deployment

**Render** (Free tier available):
1. Push code to GitHub
2. Sign up at [Render](https://render.com/)
3. Create new Web Service
4. Connect GitHub repo
5. Set start command: `npm start`
6. Add environment variables

**Railway**:
1. Sign up at [Railway](https://railway.app/)
2. Connect GitHub
3. Add MongoDB plugin
4. Deploy

**Heroku** (Paid):
```bash
heroku create your-app-name
git push heroku main
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5001 (Windows)
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Kill process on port 5001 (Mac/Linux)
lsof -ti:5001 | xargs kill -9
```

### MongoDB Connection Error

```
MongoNetworkError: connect ECONNREFUSED
```

**Solution**:
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Verify network access (if using Atlas)

### Azure Storage Upload Error

**Solution**:
- Verify AZURE_STORAGE_CONNECTION_STRING in .env
- Check AZURE_CONTAINER_NAME exists
- Verify Connection String is valid
- Check image file size (max 4.75GB per blob)
- Ensure file format is supported

### Socket.io Connection Issues

**Solution**:
- Check firewall settings
- Verify PORT in .env
- Check CORS configuration
- Look at browser console for errors

### npm install Errors

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Credits & Acknowledgments

- **Socket.io** - Real-time communication
- **TailwindCSS** - Styling framework
- **Daisy UI** - Component library
- **Azure Storage Blob** - Image management
- **MongoDB** - Database
- **Zustand** - State management
- **Vite** - Build tool

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed error messages
- Include environment details

## 🎉 Happy Coding!

Built with ❤️ using MERN Stack + Socket.io

---

**Last Updated**: December 2025
**Version**: 1.0.0
