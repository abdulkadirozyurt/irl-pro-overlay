// === UI Menu Module ===
// Handles all CLI user interface and menu interactions

const inquirer = require('inquirer');
const chalk = require('chalk');

class MenuManager {
  constructor(configManager, serverManager, tunnelManager) {
    this.configManager = configManager;
    this.serverManager = serverManager;
    this.tunnelManager = tunnelManager;
  }

  // Display current status
  displayStatus() {
    console.log(chalk.cyan("\n📊 Durum Bilgisi:"));
    console.log(chalk.gray("─".repeat(50)));

    // Server status
    const serverStatus = this.serverManager.isServerStarted() 
      ? chalk.green("✅ Çalışıyor") 
      : chalk.red("❌ Durduruldu");
    console.log(`🖥️  Server Durumu: ${serverStatus}`);

    // Tunnel status
    const tunnelStatus = this.tunnelManager.isActive() 
      ? chalk.green("✅ Bağlı") 
      : chalk.red("❌ Bağlı değil");
    console.log(`🌐 Tunnel Durumu: ${tunnelStatus}`);

    // Tunnel URL
    const url = this.tunnelManager.getUrl();
    if (url) {
      console.log(`🔗 Overlay URL: ${chalk.cyan(url)}`);
    }

    console.log(chalk.gray("─".repeat(50)));
  }

  // Main menu
  async showMainMenu() {
    this.displayStatus();

    const choices = [
      { 
        name: "🚀 Servisleri Başlat", 
        value: "start", 
        disabled: this.serverManager.isServerStarted() 
      },
      { 
        name: "⏹️  Servisleri Durdur", 
        value: "stop", 
        disabled: !this.serverManager.isServerStarted() 
      },
      { name: "⚙️  Ayarları Düzenle", value: "settings" },
      { 
        name: "🌐 Overlay'i Tarayıcıda Aç", 
        value: "open", 
        disabled: !this.tunnelManager.isActive() 
      },
      { 
        name: "📋 URL'yi Panoya Kopyala", 
        value: "copy", 
        disabled: !this.tunnelManager.isActive() 
      },
      { name: "📊 Durumu Yenile", value: "refresh" },
      { name: "❌ Çıkış", value: "exit" },
    ];

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Ne yapmak istiyorsunuz?",
        choices: choices,
        pageSize: 10,
      },
    ]);

    return action;
  }

  // Settings menu
  async showSettingsMenu() {
    const settings = this.configManager.loadSettings();

    console.log(chalk.cyan("\n⚙️  Mevcut Ayarlar:"));
    console.log(chalk.gray("─".repeat(50)));
    console.log(`📍 LocationIQ API Key: ${chalk.yellow(settings.locationIqApiKey.substring(0, 20) + "...")}`);
    console.log(`🌤️  Weather API Key: ${chalk.yellow(settings.weatherApiKey.substring(0, 20) + "...")}`);
    console.log(`🕐 TimezoneDB API Key: ${chalk.yellow(settings.timezoneDbApiKey.substring(0, 20) + "...")}`);
    console.log(`🚗 Hız Sınırı: ${chalk.yellow(settings.speedThreshold)} km/h`);
    console.log(`⏱️  Güncelleme Aralığı: ${chalk.yellow(settings.updateInterval)} saniye`);
    console.log(`🔌 Port: ${chalk.yellow(settings.port)}`);
    console.log(`🌐 Subdomain: ${chalk.yellow(settings.subdomain || "rastgele")}`);
    console.log(`🔄 Otomatik Başlat: ${settings.autoStart ? chalk.green("Evet") : chalk.red("Hayır")}`);
    console.log(chalk.gray("─".repeat(50)));

    const { settingAction } = await inquirer.prompt([
      {
        type: "list",
        name: "settingAction",
        message: "Hangi ayarı değiştirmek istiyorsunuz?",
        choices: [
          { name: "📍 LocationIQ API Key", value: "locationIqApiKey" },
          { name: "🌤️  Weather API Key", value: "weatherApiKey" },
          { name: "🕐 TimezoneDB API Key", value: "timezoneDbApiKey" },
          { name: "🚗 Hız Sınırı (km/h)", value: "speedThreshold" },
          { name: "⏱️  Güncelleme Aralığı (saniye)", value: "updateInterval" },
          { name: "🔌 Port", value: "port" },
          { name: "🌐 Subdomain", value: "subdomain" },
          { name: "🔄 Otomatik Başlat", value: "autoStart" },
          { name: "💾 Tüm Ayarları Düzenle", value: "editAll" },
          { name: "🔙 Ana Menüye Dön", value: "back" },
        ],
      },
    ]);

    if (settingAction === "back") {
      return;
    }

    if (settingAction === "editAll") {
      await this.editAllSettings();
    } else {
      await this.editSingleSetting(settingAction, settings);
    }
  }

  // Edit single setting
  async editSingleSetting(settingKey, settings) {
    let prompt;

    switch (settingKey) {
      case "speedThreshold":
      case "port":
      case "updateInterval":
        prompt = {
          type: "number",
          name: "value",
          message: `Yeni ${settingKey} değerini girin:`,
          default: settings[settingKey],
          validate: (value) => {
            if (settingKey === "port" && (value < 1000 || value > 65535)) {
              return "Port 1000-65535 arasında olmalıdır";
            }
            if (settingKey === "speedThreshold" && (value < 0 || value > 50)) {
              return "Hız sınırı 0-50 km/h arasında olmalıdır";
            }
            if (settingKey === "updateInterval" && (value < 1 || value > 60)) {
              return "Güncelleme aralığı 1-60 saniye arasında olmalıdır";
            }
            return true;
          },
        };
        break;
      case "autoStart":
        prompt = {
          type: "confirm",
          name: "value",
          message: "Otomatik başlatma aktif olsun mu?",
          default: settings[settingKey],
        };
        break;
      default:
        prompt = {
          type: "input",
          name: "value",
          message: `Yeni ${settingKey} değerini girin:`,
          default: settings[settingKey],
          validate: (value) => {
            if (!value.trim()) {
              return "Bu alan boş bırakılamaz";
            }
            return true;
          },
        };
    }

    const { value } = await inquirer.prompt([prompt]);

    settings[settingKey] = value;

    if (this.configManager.saveSettings(settings)) {
      console.log(chalk.green("✅ Ayar kaydedildi!"));
    } else {
      console.log(chalk.red("❌ Ayar kaydedilemedi!"));
    }
  }

  // Edit all settings
  async editAllSettings() {
    const settings = this.configManager.loadSettings();

    const newSettings = await inquirer.prompt([
      {
        type: "input",
        name: "locationIqApiKey",
        message: "📍 LocationIQ API Key:",
        default: settings.locationIqApiKey,
        validate: (value) => (value.trim() ? true : "Bu alan zorunludur"),
      },
      {
        type: "input",
        name: "weatherApiKey",
        message: "🌤️  Weather API Key:",
        default: settings.weatherApiKey,
        validate: (value) => (value.trim() ? true : "Bu alan zorunludur"),
      },
      {
        type: "input",
        name: "timezoneDbApiKey",
        message: "🕐 TimezoneDB API Key:",
        default: settings.timezoneDbApiKey,
        validate: (value) => (value.trim() ? true : "Bu alan zorunludur"),
      },
      {
        type: "number",
        name: "speedThreshold",
        message: "🚗 Hız Sınırı (km/h):",
        default: settings.speedThreshold,
        validate: (value) => (value >= 0 && value <= 50 ? true : "Hız sınırı 0-50 km/h arasında olmalıdır"),
      },
      {
        type: "number",
        name: "updateInterval",
        message: "⏱️  Güncelleme Aralığı (saniye):",
        default: settings.updateInterval,
        validate: (value) => (value >= 1 && value <= 60 ? true : "Güncelleme aralığı 1-60 saniye arasında olmalıdır"),
      },
      {
        type: "number",
        name: "port",
        message: "🔌 Port:",
        default: settings.port,
        validate: (value) => (value >= 1000 && value <= 65535 ? true : "Port 1000-65535 arasında olmalıdır"),
      },
      {
        type: "input",
        name: "subdomain",
        message: "🌐 Subdomain (boş bırakılabilir):",
        default: settings.subdomain,
      },
      {
        type: "confirm",
        name: "autoStart",
        message: "🔄 Otomatik başlatma aktif olsun mu?",
        default: settings.autoStart,
      },
    ]);

    // Keep language setting
    newSettings.language = settings.language;

    if (this.configManager.saveSettings(newSettings)) {
      console.log(chalk.green("✅ Tüm ayarlar kaydedildi!"));
    } else {
      console.log(chalk.red("❌ Ayarlar kaydedilemedi!"));
    }
  }

  // Display welcome screen
  displayWelcome() {
    // Use console.clear() instead of clear package for better compatibility
    console.clear();

    // Debug info for production builds
    if (this.configManager.isProduction()) {
      const basePath = this.configManager.getBasePath();
      console.log(chalk.gray(`🔧 Production Mode - Base Path: ${basePath}`));
      console.log(chalk.gray(`📁 Settings Path: ${this.configManager.getSettingsPath()}`));
      console.log(chalk.gray(`📁 Server Path: ${require('path').join(basePath, "server.js")}`));
      console.log(chalk.gray(`📁 Public Path: ${require('path').join(basePath, "public")}`));
      console.log(chalk.gray("─".repeat(60)));
    }

    // Simple ASCII art instead of figlet
    console.log(
      chalk.cyan(`
 ██╗██████╗ ██╗          ██████╗ ██╗   ██╗███████╗██████╗ ██╗      █████╗ ██╗   ██╗
 ██║██╔══██╗██║         ██╔═══██╗██║   ██║██╔════╝██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
 ██║██████╔╝██║         ██║   ██║██║   ██║█████╗  ██████╔╝██║     ███████║ ╚████╔╝ 
 ██║██╔══██╗██║         ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██╔══██║  ╚██╔╝  
 ██║██║  ██║███████╗    ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║███████╗██║  ██║   ██║   
 ╚═╝╚═╝  ╚═╝╚══════╝     ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   
    `)
    );

    console.log(chalk.yellow("📍 IRL Pro Location Overlay - CLI Version 1.6.0"));
    console.log(chalk.gray("Live Streaming için Gelişmiş Konum Overlay'i\n"));
  }
}

module.exports = MenuManager;
