// === Configuration Module ===
// Handles settings loading, saving, and management

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Settings file path - production vs development
const isProduction = typeof process.pkg !== "undefined";
const basePath = isProduction ? path.dirname(process.execPath) : path.dirname(path.dirname(__dirname));
const settingsPath = path.join(basePath, "settings.json");

// Default settings - Empty values to force user input
const defaultSettings = {
  locationIqApiKey: "",
  timezoneDbApiKey: "",
  weatherApiKey: "",
  speedThreshold: 3,
  updateInterval: 5, // seconds
  port: 3000,
  subdomain: "",
  autoStart: false,
  language: "tr",
};

class ConfigManager {
  constructor() {
    this.basePath = basePath;
    this.settingsPath = settingsPath;
    this.defaultSettings = defaultSettings;
  }

  // Load settings from file
  loadSettings() {
    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, "utf8");
        return { ...this.defaultSettings, ...JSON.parse(data) };
      }
    } catch (error) {
      console.log(chalk.red("⚠️  Settings yüklenirken hata:", error.message));
    }
    return this.defaultSettings;
  }

  // Save settings to file
  saveSettings(settings) {
    try {
      fs.writeFileSync(this.settingsPath, JSON.stringify(settings, null, 2));
      return true;
    } catch (error) {
      console.log(chalk.red("⚠️  Settings kaydedilirken hata:", error.message));
      return false;
    }
  }

  // Update overlay HTML with current settings
  updateOverlayWithSettings(settings) {
    const configPath = path.join(this.basePath, "public", "js", "modules", "config.js");

    try {
      // Read the config.js file
      let configContent = fs.readFileSync(configPath, "utf8");

      // Create the configuration object to inject
      const configObject = {
        locationIqApiKey: settings.locationIqApiKey,
        timezoneDbApiKey: settings.timezoneDbApiKey,
        weatherApiKey: settings.weatherApiKey,
        speedThreshold: settings.speedThreshold,
        updateInterval: settings.updateInterval * 1000, // Convert to milliseconds
        language: settings.language || "tr",
        timeFormat: "24h"
      };

      // Replace the entire config object in the file
      const configString = JSON.stringify(configObject, null, 2);
      
      // Find and replace the AppConfig object
      configContent = configContent.replace(
        /window\.AppConfig\s*=\s*{[\s\S]*?};/,
        `window.AppConfig = ${configString.split('\n').map((line, index) => 
          index === 0 ? line : '  ' + line
        ).join('\n')};

// Function to update configuration from CLI
window.updateConfig = function(newConfig) {
  Object.assign(window.AppConfig, newConfig);
  console.log('Configuration updated:', window.AppConfig);
};`
      );

      fs.writeFileSync(configPath, configContent);
      console.log(chalk.green("✅ Overlay configuration güncellendi"));
    } catch (error) {
      console.log(chalk.red("⚠️  Overlay configuration güncellenirken hata:", error.message));
    }
  }

  // Check if this is first time setup
  isFirstTimeSetup() {
    const settings = this.loadSettings();
    // Check if critical API keys are missing
    return !settings.locationIqApiKey || !settings.weatherApiKey || !settings.timezoneDbApiKey;
  }

  // Get base paths
  getBasePath() {
    return this.basePath;
  }

  getSettingsPath() {
    return this.settingsPath;
  }

  isProduction() {
    return isProduction;
  }
}

module.exports = ConfigManager;
