// === Setup Wizard Module ===
// Handles first-time setup and configuration

const inquirer = require('inquirer');
const chalk = require('chalk');

class SetupWizard {
  constructor(configManager) {
    this.configManager = configManager;
  }

  // First time setup wizard
  async firstTimeSetup() {
    console.log(chalk.cyan("\n🎉 IRL Pro Location Overlay'e Hoş Geldiniz!"));
    console.log(chalk.yellow("Bu uygulamayı ilk kez çalıştırıyorsunuz. Lütfen gerekli API anahtarlarını girin.\n"));

    console.log(chalk.gray("📝 API Anahtarları hakkında bilgiler:"));
    console.log(chalk.gray("─".repeat(60)));
    console.log(chalk.white("📍 LocationIQ API Key:"));
    console.log(chalk.gray("   • Konum verilerini adres bilgisine çevirmek için kullanılır"));
    console.log(chalk.gray("   • Ücretsiz hesap: https://locationiq.com/register"));
    console.log(chalk.gray("   • Ayda 5,000 ücretsiz request\n"));

    console.log(chalk.white("🌤️  WeatherAPI Key:"));
    console.log(chalk.gray("   • Hava durumu bilgilerini almak için kullanılır"));
    console.log(chalk.gray("   • Ücretsiz hesap: https://weatherapi.com/signup.aspx"));
    console.log(chalk.gray("   • Günde 1,000 ücretsiz request\n"));

    console.log(chalk.white("🕐 TimezoneDB API Key:"));
    console.log(chalk.gray("   • Saat dilimi bilgilerini almak için kullanılır"));
    console.log(chalk.gray("   • Ücretsiz hesap: https://timezonedb.com/register"));
    console.log(chalk.gray("   • Ayda 1,000 ücretsiz request\n"));

    console.log(chalk.white("🌐 Subdomain (İsteğe bağlı):"));
    console.log(chalk.gray("   • Localtunnel için özel alt domain adı"));
    console.log(chalk.gray('   • Örnek: "my-stream-overlay" → my-stream-overlay.loca.lt'));
    console.log(chalk.gray("   • Boş bırakılırsa rastgele bir isim verilir\n"));

    console.log(chalk.gray("─".repeat(60)));

    const settings = await inquirer.prompt([
      {
        type: "input",
        name: "locationIqApiKey",
        message: "📍 LocationIQ API Key girin:",
        validate: (value) => {
          if (!value.trim()) {
            return "LocationIQ API Key zorunludur! https://locationiq.com/register";
          }
          if (value.length < 20) {
            return "Geçersiz API Key formatı. Lütfen doğru anahtarı girin.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "weatherApiKey",
        message: "🌤️  WeatherAPI Key girin:",
        validate: (value) => {
          if (!value.trim()) {
            return "WeatherAPI Key zorunludur! https://weatherapi.com/signup.aspx";
          }
          if (value.length < 20) {
            return "Geçersiz API Key formatı. Lütfen doğru anahtarı girin.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "timezoneDbApiKey",
        message: "🕐 TimezoneDB API Key girin:",
        validate: (value) => {
          if (!value.trim()) {
            return "TimezoneDB API Key zorunludur! https://timezonedb.com/register";
          }
          if (value.length < 10) {
            return "Geçersiz API Key formatı. Lütfen doğru anahtarı girin.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "subdomain",
        message: "🌐 Özel subdomain (boş bırakılabilir):",
        validate: (value) => {
          if (value.trim() && !/^[a-z0-9-]+$/.test(value.trim())) {
            return "Subdomain sadece küçük harf, rakam ve tire içerebilir";
          }
          return true;
        },
      },
      {
        type: "number",
        name: "speedThreshold",
        message: "🚗 Hız sınırı (km/h) - hareket algılama için:",
        default: 3,
        validate: (value) => (value >= 0 && value <= 50 ? true : "Hız sınırı 0-50 km/h arasında olmalıdır"),
      },
      {
        type: "number",
        name: "updateInterval",
        message: "⏱️  Güncelleme aralığı (saniye) - konum verisi ne sıklıkla güncellensin:",
        default: 5,
        validate: (value) => (value >= 1 && value <= 60 ? true : "Güncelleme aralığı 1-60 saniye arasında olmalıdır"),
      },
      {
        type: "number",
        name: "port",
        message: "🔌 Server port numarası:",
        default: 3000,
        validate: (value) => (value >= 1000 && value <= 65535 ? true : "Port 1000-65535 arasında olmalıdır"),
      },
      {
        type: "confirm",
        name: "autoStart",
        message: "🔄 Uygulama başlangıcında servisleri otomatik başlat?",
        default: true,
      },
    ]);

    // Keep language setting
    settings.language = "tr";

    if (this.configManager.saveSettings(settings)) {
      console.log(chalk.green("\n✅ Kurulum tamamlandı! Ayarlarınız kaydedildi."));
      console.log(chalk.yellow("💡 Bu ayarları daha sonra ana menüden değiştirebilirsiniz."));
      return settings;
    } else {
      console.log(chalk.red("\n❌ Ayarlar kaydedilemedi! Lütfen tekrar deneyin."));
      process.exit(1);
    }
  }

  // Check if this is first time setup and run wizard if needed
  async checkAndRunFirstTimeSetup() {
    if (this.configManager.isFirstTimeSetup()) {
      return await this.firstTimeSetup();
    }
    return this.configManager.loadSettings();
  }
}

module.exports = SetupWizard;
