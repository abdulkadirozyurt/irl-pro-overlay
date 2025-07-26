// === Utility Functions Module ===
// Common helper functions for DOM manipulation and calculations

window.Utils = {
  // DOM manipulation helpers
  setText: function(id, text) {
    const element = document.getElementById(id);
    if (element) element.innerText = text;
  },

  setHTML: function(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
  },

  showElement: function(id) {
    const element = document.getElementById(id);
    if (element) element.classList.add("show");
  },

  hideElement: function(id) {
    const element = document.getElementById(id);
    if (element) element.classList.remove("show");
  },

  getElement: function(id) {
    return document.getElementById(id);
  },

  // Calculate distance between two coordinates in kilometers
  calculateDistance: function(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Time formatting helpers
  formatTime: function(date, timezone, format = '24h') {
    const options = { 
      timeZone: timezone, 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: format === '12h' 
    };
    return date.toLocaleTimeString("tr-TR", options);
  },

  // Speed conversion helpers
  convertSpeed: {
    mpsToKmh: function(speedMps) {
      return speedMps ? (speedMps * 3.6).toFixed(0) : 0;
    },
    
    mpsToMph: function(speedMps) {
      return speedMps ? (speedMps * 2.237).toFixed(0) : 0;
    }
  },

  // Logging helpers
  log: function(message, data = null) {
    if (window.DevMode && window.DevMode.isEnabled) {
      window.DevMode.log(message, data);
    } else {
      if (data) {
        console.log(`[App] ${message}:`, data);
      } else {
        console.log(`[App] ${message}`);
      }
    }
  },

  error: function(message, error = null) {
    if (window.DevMode && window.DevMode.isEnabled) {
      window.DevMode.error(message, error);
    } else {
      if (error) {
        console.error(`[App Error] ${message}:`, error);
      } else {
        console.error(`[App Error] ${message}`);
      }
    }
  }
};

// Module loaded notification
if (window.DevMode) {
  window.DevMode.moduleLoaded('Utils');
}
