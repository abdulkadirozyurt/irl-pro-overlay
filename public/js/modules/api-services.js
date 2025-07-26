// === API Services Module ===
// Handles all external API calls for location, weather, and timezone data

window.ApiServices = {
  // Cache for API responses to minimize requests
  cache: {
    location: { data: null, timestamp: 0, coords: null },
    weather: { data: null, timestamp: 0, coords: null },
    timezone: { data: null, timestamp: 0, coords: null }
  },

  // Check if cached data is still valid
  isCacheValid: function(cacheKey, latitude, longitude) {
    const cached = this.cache[cacheKey];
    if (!cached.data || !cached.coords) return false;

    const now = Date.now();
    const config = window.AppConfig.rateLimits[cacheKey === 'location' ? 'locationiq' : cacheKey];
    
    // Check time validity
    if (now - cached.timestamp < config.minTime) {
      return true;
    }

    // Check distance validity
    const distance = window.Utils.calculateDistance(
      cached.coords.latitude,
      cached.coords.longitude,
      latitude,
      longitude
    );
    
    return distance < config.minDistance;
  },

  // Fetch address from coordinates using LocationIQ
  fetchAddress: async function(latitude, longitude) {
    try {
      // Check cache first
      if (this.isCacheValid('location', latitude, longitude)) {
        window.Utils.log('Using cached location data');
        return this.cache.location.data;
      }

      const apiKey = window.AppConfig.locationIqApiKey;
      if (!apiKey) {
        throw new Error('LocationIQ API key not configured');
      }

      window.Utils.log('Fetching fresh location data from LocationIQ API');
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`
      );
      
      if (!response.ok) {
        throw new Error(`LocationIQ API error: ${response.status}`);
      }
      
      const data = await response.json();
      const address = data.address.city || data.address.town || data.address.county || data.address.state || "Bilinmeyen Konum";
      
      // Cache the result
      this.cache.location = {
        data: address,
        timestamp: Date.now(),
        coords: { latitude, longitude }
      };
      
      return address;
    } catch (error) {
      window.Utils.error("Ters geokodlama hatası", error);
      return "Konum Bulunamadı";
    }
  },

  // Get timezone from coordinates using TimezoneDB
  getTimeZone: async function(latitude, longitude) {
    try {
      // Check cache first
      if (this.isCacheValid('timezone', latitude, longitude)) {
        window.Utils.log('Using cached timezone data');
        return this.cache.timezone.data;
      }

      const apiKey = window.AppConfig.timezoneDbApiKey;
      if (!apiKey) {
        throw new Error('TimezoneDB API key not configured');
      }

      window.Utils.log('Fetching fresh timezone data from TimezoneDB API');
      const response = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`
      );
      
      if (!response.ok) {
        throw new Error(`TimezoneDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      const zoneName = data.zoneName || "Etc/UTC";
      
      // Cache the result
      this.cache.timezone = {
        data: zoneName,
        timestamp: Date.now(),
        coords: { latitude, longitude }
      };
      
      return zoneName;
    } catch (error) {
      window.Utils.error("Saat dilimi hatası", error);
      return "Etc/UTC";
    }
  },

  // Fetch weather data using WeatherAPI
  fetchWeather: async function(latitude, longitude) {
    try {
      // Check cache first
      if (this.isCacheValid('weather', latitude, longitude)) {
        window.Utils.log('Using cached weather data');
        return this.cache.weather.data;
      }

      const apiKey = window.AppConfig.weatherApiKey;
      if (!apiKey) {
        throw new Error('WeatherAPI key not configured');
      }

      window.Utils.log('Fetching fresh weather data from WeatherAPI');
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=tr`
      );
      
      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      const weatherData = {
        temp_C: data.current.temp_c,
        temp_F: data.current.temp_f,
        weatherIcon: data.current.condition.icon,
      };
      
      // Cache the result
      this.cache.weather = {
        data: weatherData,
        timestamp: Date.now(),
        coords: { latitude, longitude }
      };
      
      return weatherData;
    } catch (error) {
      window.Utils.error("Hava durumu hatası", error);
      return null;
    }
  },

  // Clear all caches (useful for testing or forced refresh)
  clearCache: function() {
    this.cache = {
      location: { data: null, timestamp: 0, coords: null },
      weather: { data: null, timestamp: 0, coords: null },
      timezone: { data: null, timestamp: 0, coords: null }
    };
    window.Utils.log('API cache cleared');
  }
};
