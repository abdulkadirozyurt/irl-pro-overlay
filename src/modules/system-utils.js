// === System Utilities Module ===
// Handles system operations like browser opening, clipboard, etc.

const { spawn } = require('child_process');
const chalk = require('chalk');

class SystemUtils {
  constructor(tunnelManager) {
    this.tunnelManager = tunnelManager;
  }

  // Open overlay in browser
  openOverlay() {
    const url = this.tunnelManager.getUrl();
    
    if (url) {
      // Windows için tarayıcı açma
      spawn("cmd", ["/c", "start", url], { stdio: "ignore" });
      console.log(chalk.green(`🌐 Overlay tarayıcıda açıldı: ${chalk.cyan(url)}`));
    } else {
      console.log(chalk.red("❌ Aktif tunnel bulunamadı!"));
    }
  }

  // Copy URL to clipboard
  copyUrl() {
    const url = this.tunnelManager.getUrl();
    
    if (url) {
      // Windows için clipboard'a kopyalama
      const proc = spawn("clip", [], { stdio: ["pipe", "ignore", "ignore"] });
      proc.stdin.write(url);
      proc.stdin.end();

      console.log(chalk.green(`📋 URL panoya kopyalandı: ${chalk.cyan(url)}`));
    } else {
      console.log(chalk.red("❌ Aktif tunnel bulunamadı!"));
    }
  }

  // Setup graceful exit handling
  setupExitHandlers(cleanup) {
    // Handle exit gracefully
    process.on("SIGINT", () => {
      console.log(chalk.cyan("\n\n👋 Uygulama kapatılıyor..."));
      cleanup();
      process.exit(0);
    });

    // Add error handling
    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught Exception:", error);
      console.error("Stack:", error.stack);
      console.log("Press any key to exit...");
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", () => process.exit(1));
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
      console.log("Press any key to exit...");
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", () => process.exit(1));
    });
  }
}

module.exports = SystemUtils;
