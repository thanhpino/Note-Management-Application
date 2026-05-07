// This file is deprecated. We are now using Laravel Echo with Reverb.
// Only keeping the exports to prevent import errors in other files.

export const socket = {
  emit: () => {},
  on: () => {},
  off: () => {},
  connect: () => {},
  disconnect: () => {},
};

export const initSocket = () => {};
export const connectSocket = () => {};
export const disconnectSocket = () => {};

export default socket;
