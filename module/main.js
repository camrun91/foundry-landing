import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

let landingPage;

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

  // Register the landing page configuration menu
  game.settings.registerMenu("foundry-landing", "landingPageConfig", {
    name: "Configure Landing Page",
    label: "Configure Landing Page",
    hint: "Configure the landing page settings including background image and display options.",
    icon: "fas fa-cog",
    type: LandingPageApplication,
    restricted: true,
  });

  // Create initial landing page instance
  console.log("Foundry Landing Page | Creating initial landing page instance");
  landingPage = new LandingPageApplication();
  landingPage.render(true);
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
          }
          landingPage.render(true);
        },
      },
    ],
  });
});
