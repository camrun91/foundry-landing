import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

let landingPage;

Hooks.on("init", function () {
  console.log("Foundry Landing Page | Initializing module");
  registerSettings();
});

Hooks.on("ready", function () {
  console.log("Foundry Landing Page | Module Ready");

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

Hooks.on("getSceneControlButtons", function (controls) {
  console.log("Foundry Landing Page | Adding scene control button");
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
          console.log("Foundry Landing Page | Toggle button clicked");
          if (!landingPage) {
            console.log(
              "Foundry Landing Page | Creating new landing page instance"
            );
            landingPage = new LandingPageApplication();
          }
          landingPage.render(true);
        },
      },
    ],
  });
});
