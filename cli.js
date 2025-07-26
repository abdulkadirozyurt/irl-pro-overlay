#!/usr/bin/env node

// === IRL Pro Location Overlay CLI ===
// Main entry point for the CLI application

// Import required modules with error handling
try {
  // Test if required dependencies are available
  require("inquirer");
  require("chalk");
  require("ora");
  require("localtunnel");
} catch (error) {
  console.error("❌ Error loading modules:", error.message);
  console.log("Press any key to exit...");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", () => process.exit(1));
}

// Import main application
const IRLProOverlayApp = require('./src/app');

// Create and start application
async function main() {
  try {
    const app = new IRLProOverlayApp();
    await app.run();
  } catch (error) {
    console.error("💥 Kritik hata:", error);
    process.exit(1);
  }
}

// Export for module usage
module.exports = { 
  main,
  IRLProOverlayApp
};

// Start the application if this file is run directly
if (require.main === module) {
  main();
}
