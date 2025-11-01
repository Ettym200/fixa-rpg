import { NextRequest } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

// Este arquivo será usado quando o servidor Socket.io estiver rodando
// Por enquanto, mantemos vazio pois o servidor será criado separadamente

export async function GET(request: NextRequest) {
  return new Response("Socket.io server endpoint", { status: 200 });
}

