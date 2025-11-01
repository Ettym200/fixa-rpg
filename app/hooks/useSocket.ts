"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conecta ao servidor Socket.io
    // Em produção, usa a URL do servidor; em dev, usa localhost
    const socketUrl = typeof window !== "undefined" 
      ? window.location.origin 
      : "http://localhost:3000";

    console.log("🔌 Conectando ao Socket.io:", socketUrl);

    const socketInstance = io(socketUrl, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Conectado ao Socket.io:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Desconectado do Socket.io");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Erro de conexão Socket.io:", error);
    });

    return () => {
      console.log("🔌 Desconectando Socket.io");
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

