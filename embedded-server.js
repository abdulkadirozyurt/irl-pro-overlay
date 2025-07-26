// Embedded server module for production builds
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

let server = null;
let io = null;
let httpServer = null;

function startEmbeddedServer(port, publicPath) {
  return new Promise((resolve, reject) => {
    try {
      const app = express();

      // Middleware
      app.use(cors());
      app.use(express.json());
      app.use(express.static(publicPath));

      // Routes
      app.get("/", (req, res) => {
        res.sendFile(path.join(publicPath, "index.html"));
      });

      app.post("/location", (req, res) => {
        console.log("📍 Konum verisi alındı:", req.body);

        // Socket.IO ile tüm bağlı istemcilere gönder
        if (io) {
          io.emit("locationUpdate", req.body);
        }

        res.json({ success: true, message: "Konum güncellendi" });
      });

      // HTTP Server oluştur
      httpServer = http.createServer(app);

      // Socket.IO setup
      io = socketIo(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", (socket) => {
        console.log("🔌 Yeni istemci bağlandı:", socket.id);

        socket.on("disconnect", () => {
          console.log("🔌 İstemci ayrıldı:", socket.id);
        });
      });

      // Server'ı başlat
      httpServer.listen(port, () => {
        console.log(`✅ Server port ${port} üzerinde çalışıyor`);
        console.log(`🌐 Lokal erişim: http://localhost:${port}`);
        resolve();
      });

      httpServer.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function stopEmbeddedServer() {
  return new Promise((resolve) => {
    if (httpServer) {
      httpServer.close(() => {
        console.log("📦 Embedded server durduruldu");
        httpServer = null;
        io = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  startEmbeddedServer,
  stopEmbeddedServer,
};
