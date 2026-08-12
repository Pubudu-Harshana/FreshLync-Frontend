import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : `${window.location.protocol}//${window.location.hostname}:5000`;

export const socket = io(BACKEND_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('⚡ Connected to FreshLync Real-time WebSockets Server:', socket.id);
});
