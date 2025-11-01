// Versão JavaScript do server.ts para garantir compatibilidade
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// Importa Socket.io de forma compatível
let initializeSocket;
try {
  const socketServer = require("./lib/socketServer");
  initializeSocket = socketServer.initializeSocket;
} catch (error) {
  console.warn("⚠️ Socket.io não disponível, continuando sem ele:", error.message);
  initializeSocket = () => {
    console.warn("⚠️ Socket.io não inicializado");
    return null;
  };
}

const dev = process.env.NODE_ENV !== "production";
// Garante que em produção sempre escute em 0.0.0.0 (todas as interfaces)
const hostname = process.env.NODE_ENV === "production" ? "0.0.0.0" : (process.env.HOSTNAME || "localhost");
const port = parseInt(process.env.PORT || "3000", 10);

console.log("🚀 Iniciando servidor...");
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${port}`);
console.log(`   HOSTNAME: ${hostname}`);
console.log(`   __dirname: ${__dirname}`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log("✅ Next.js preparado");
    
    const httpServer = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("❌ Error occurred handling", req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("internal server error");
        }
      }
    });

    // Inicializa Socket.io (pode falhar silenciosamente)
    try {
      console.log("🔌 Inicializando Socket.io...");
      initializeSocket(httpServer);
      console.log("✅ Socket.io inicializado");
    } catch (socketError) {
      console.warn("⚠️ Erro ao inicializar Socket.io (continuando sem ele):", socketError.message);
    }

    httpServer.once("error", (err) => {
      console.error("❌ Erro no servidor HTTP:", err);
      process.exit(1);
    });

    httpServer.listen(port, hostname, () => {
      console.log(`\n✅ Servidor rodando em http://${hostname}:${port}`);
      console.log(`✅ Pronto para receber conexões!\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao preparar Next.js:", err);
    console.error("Stack:", err.stack);
    process.exit(1);
  });

