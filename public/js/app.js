// === IRL Pro Location Overlay - Main Application ===
// Modular architecture for better maintainability and code organization

// Application main class
class LocationOverlayApp {
  constructor() {
    this.initialized = false;
    this.modules = {};
  }

  // Initialize the application
  async init() {
    try {
      window.Utils.log('Initializing IRL Pro Location Overlay...');

      // Check if all required modules are loaded
      this.checkDependencies();

      // Initialize UI Manager
      window.UIManager.init();

      // Initialize Location Manager
      window.LocationManager.init();

      this.initialized = true;
      window.Utils.log('Application initialized successfully');

    } catch (error) {
      window.Utils.error('Application initialization failed', error);
      this.showFallbackError(error);
    }
  }

  // Check if all required modules are available
  checkDependencies() {
    const requiredModules = [
      'AppConfig',
      'Utils', 
      'ApiServices',
      'UIManager',
      'LocationManager'
    ];

    const missingModules = requiredModules.filter(module => !window[module]);
    
    if (missingModules.length > 0) {
      throw new Error(`Missing required modules: ${missingModules.join(', ')}`);
    }

    window.Utils.log('All dependencies loaded successfully');
  }

  // Show fallback error if initialization fails
  showFallbackError(error) {
    const container = document.getElementById('obsContainer');
    if (container) {
      container.classList.remove('hidden');
      container.innerHTML = `
        <div class="info-item">
          <div class="icon" style="background: rgba(239, 68, 68, 0.3);">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="text">Uygulama başlatılamadı: ${error.message}</div>
        </div>
      `;
    }
  }

  // Clean up resources
  cleanup() {
    if (!this.initialized) return;

    window.Utils.log('Cleaning up application...');
    
    if (window.LocationManager) {
      window.LocationManager.cleanup();
    }
    
    if (window.UIManager) {
      window.UIManager.cleanup();
    }
    
    if (window.ApiServices) {
      window.ApiServices.clearCache();
    }

    this.initialized = false;
    window.Utils.log('Application cleanup completed');
  }

  // Public API for external configuration updates
  updateConfiguration(newConfig) {
    if (window.AppConfig && window.updateConfig) {
      window.updateConfig(newConfig);
      window.Utils.log('Configuration updated from external source');
    } else {
      window.Utils.error('Configuration system not available');
    }
  }

  // Get application status
  getStatus() {
    return {
      initialized: this.initialized,
      currentPosition: window.LocationManager ? window.LocationManager.getCurrentPosition() : null,
      configuration: window.AppConfig || null
    };
  }
}

// Global application instance
window.LocationOverlayApp = new LocationOverlayApp();

// Application startup logic
function startApplication() {
  // Check if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.LocationOverlayApp.init();
    });
  } else {
    // DOM is already ready
    window.LocationOverlayApp.init();
  }
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.LocationOverlayApp) {
    window.LocationOverlayApp.cleanup();
  }
});

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
  window.Utils.error('Uncaught error', event.error);
});

// Start the application
startApplication();

// Export for CLI integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocationOverlayApp;
}
