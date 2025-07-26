// === Main Application Coordinator ===
// Orchestrates all modules and handles the main application flow

const chalk = require('chalk');

// Import all modules
const ConfigManager = require('./modules/config-manager');
const ServerManager = require('./services/server-manager');
const TunnelManager = require('./services/tunnel-manager');
const MenuManager = require('./ui/menu-manager');
const SetupWizard = require('./ui/setup-wizard');
const SystemUtils = require('./modules/system-utils');

class IRLProOverlayApp {
  constructor() {
    // Initialize managers
    this.configManager = new ConfigManager();
    this.serverManager = new ServerManager(this.configManager);
    this.tunnelManager = new TunnelManager();
    this.menuManager = new MenuManager(this.configManager, this.serverManager, this.tunnelManager);
    this.setupWizard = new SetupWizard(this.configManager);
    this.systemUtils = new SystemUtils(this.tunnelManager);

    // Setup exit handlers
    this.systemUtils.setupExitHandlers(() => this.stopServices());
  }

  // Start services
  async startServices() {
    const settings = this.configManager.loadSettings();

    try {
      console.log(chalk.cyan("\n🚀 Servisler başlatılıyor..."));

      // Start server
      await this.serverManager.startServer(settings);

      // Start tunnel
      await this.tunnelManager.startTunnel(settings);

      console.log(chalk.green("\n✅ Tüm servisler başarıyla başlatıldı!"));
    } catch (error) {
      console.log(chalk.red(`\n❌ Servis başlatma hatası: ${error.message}`));
    }
  }

  // Stop services
  stopServices() {
    this.tunnelManager.stopTunnel();
    this.serverManager.stopServer();
  }

  // Main application loop
  async run() {
    this.menuManager.displayWelcome();

    // Check for first time setup or load existing settings
    const settings = await this.setupWizard.checkAndRunFirstTimeSetup();

    if (settings.autoStart) {
      console.log(chalk.cyan("🔄 Otomatik başlatma aktif, servisler başlatılıyor...\n"));
      await this.startServices();
    }

    // Main application loop
    while (true) {
      try {
        const action = await this.menuManager.showMainMenu();

        switch (action) {
          case "start":
            await this.startServices();
            break;

          case "stop":
            this.stopServices();
            console.log(chalk.yellow("⏹️  Tüm servisler durduruldu!"));
            break;

          case "settings":
            await this.menuManager.showSettingsMenu();
            break;

          case "open":
            this.systemUtils.openOverlay();
            break;

          case "copy":
            this.systemUtils.copyUrl();
            break;

          case "refresh":
            // Status will be refreshed in the next loop
            break;

          case "exit":
            console.log(chalk.cyan("\n👋 Çıkış yapılıyor..."));
            this.stopServices();
            process.exit(0);

          default:
            console.log(chalk.red("❌ Geçersiz seçim!"));
        }

        // Wait a moment before showing menu again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(chalk.red(`\n❌ Hata: ${error.message}`));
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}

module.exports = IRLProOverlayApp;
