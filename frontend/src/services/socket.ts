import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling']
});

export const initSocket = (token: string) => {
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
