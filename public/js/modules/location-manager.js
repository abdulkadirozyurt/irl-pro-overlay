// === Location Manager Module ===
// Handles geolocation tracking and position updates

window.LocationManager = {
  // State variables
  watchId: null,
  lastKnownPosition: null,
  timezoneResolved: false,
  currentTimezone: null,

  // Initialize geolocation tracking
  init: function() {
    window.Utils.log('Initializing Location Manager');
    this.startTracking();
  },

  // Start watching position
  startTracking: function() {
    if (!navigator.geolocation) {
      window.UIManager.showError("Geolocation desteklenmiyor.");
      return;
    }

    const options = window.AppConfig.geolocation;
    
    this.watchId = navigator.geolocation.watchPosition(
      this.handlePositionUpdate.bind(this),
      this.handlePositionError.bind(this),
      options
    );

    window.Utils.log('Geolocation tracking started');
  },

  // Stop watching position
  stopTracking: function() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      window.Utils.log('Geolocation tracking stopped');
    }
  },

  // Handle successful position update
  handlePositionUpdate: function(position) {
    window.UIManager.showOverlay();
    
    const { latitude, longitude, speed } = position.coords;
    
    window.Utils.log('Position update received', {
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
      speed: speed ? speed.toFixed(2) : 'null'
    });

    // Always update speed (fast, local data)
    window.UIManager.updateSpeed(speed);

    // Check if we need to update slow data (API calls)
    const shouldUpdateSlowData = this.shouldUpdateSlowData(latitude, longitude);

    if (shouldUpdateSlowData) {
      window.Utils.log('Updating location-based data...');
      this.updateLocationData(latitude, longitude);
    }
  },

  // Handle geolocation errors
  handlePositionError: function(error) {
    window.UIManager.showOverlay();
    
    let message = "Konum alınamadı.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Konum izni reddedildi.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Konum bilgisi mevcut değil.";
        break;
      case error.TIMEOUT:
        message = "Konum alma zaman aşımına uğradı.";
        break;
    }
    
    window.UIManager.showError(message);
    window.Utils.error("Geolocation Error", error);
  },

  // Determine if slow data (API calls) should be updated
  shouldUpdateSlowData: function(latitude, longitude) {
    if (!this.lastKnownPosition) {
      return true; // First position update
    }

    const distance = window.Utils.calculateDistance(
      this.lastKnownPosition.latitude,
      this.lastKnownPosition.longitude,
      latitude,
      longitude
    );

    // Update if moved more than 2km (minimum for any API call)
    return distance > 2;
  },

  // Update all location-based data
  updateLocationData: async function(latitude, longitude) {
    // Store current position
    this.lastKnownPosition = { latitude, longitude };

    // Update location name
    try {
      const address = await window.ApiServices.fetchAddress(latitude, longitude);
      window.UIManager.updateLocation(address);
    } catch (error) {
      window.Utils.error('Failed to update location name', error);
    }

    // Update weather data
    try {
      const weather = await window.ApiServices.fetchWeather(latitude, longitude);
      window.UIManager.updateWeather(weather);
    } catch (error) {
      window.Utils.error('Failed to update weather', error);
    }

    // Update timezone (only once or when moved significantly)
    if (!this.timezoneResolved) {
      try {
        window.Utils.log('Resolving timezone for the first time...');
        const timezone = await window.ApiServices.getTimeZone(latitude, longitude);
        
        if (timezone && timezone !== "Etc/UTC") {
          window.Utils.log(`Timezone resolved: ${timezone}`);
          this.currentTimezone = timezone;
          this.timezoneResolved = true;
          window.UIManager.updateTime(timezone);
        }
      } catch (error) {
        window.Utils.error('Failed to resolve timezone', error);
      }
    }
  },

  // Reset timezone resolution (useful for testing)
  resetTimezone: function() {
    this.timezoneResolved = false;
    this.currentTimezone = null;
    window.Utils.log('Timezone resolution reset');
  },

  // Get current position data
  getCurrentPosition: function() {
    return this.lastKnownPosition;
  },

  // Clean up resources
  cleanup: function() {
    this.stopTracking();
    this.lastKnownPosition = null;
    this.timezoneResolved = false;
    this.currentTimezone = null;
    window.Utils.log('Location Manager cleaned up');
  }
};
