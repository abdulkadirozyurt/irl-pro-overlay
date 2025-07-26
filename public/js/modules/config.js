// === Configuration Module ===
// Manages application settings and API configuration

// Default configuration - will be updated by CLI
window.AppConfig = {
    "locationIqApiKey": "",
    "timezoneDbApiKey": "",
    "weatherApiKey": "",
    "speedThreshold": 5,
    "updateInterval": 6000,
    "language": "tr",
    "timeFormat": "24h"
  };

// Function to update configuration from CLI
window.updateConfig = function(newConfig) {
  Object.assign(window.AppConfig, newConfig);
  console.log('Configuration updated:', window.AppConfig);
};

// API Rate Limiting Configuration
window.AppConfig.rateLimits = {
  locationiq: {
    minDistance: 2, // km - Update location name only after moving 2km
    minTime: 60000, // 1 minute - Don't call API more than once per minute
  },
  weather: {
    minDistance: 5, // km - Update weather only after moving 5km  
    minTime: 300000, // 5 minutes - Weather doesn't change that frequently
  },
  timezone: {
    minDistance: 50, // km - Timezone changes are rare
    minTime: 3600000, // 1 hour - Very conservative timezone updates
  }
};

// Geolocation Settings
window.AppConfig.geolocation = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};
