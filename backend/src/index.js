import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
const allowedOrigins = new Set(
  [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000']
    .filter(Boolean)
    .map((url) => url.replace(/\/+$/, '')),
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const normalized = origin.replace(/\/+$/, '');
  if (allowedOrigins.has(normalized) || allowedOrigins.has(origin)) return true;
  if (/^https:\/\/[a-z0-9-_.]+\.vercel\.app$/i.test(normalized)) return true;
  if (/^https:\/\/[a-z0-9-_.]+\.onrender\.com$/i.test(normalized)) return true;
  if (/^http:\/\/localhost:\d+$/i.test(normalized)) return true;
  return false;
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log('server is running on PORT:' + PORT);
  connectDB();
});
