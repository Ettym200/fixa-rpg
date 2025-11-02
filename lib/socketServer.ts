import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initializeSocket(server: HTTPServer) {
  if (io) {
    console.log("⚠️ Socket.io já inicializado, reutilizando...");
    return io;
  }

  console.log("🔌 Inicializando Socket.io server...");
  
  try {
    io = new SocketIOServer(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });
    
    console.log("✅ Socket.io server criado");
  } catch (error) {
    console.error("❌ Erro ao criar Socket.io server:", error);
    throw error;
  }

  // Armazena dados dos players em memória
  const players: Map<string, any> = new Map();

  io.on("connection", (socket) => {
    console.log("✅ Cliente conectado:", socket.id);

    // Quando um player envia seus dados
    socket.on("player:sync", (playerData: any) => {
      const playerId = playerData.playerId || socket.id;
      
      // Atualiza dados do player
      players.set(playerId, {
        ...playerData,
        socketId: socket.id,
        lastSeen: Date.now(),
      });

      // Notifica todos os admins sobre a atualização
      socket.broadcast.emit("player:updated", {
        playerId,
        ...players.get(playerId),
      });

      // Envia lista completa de players para o novo cliente (se for admin)
      socket.emit("players:list", Array.from(players.values()));
    });

    // Quando admin solicita lista de players
    socket.on("players:get", () => {
      socket.emit("players:list", Array.from(players.values()));
    });

    // Quando player envia notificação de mudança
    socket.on("notification:new", (notification: any) => {
      console.log("🔔 Notificação recebida via Socket.io:", notification.id);
      // Envia para todos os admins (broadcast)
      socket.broadcast.emit("notification:received", notification);
    });

    // Quando player atualiza sua ficha
    socket.on("player:update", (updateData: any) => {
      const playerId = updateData.playerId || socket.id;
      const currentData = players.get(playerId) || {};

      players.set(playerId, {
        ...currentData,
        ...updateData,
        lastSeen: Date.now(),
      });

      // Notifica todos os admins
      socket.broadcast.emit("player:updated", players.get(playerId));
    });

    // Quando desconecta
    socket.on("disconnect", () => {
      console.log("❌ Cliente desconectado:", socket.id);
      
      // Remove player se desconectou
      for (const [playerId, data] of players.entries()) {
        if (data.socketId === socket.id) {
          players.delete(playerId);
          socket.broadcast.emit("player:disconnected", { playerId });
          break;
        }
      }
    });

    // Envia lista inicial de players
    socket.emit("players:list", Array.from(players.values()));
  });

  return io;
}

export function getSocketIO() {
  return io;
}

