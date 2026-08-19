import 'dotenv/config';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow all incoming origins with credentials
      callback(null, true);
    },
    credentials: true,
  },
});

// Map of userId -> Set of socketId (supports multiple tabs / windows per user)
const userSocketMap = {}; // { [userId: string]: Set<string> }

export function getReceiverSocketId(userId) {
  const stringId = String(userId);
  if (!userSocketMap[stringId]) return null;
  const sockets = Array.from(userSocketMap[stringId]);
  return sockets[sockets.length - 1] || null;
}

export function getReceiverSocketIds(userId) {
  const stringId = String(userId);
  if (!userSocketMap[stringId]) return [];
  return Array.from(userSocketMap[stringId]);
}

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected:', socket.id, 'userId:', userId);

  if (userId && userId !== 'undefined' && userId !== 'null') {
    const stringUserId = String(userId);
    if (!userSocketMap[stringUserId]) {
      userSocketMap[stringUserId] = new Set();
    }
    userSocketMap[stringUserId].add(socket.id);
  }

  // Send unique online user IDs to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id, 'userId:', userId);
    if (userId && userId !== 'undefined' && userId !== 'null') {
      const stringUserId = String(userId);
      if (userSocketMap[stringUserId]) {
        userSocketMap[stringUserId].delete(socket.id);
        if (userSocketMap[stringUserId].size === 0) {
          delete userSocketMap[stringUserId];
        }
      }
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server, userSocketMap };

