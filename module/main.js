import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";
import { LandingPageSettings } from "./apps/landing-page-settings.js";

let landingPage;
window.landingPage = null; // Make it accessible globally for the settings form

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", () => {
  console.log("Foundry Landing Page | Initializing module");
  registerSettings();
});

Hooks.on("ready", () => {
  console.log("Foundry Landing Page | Module Ready");

  // Register the landing page configuration menu
  game.settings.registerMenu("foundry-landing", "landingPageConfig", {
    name: "Configure Landing Page",
    label: "Configure Landing Page",
    hint: "Configure the landing page settings including background image and display options.",
    icon: "fas fa-cog",
    type: LandingPageSettings,
    restricted: true,
  });

  // Create initial landing page instance
  landingPage = new LandingPageApplication();
  window.landingPage = landingPage;

  // Show landing page if game is paused
  if (game.paused) {
    landingPage.render(true);
  }
});

// Watch for pause/unpause
Hooks.on("pauseGame", (isPaused) => {
  if (!landingPage) {
    landingPage = new LandingPageApplication();
    window.landingPage = landingPage;
  }

  if (isPaused) {
    // Game was paused, show landing page
    landingPage.render(true);
    // Fade out the canvas
    $("#board").css("opacity", "0.1");
  } else {
    // Game was unpaused, hide landing page
    landingPage.close();
    // Restore canvas opacity
    $("#board").css("opacity", "1");
  }
});

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "landing-page",
    title: "Landing Page Controls",
    icon: "fas fa-home",
    layer: "controls",
    tools: [
      {
        name: "toggle",
        title: "Toggle Landing Page",
        icon: "fas fa-scroll",
        button: true,
        visible: true,
        onClick: () => {
          if (!landingPage) {
            landingPage = new LandingPageApplication();
            window.landingPage = landingPage;
          }
          landingPage.render(true);
          $("#board").css("opacity", "0.1");
        },
      },
    ],
  });
});
