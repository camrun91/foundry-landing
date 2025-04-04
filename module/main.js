import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function () {
  console.log(
    "Hello World! This code runs once the Foundry VTT software begins its initialization workflow."
  );
  registerSettings();
});

Hooks.on("ready", function () {
  console.log(
    "Hello World! This code runs once core initialization is ready and game data is available."
  );

  // Create menu item in module settings
  game.settings.registerMenu("foundry-landing", "landingPageMenu", {
    name: "Landing Page Settings",
    label: "Open Landing Page Settings",
    hint: "Configure landing page background and display options",
    icon: "fas fa-cog",
    type: LandingPageApplication,
    restricted: true,
  });

  // Create initial landing page instance
  console.log("Foundry Landing Page | Creating initial landing page instance");
  landingPage = new LandingPageApplication();
  landingPage.render(true);
});
