import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

let landingPage;

Hooks.once("init", async function () {
  console.log("Foundry Landing Page | Initializing");
  registerSettings();
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

Hooks.once("information", async function () {
  console.log("Foundry Landing Page | Ready");

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
  landingPage = new LandingPageApplication();
});
