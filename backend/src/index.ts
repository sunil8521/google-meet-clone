import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const ROOMS = new Map<
  string,
  Map<string, { socketId: string; name: string; joinedAt: Date }>
>();
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const createRoom = (roomId: string) => {
  if (!ROOMS.has(roomId)) {
    ROOMS.set(roomId, new Map());
  }
  return ROOMS.get(roomId)!;
};

const addUserToRoom = (roomId: string, socketId: string, name: string) => {
  const room = createRoom(roomId);
  room.set(socketId, {
    socketId,
    name,
    joinedAt: new Date(),
  });
  return room;
};
const deleteUser = (roomId: string, socketId: string) => {
  const room = ROOMS.get(roomId);
  if (room) {
    room.delete(socketId);
    if (room.size == 0) {
      ROOMS.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    }
  }
};

const getRoomStats = () => {
  const stats = Array.from(ROOMS.entries()).map(([roomId, users]) => ({
    roomId,
    userCount: users.size,
    users: Array.from(users.values()),
  }));
  return stats;
};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
  let currentRoomId: string | null = null;

  socket.on("create-room", (data: { roomId: string; name: string }) => {
    const { roomId, name } = data;
    console.log(data);

    // Join socket room
    socket.join(roomId);
    currentRoomId = roomId;

    // Add user to room (using socketId as userId)
    const room = addUserToRoom(roomId, socket.id, name);

    console.log(`🏠 Room created: ${roomId} by ${name}`);
    console.log(`👥 Room ${roomId} now has ${room.size} users`);
    socket.emit("room-created", {
      roomId,
      participantCount: room.size,
      participants: Array.from(room.values()),
    });
  });

  socket.on("join-room", (data: { roomId: string; name: string }) => {
    const { roomId, name } = data;

    if (!ROOMS.has(data.roomId)) {
      socket.emit("socket-error", { message: "Invalid room id" });
      return;
    }
    socket.join(roomId);
    currentRoomId = roomId;
    const room = addUserToRoom(roomId, socket.id, name);

    const otherParticipants = Array.from(room.values()).filter(
      (user) => user.socketId !== socket.id
    );

    console.log(`🚪 ${name} joined room: ${roomId}`);
    console.log(`👥 Room ${roomId} now has ${room.size} users`);

    // Notify others in the room about new participant
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      name,
      participantCount: room.size,
    });
  });
  socket.on(
    "signal",
    (data: { type: string; webRtcData: any; to: string; from: string }) => {
      const { type, webRtcData, to, from } = data;
      console.log(`📡 Forwarding ${type} from ${from} to ${to}`);

      const targetSocket = io.sockets.sockets.get(to);
      if (!targetSocket) {
        console.log(`❌ Target socket ${to} not found or disconnected`);
        socket.emit("signal-error", {
          message: "Target user is not connected",
          targetId: to,
          originalType: type,
        });
        return;
      }
// console.log(data)
      socket.to(to).emit("signal", {
        type,
        webRtcData,
        from,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("📍 User connected:", socket.id);
    removeUser();
  });
  function removeUser() {
    if (currentRoomId) {
      const room = ROOMS.get(currentRoomId);
      const user = room?.get(socket.id);
      if (user) {
        socket.to(currentRoomId).emit("user-left", {
          name: user.name,
        });

        deleteUser(currentRoomId, socket.id);
        socket.leave(currentRoomId);
        currentRoomId = null;
      }
    }
  }
});

app.get("/", (req, res) => {
  res.json({ message: "WebRTC Server is running!" });
});
app.get("/api/rooms", (req, res) => {

  res.json({
    totalRooms: ROOMS.size,
    rooms: getRoomStats(),
  });
});
server.listen(3000, () => {
  console.log("server is running on 3000");

});
