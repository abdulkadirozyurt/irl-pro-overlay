// === UI Manager Module ===
// Manages all UI updates and visual elements

window.UIManager = {
  // DOM element references
  elements: {
    obsContainer: null,
    location: null,
    weatherIcon: null,
    weather: null,
    time: null,
    speedContainer: null,
    speedText: null
  },

  // Time update interval
  timeUpdateInterval: null,

  // Initialize UI elements
  init: function() {
    this.elements.obsContainer = window.Utils.getElement("obsContainer");
    this.elements.location = window.Utils.getElement("location");
    this.elements.weatherIcon = window.Utils.getElement("weatherIcon");
    this.elements.weather = window.Utils.getElement("weather");
    this.elements.time = window.Utils.getElement("time");
    this.elements.speedContainer = window.Utils.getElement("speedContainer");
    this.elements.speedText = window.Utils.getElement("speedText");

    window.Utils.log('UI Manager initialized');
  },

  // Show the main overlay container
  showOverlay: function() {
    if (this.elements.obsContainer) {
      this.elements.obsContainer.classList.remove("hidden");
    }
  },

  // Update location display
  updateLocation: function(locationText) {
    window.Utils.setText("location", locationText);
  },

  // Update weather display
  updateWeather: function(weatherData) {
    if (!weatherData) return;
    
    window.Utils.setHTML(
      "weatherIcon", 
      `<img src="https:${weatherData.weatherIcon}" alt="Hava durumu">`
    );
    
    window.Utils.setHTML(
      "weather",
      `<span class="temp-primary">${Math.round(weatherData.temp_C)}°C</span><span class="temp-secondary">${Math.round(weatherData.temp_F)}°F</span>`
    );
  },

  // Update time display with automatic refresh
  updateTime: function(timezone) {
    // Clear existing interval
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }

    const updateTimeDisplay = () => {
      const now = new Date();
      const timeString = window.Utils.formatTime(now, timezone, window.AppConfig.timeFormat);
      window.Utils.setText("time", timeString);
    };

    // Update immediately and then every 10 seconds
    updateTimeDisplay();
    this.timeUpdateInterval = setInterval(updateTimeDisplay, 10000);
    
    window.Utils.log(`Time display updated for timezone: ${timezone}`);
  },

  // Update speed display
  updateSpeed: function(speedMps) {
    const speedKmh = window.Utils.convertSpeed.mpsToKmh(speedMps);
    
    window.Utils.setHTML(
      "speedText", 
      `<span class="speed-badge">${speedKmh} km/h</span>`
    );

    // Show/hide speed container based on threshold
    if (speedKmh > window.AppConfig.speedThreshold) {
      window.Utils.showElement("speedContainer");
    } else {
      window.Utils.hideElement("speedContainer");
    }
  },

  // Display error message
  showError: function(message) {
    window.Utils.setText("location", message);
    this.showOverlay();
  },

  // Display loading state
  showLoading: function(element = "location") {
    window.Utils.setText(element, "Yükleniyor...");
  },

  // Clean up intervals
  cleanup: function() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    window.Utils.log('UI Manager cleaned up');
  }
};
