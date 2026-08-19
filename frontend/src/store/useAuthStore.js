import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  }
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5001';
  }
  return window.location.origin;
};

const BASE_URL = getSocketUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      } else {
        console.error('Error in checkAuth:', error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      set({ authUser: res.data });
      toast.success('Account created successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      set({ authUser: res.data });
      toast.success('Logged in successfully');

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log in');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.log('Error in logout request:', error);
    } finally {
      localStorage.removeItem('token');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('error in update profile:', error);
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;

    if (socket?.connected) return;

    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    });

    newSocket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: (userIds || []).map((id) => String(id)) });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
