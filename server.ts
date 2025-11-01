import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocket } from "./lib/socketServer";

const dev = process.env.NODE_ENV !== "production";
// Garante que em produção sempre escute em 0.0.0.0 (todas as interfaces)
const hostname = process.env.NODE_ENV === "production" ? "0.0.0.0" : (process.env.HOSTNAME || "localhost");
const port = parseInt(process.env.PORT || "3000", 10);

console.log("🚀 Iniciando servidor...");
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${port}`);
console.log(`   HOSTNAME: ${hostname}`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log("✅ Next.js preparado");
  
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("❌ Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Inicializa Socket.io
  console.log("🔌 Inicializando Socket.io...");
  initializeSocket(httpServer);
  console.log("✅ Socket.io inicializado");

  httpServer.once("error", (err) => {
    console.error("❌ Erro no servidor HTTP:", err);
    process.exit(1);
  });

  httpServer.listen(port, hostname, () => {
    console.log(`\n✅ Servidor rodando em http://${hostname}:${port}`);
    console.log(`✅ Socket.io server running`);
    console.log(`✅ Pronto para receber conexões!\n`);
  });
}).catch((err) => {
  console.error("❌ Erro ao preparar Next.js:", err);
  process.exit(1);
});

