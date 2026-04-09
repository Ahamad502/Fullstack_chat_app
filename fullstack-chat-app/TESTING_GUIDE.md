# Testing Guide - Full Stack Chat Application

This guide will walk you through testing the chat application step by step.

---

## Prerequisites ✅

Before testing, ensure:
- Node.js is installed
- All dependencies are installed
- `.env` files are configured in both `backend/` and `frontend/`
- MongoDB is running (local or cloud)

---

## Step 1: Verify Your Environment Setup

Open a terminal in the project root and check:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## Step 2: Install Dependencies (if not already done)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 3: Start the Backend Server

Open a **new terminal** and run:

```bash
cd fullstack-chat-app/backend
npm start
```

**Expected Output:**
```
[Expected] Server started on PORT 5001
[Expected] MongoDB Connected Successfully
```

✅ **Backend is ready** when you see these messages.

---

## Step 4: Start the Frontend Server

Open **another new terminal** and run:

```bash
cd fullstack-chat-app/frontend
npm run dev
```

**Expected Output:**
```
VITE v5.4.11  ready in XXXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is ready** when you see these messages.

---

## Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5173/
```

You should see the login page.

---

## Step 6: Test User Registration

1. Click **"Sign Up"** on the login page
2. Fill in the form:
   - **Full Name**: Enter your name
   - **Email**: Enter a test email (e.g., `test@example.com`)
   - **Password**: Enter a password (min 6 characters)
   - **Profile Picture**: Upload an image (optional)
3. Click **"Create Account"**
4. **Expected**: You should be logged in and redirected to the home page

---

## Step 7: Test User Login

1. Log out (if you're already logged in)
   - Click the menu icon → **"Logout"**
2. Go back to login page
3. Fill in:
   - **Email**: Use the email from Step 6
   - **Password**: Use the password from Step 6
4. Click **"Sign In"**
5. **Expected**: You should be logged in successfully

---

## Step 8: Test Messaging (2-User Test)

To test messaging, you need **2 users**:

### Create a Second User:
1. Open an **Incognito/Private window** in your browser
2. Go to `http://localhost:5173/`
3. Sign up with a different email (e.g., `user2@example.com`)
4. **Expected**: You're now logged in as User 2

### Send Messages:
1. **In User 1 window**: Click on User 2 from the sidebar
2. Type a message: `"Hello User 2!"`
3. Press **Enter** or click **Send**
4. **Expected**: Message appears in the chat immediately

5. **In User 2 window**: You should see User 1's message appear in real-time
6. Reply with: `"Hi User 1!"`
7. **Expected**: User 1 receives the message in real-time

---

## Step 9: Test Profile Settings

1. Click on your **profile icon** (top right)
2. Go to **"Profile"**
3. Update your details:
   - Change your status message
   - Upload a new profile picture
4. Click **"Save"**
5. **Expected**: Changes are saved and visible

---

## Step 10: Test Theme Toggle

1. Look for the **theme icon** (sun/moon icon) in the navbar
2. Click it to toggle between **Light** and **Dark** mode
3. **Expected**: The entire app theme changes

---

## Step 11: Test Real-time Notifications

1. Have 2 users logged in (from Step 8)
2. User 1 sends a message to User 2
3. **Expected**: 
   - User 2 sees the message instantly in chat
   - Unread message count updates (if not currently in that chat)

---

## Troubleshooting

### ❌ Backend won't start
- Check if port 5001 is already in use
- Verify MongoDB connection string in `.env`
- Check internet connection

### ❌ Frontend won't start
- Check if port 5173 is in use
- Try: `npm run dev -- --port 5174`
- Clear node_modules: `rm -rf node_modules && npm install`

### ❌ Can't log in
- Verify email and password are correct
- Check MongoDB is running
- Check backend server is running (see Step 3)

### ❌ Messages not sending
- Check browser console for errors (F12)
- Verify both users are using the same backend
- Check WebSocket connection is active

### ❌ Images not loading
- Verify Cloudinary credentials in backend `.env`
- Check file upload size limits

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change port in code |
| MongoDB connection fails | Check connection string in `.env` |
| CORS error | Verify frontend URL in backend `.env` |
| Socket.io connection fails | Check backend is running on correct port |
| Images won't upload | Verify Cloudinary API key in `.env` |

---

## Advanced Testing (Optional)

### Test on Multiple Devices
- Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Access frontend from another device: `http://<YOUR_IP>:5173/`

### Test Network Stress
- Open 3+ user sessions
- Send multiple messages
- Check if real-time updates work smoothly

### Test Error Handling
- Try sending empty messages
- Try uploading large files
- Try invalid email formats

---

## Testing Checklist ✅

- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can access app at http://localhost:5173/
- [ ] Can register a new user
- [ ] Can log in with valid credentials
- [ ] Can view list of users in sidebar
- [ ] Can send and receive messages in real-time
- [ ] Messages appear in correct order
- [ ] Can update profile picture
- [ ] Can change theme (light/dark)
- [ ] Can log out successfully
- [ ] Multiple users can chat simultaneously

---

## Need Help?

If you encounter issues:
1. Check the browser **Developer Console** (F12)
2. Check the **terminal output** of running servers
3. Verify all `.env` files are correctly configured
4. Try restarting both servers

Happy Testing! 🚀
