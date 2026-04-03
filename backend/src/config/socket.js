const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Note = require('../models/noteModel');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.id;
      next();
    });
  });

  io.on('connection', (socket) => {
    socket.on('join_note_room', async ({ noteId }) => {
      try {
        const note = await Note.findById(noteId);
        if (!note) return socket.emit('error', 'Note does not exist');

        const isOwner = note.userId.toString() === socket.userId;
        const isSharedEditor = note.sharedWith?.some(
          user => user.userId.toString() === socket.userId && user.permission === 'edit'
        );

        if (isOwner || isSharedEditor) {
          socket.join(`note:${noteId}`);
          socket.to(`note:${noteId}`).emit('user_joined', { userId: socket.userId });
        } else {
          socket.emit('error', 'No permission to access room');
        }
      } catch (err) {
        socket.emit('error', 'Socket connection error');
      }
    });

    socket.on('leave_note_room', ({ noteId }) => {
      socket.leave(`note:${noteId}`);
    });

    socket.on('note_content_change', async ({ noteId, title, content, updatedAt }) => {
      socket.to(`note:${noteId}`).emit('note_updated', { title, content, updatedAt, editedBy: socket.userId });
    });
  });

  return io;
};
