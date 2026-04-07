# 🚀 Full Stack Real-time Chat Application - Project Overview

## 📌 Project Description

This is a **full-stack real-time chat application** built with the **MERN stack** (MongoDB, Express, React, Node.js) combined with Socket.io for real-time messaging. The application allows users to communicate with each other in real-time with features like authentication, online status tracking, and image sharing.

---

## 🎯 Key Features

### ✅ Authentication & Security
- User registration and login with JWT (JSON Web Tokens)
- Password encryption using bcryptjs
- Secure authentication middleware for protected routes
- Cookie-based session management

### 💬 Real-time Messaging
- Instant message delivery using Socket.io
- One-on-one chat conversations
- Message history persistence in MongoDB
- Support for text messages and image sharing

### 👥 User Management
- User profiles with customizable avatars
- Online/offline status tracking
- User presence indicators
- Profile picture uploads via Azure Storage Blob

### 🎨 User Interface
- Responsive design with TailwindCSS and Daisy UI
- Light/Dark theme toggle
- Real-time UI updates with React
- Loading skeletons for better UX
- Clean and intuitive chat interface

---

## 🏗️ Architecture Overview

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatContainer.jsx        # Main chat display
│   │   ├── MessageInput.jsx         # Message input form
│   │   ├── Sidebar.jsx              # User list sidebar
│   │   ├── Navbar.jsx               # Top navigation
│   │   └── skeletons/               # Loading placeholders
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx             # Main chat page
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── SignUpPage.jsx           # Registration form
│   │   ├── ProfilePage.jsx          # User profile
│   │   └── SettingsPage.jsx         # App settings
│   ├── store/               # Zustand state management
│   │   ├── useAuthStore.js          # Auth state
│   │   ├── useChatStore.js          # Chat state
│   │   └── useThemeStore.js         # Theme state
│   ├── lib/                 # Utilities
│   │   ├── axios.js                 # HTTP client configuration
│   │   └── utils.js                 # Helper functions
│   └── constants/           # App constants
```

**Technologies:**
- React 18 - UI framework
- Vite - Lightning-fast build tool
- TailwindCSS - Utility-first CSS framework
- Daisy UI - Component library
- Zustand - State management (simpler than Redux)
- Socket.io Client - Real-time communication
- Axios - HTTP requests
- React Router - Client-side routing

---

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/         # Business logic
│   │   ├── auth.controller.js       # Auth operations
│   │   └── message.controller.js    # Message operations
│   ├── routes/              # API endpoints
│   │   ├── auth.route.js            # Auth routes
│   │   └── message.route.js         # Message routes
│   ├── models/              # MongoDB schemas
│   │   ├── user.model.js            # User schema
│   │   └── message.model.js         # Message schema
│   ├── middleware/          # Request handlers
│   │   └── auth.middleware.js       # JWT verification
│   ├── lib/                 # Configuration
│   │   ├── db.js                    # MongoDB connection
│   │   ├── socket.js                # Socket.io setup
│   │   ├── cloudinary.js            # Azure Storage Blob configuration
│   │   └── utils.js                 # Helper functions
│   ├── seeds/               # Database seeders
│   │   └── user.seed.js             # Sample user data
│   └── index.js             # Server entry point
```

**Technologies:**
- Express.js - Web framework
- Node.js - Runtime environment
- MongoDB - NoSQL database
- Mongoose - MongoDB ODM
- Socket.io - Real-time bidirectional communication
- JWT - Authentication tokens
- Bcryptjs - Password hashing
- Azure Storage Blob - Cloud image storage
- Cors - Cross-origin resource sharing
- Dotenv - Environment variable management

---

## 📊 Data Models

### User Schema
```javascript
{
  email: String (unique, required),
  fullName: String (required),
  password: String (hashed, min 6 chars),
  profilePic: String (image URL),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Message Schema
```javascript
{
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  text: String (optional),
  image: String (optional),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔄 Real-time Communication Flow

### Socket.io Events

**Server Events (Listening):**
- `message.send` - Client sends a message
- `user.setStatus` - User connects/disconnects

**Client Events (Broadcasting):**
- `message.new` - New message received
- `users.online` - Online users list updated
- `user.typing` - User is typing indicator

**Workflow:**
1. User logs in → Socket connection established
2. User sends a message → `message.send` event
3. Server validates & saves to MongoDB
4. Server broadcasts `message.new` to recipient
5. Recipient receives real-time notification
6. UI updates instantly

---

## 🚀 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile
- `PUT /update-profile` - Update profile/avatar

### Message Routes (`/api/messages`)
- `GET /users` - Get all users for chat list
- `GET /:userId` - Get message history with user
- `POST /send/:userId` - Send message to user

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- Cloudinary account (for image uploads)
- npm or yarn package manager

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project root
cd fullstack-chat-app

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Create Environment Variables

**Backend (.env)**
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatdb

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Azure Storage (Image Upload)
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_CONTAINER_NAME=profile-pictures
```

**Frontend (create .env.local in frontend folder)**
```env
VITE_API_URL=http://localhost:5001/api
```

### Step 3: Run the Application

**Option A: Separate Terminals (Development)**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: From Root (if configured)**
```bash
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

---

## 📦 Project Dependencies Summary

### Backend Dependencies
| Package | Purpose |
|---------|---------|
| express | Web server framework |
| mongoose | MongoDB object modeling |
| socket.io | Real-time communication |
| jsonwebtoken | Authentication tokens |
| bcryptjs | Password hashing |
| cloudinary | Cloud image storage |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| cookie-parser | Cookie handling |

### Frontend Dependencies
| Package | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Client-side routing |
| zustand | State management |
| socket.io-client | Real-time client |
| axios | HTTP requests |
| tailwindcss | CSS framework |
| daisyui | UI components |
| vite | Build tool |

---

## 🔐 Authentication Flow

1. **Sign Up:**
   - User enters email, name, password
   - Password is hashed with bcryptjs
   - User document created in MongoDB
   - JWT token generated and sent to client
   - Token stored in HTTP-only cookie

2. **Login:**
   - User enters credentials
   - Password validated against stored hash
   - JWT token generated
   - Token stored in cookie for future requests

3. **Protected Routes:**
   - Middleware checks JWT in cookies
   - If valid, allows request to proceed
   - If invalid/expired, returns 401 Unauthorized

---

## 💾 Database Connection

The application uses **MongoDB Atlas** (cloud) or local MongoDB:

```javascript
// Connection string format:
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

**Collections:**
- `users` - Stores user accounts
- `messages` - Stores chat messages

---

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach using TailwindCSS
- Adaptive layouts for all screen sizes
- Touch-friendly UI components
- Optimized performance for slower networks

---

## 🎨 Theming

Users can toggle between:
- **Light Theme** - Bright, clean interface
- **Dark Theme** - Eye-friendly dark mode
- Theme preference stored in Zustand store
- TailwindCSS handles theme switching via data attributes

---

## 🚀 Deployment Options

### Frontend Deployment
- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Simple drag-and-drop
- **GitHub Pages** - Static hosting

### Backend Deployment
- **Railway** - Simple Node.js hosting
- **Render** - Free tier with live SQLite
- **Heroku** - Classic Node.js hosting
- **AWS** - Scalable enterprise solution

---

## 📝 Project Workflow

### Development Cycle
1. **Development** - Make changes locally with hot reload
2. **Testing** - Test features in dev environment
3. **Building** - Build production-ready bundles
4. **Deployment** - Deploy to hosting platform

### Scripts

**Root:**
```bash
npm run build    # Build entire project
npm start        # Start backend server
```

**Backend:**
```bash
npm run dev      # Run with nodemon (auto-reload)
npm start        # Run production server
```

**Frontend:**
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
```

---

## 🐛 Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution:** Check MONGODB_URI in .env file and verify MongoDB is running

### Issue: CORS errors
**Solution:** Ensure frontend URL matches in backend CORS configuration

### Issue: Images not uploading
**Solution:** Verify Cloudinary credentials are correct in .env

### Issue: Real-time messages not appearing
**Solution:** Check Socket.io connection in browser console

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Socket.io Tutorial](https://socket.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Zustand Store](https://github.com/pmndrs/zustand)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🎓 What You'll Learn

By studying this project, you'll understand:
- ✅ Full-stack MERN development
- ✅ Real-time communication with Socket.io
- ✅ JWT authentication & security
- ✅ State management with Zustand
- ✅ RESTful API design
- ✅ Database modeling with MongoDB
- ✅ Responsive UI with TailwindCSS
- ✅ Deployment best practices

---

**Happy Coding! 🎉**
