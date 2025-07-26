// === Server Management Module ===
// Handles Express server startup and management

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

class ServerManager {
  constructor(configManager) {
    this.configManager = configManager;
    this.serverProcess = null;
    this.serverStarted = false;
    this.embeddedServer = null;
    
    // Try to load embedded server for production builds
    const embeddedServerPath = path.join(configManager.getBasePath(), "embedded-server.js");
    if (fs.existsSync(embeddedServerPath)) {
      this.embeddedServer = require(embeddedServerPath);
    }
  }

  // Start Express server
  async startServer(settings) {
    return new Promise((resolve, reject) => {
      if (this.serverStarted) {
        console.log(chalk.yellow("⚠️  Server zaten çalışıyor"));
        resolve();
        return;
      }

      try {
        // Update overlay with current settings
        this.configManager.updateOverlayWithSettings(settings);

        // Check if we have embedded server (production) or use external process (development)
        if (this.embeddedServer && this.configManager.isProduction()) {
          this._startEmbeddedServer(settings, resolve, reject);
        } else {
          this._startExternalServer(settings, resolve, reject);
        }
      } catch (error) {
        console.log(chalk.red("⚠️  Server başlatılamadı:", error.message));
        this.serverStarted = false;
        reject(error);
      }
    });
  }

  // Start embedded server (production)
  _startEmbeddedServer(settings, resolve, reject) {
    console.log(chalk.gray("🔧 Embedded server kullanılıyor (Production mode)"));

    const publicPath = path.join(this.configManager.getBasePath(), "public");

    // Check if public folder exists
    if (!fs.existsSync(publicPath)) {
      throw new Error(`Public klasörü bulunamadı: ${publicPath}`);
    }

    this.embeddedServer
      .startEmbeddedServer(settings.port, publicPath)
      .then(() => {
        this.serverStarted = true;
        console.log(chalk.green(`✅ Embedded server port ${settings.port} üzerinde başlatıldı`));
        resolve();
      })
      .catch(reject);
  }

  // Start external server process (development)
  _startExternalServer(settings, resolve, reject) {
    console.log(chalk.gray("🔧 External server process kullanılıyor (Development mode)"));

    // Start server with correct paths
    const serverPath = path.join(this.configManager.getBasePath(), "server.js");

    // Check if server.js exists
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server dosyası bulunamadı: ${serverPath}`);
    }

    console.log(chalk.gray(`🔧 Server dosyası: ${serverPath}`));

    // Use 'node' command
    this.serverProcess = spawn("node", [serverPath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PORT: settings.port },
      cwd: this.configManager.getBasePath(),
    });

    let serverReady = false;

    // Handle server output
    this.serverProcess.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("Server running") || output.includes("listening on")) {
        if (!serverReady) {
          serverReady = true;
          this.serverStarted = true;
          console.log(chalk.green(`✅ Server port ${settings.port} üzerinde başlatıldı`));
          resolve();
        }
      }
    });

    this.serverProcess.stderr.on("data", (data) => {
      console.log(chalk.red(`🔥 Server Error: ${data.toString()}`));
    });

    this.serverProcess.on("error", (error) => {
      console.log(chalk.red("⚠️  Server başlatma hatası:", error.message));
      this.serverStarted = false;
      reject(error);
    });

    this.serverProcess.on("exit", (code) => {
      console.log(chalk.yellow(`📦 Server kapandı. Kod: ${code}`));
      this.serverStarted = false;
      this.serverProcess = null;
    });

    // Timeout after 3 seconds
    setTimeout(() => {
      if (!serverReady) {
        this.serverStarted = true; // Assume it started
        console.log(chalk.green(`✅ Server port ${settings.port} üzerinde başlatıldı`));
        resolve();
      }
    }, 3000);
  }

  // Stop server
  stopServer() {
    // Stop embedded server or external process
    if (this.embeddedServer && this.configManager.isProduction()) {
      this.embeddedServer.stopEmbeddedServer().then(() => {
        console.log(chalk.yellow("📦 Embedded server durduruldu"));
      });
    }

    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
      console.log(chalk.yellow("📦 External server durduruldu"));
    }

    this.serverStarted = false;
  }

  // Get server status
  isServerStarted() {
    return this.serverStarted;
  }
}

module.exports = ServerManager;
