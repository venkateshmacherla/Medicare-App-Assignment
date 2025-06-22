const express = require('express');
const cors = require('cors');
const http = require('http'); // <-- Add this
const { Server } = require('socket.io'); // <-- Add this

const authRoutes = require('./routes/auth');
const medRoutes = require('./routes/medications');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medications', medRoutes);

const PORT = 5001;

// --- Create HTTP server and attach Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// --- Socket.IO logic for real-time updates ---
io.on("connection", (socket) => {
  console.log("Socket.IO client connected");

  socket.on("medication-updated", () => {
    // Broadcast to all other clients
    socket.broadcast.emit("medication-updated");
  });
});

server.listen(PORT, () => console.log(`Server & Socket.IO running on port ${PORT}`));