// === Tunnel Management Module ===
// Handles LocalTunnel service for external access

const chalk = require('chalk');
const ora = require('ora');
const localtunnel = require('localtunnel');

class TunnelManager {
  constructor() {
    this.tunnel = null;
  }

  // Start localtunnel
  async startTunnel(settings) {
    const spinner = ora("🌐 Localtunnel başlatılıyor...").start();

    if (this.tunnel) {
      spinner.stop();
      console.log(chalk.yellow("⚠️  Tunnel zaten çalışıyor"));
      return this.tunnel.url;
    }

    try {
      const tunnelOptions = {
        port: settings.port,
      };

      // Only add subdomain if it's not empty
      if (settings.subdomain && settings.subdomain.trim() !== "") {
        tunnelOptions.subdomain = settings.subdomain.trim();
        spinner.text = `🌐 Tunnel başlatılıyor subdomain ile: ${settings.subdomain}`;
      } else {
        spinner.text = "🌐 Tunnel başlatılıyor rastgele subdomain ile...";
      }

      // Programatik olarak tunnel aç
      this.tunnel = await localtunnel(tunnelOptions);

      spinner.stop();
      console.log(chalk.green(`🌍 Tunnel açıldı: ${chalk.cyan(this.tunnel.url)}`));

      this.tunnel.on("close", () => {
        console.log(chalk.yellow("📡 Tunnel kapandı"));
        this.tunnel = null;
      });

      this.tunnel.on("error", (error) => {
        console.log(chalk.red("⚠️  Tunnel hatası:", error.message));
      });

      return this.tunnel.url;
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("⚠️  Tunnel başlatma hatası:", error.message));
      throw error;
    }
  }

  // Stop tunnel
  stopTunnel() {
    if (this.tunnel) {
      if (typeof this.tunnel.close === "function") {
        this.tunnel.close();
      }
      this.tunnel = null;
      console.log(chalk.yellow("📡 Tunnel durduruldu"));
    }
  }

  // Get tunnel status
  getTunnel() {
    return this.tunnel;
  }

  isActive() {
    return this.tunnel !== null;
  }

  getUrl() {
    return this.tunnel ? this.tunnel.url : null;
  }
}

module.exports = TunnelManager;
