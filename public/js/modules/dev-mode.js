// === Development Mode Helper ===
// Bu dosya sadece geliştirme sırasında kullanılır

// Development mode detection
window.DevMode = {
  isEnabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  
  // Console logging wrapper
  log: function(message, data = null) {
    if (this.isEnabled) {
      if (data) {
        console.log(`[DEV] ${message}:`, data);
      } else {
        console.log(`[DEV] ${message}`);
      }
    }
  },
  
  // Error logging
  error: function(message, error = null) {
    if (this.isEnabled) {
      if (error) {
        console.error(`[DEV ERROR] ${message}:`, error);
      } else {
        console.error(`[DEV ERROR] ${message}`);
      }
    }
  },
  
  // Performance monitoring
  time: function(label) {
    if (this.isEnabled) {
      console.time(`[DEV TIMER] ${label}`);
    }
  },
  
  timeEnd: function(label) {
    if (this.isEnabled) {
      console.timeEnd(`[DEV TIMER] ${label}`);
    }
  },
  
  // Module loading tracker
  moduleLoaded: function(moduleName) {
    if (this.isEnabled) {
      console.log(`[DEV MODULE] ${moduleName} loaded successfully`);
    }
  },
  
  // API call tracker
  apiCall: function(service, endpoint, cached = false) {
    if (this.isEnabled) {
      const cacheStatus = cached ? '(CACHED)' : '(FRESH)';
      console.log(`[DEV API] ${service} - ${endpoint} ${cacheStatus}`);
    }
  },
  
  // Configuration display
  showConfig: function() {
    if (this.isEnabled && window.AppConfig) {
      console.table({
        'API Keys Configured': {
          LocationIQ: window.AppConfig.locationIqApiKey ? '✅ Set' : '❌ Missing',
          WeatherAPI: window.AppConfig.weatherApiKey ? '✅ Set' : '❌ Missing',
          TimezoneDB: window.AppConfig.timezoneDbApiKey ? '✅ Set' : '❌ Missing'
        },
        Settings: {
          'Speed Threshold': `${window.AppConfig.speedThreshold} km/h`,
          'Update Interval': `${window.AppConfig.updateInterval/1000}s`,
          Language: window.AppConfig.language
        }
      });
    }
  }
};

// Auto-log development mode status
if (window.DevMode.isEnabled) {
  console.log('%c🔧 Development Mode Active', 'color: #00ff00; font-weight: bold;');
}
