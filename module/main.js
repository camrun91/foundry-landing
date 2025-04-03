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

Hooks.once("ready", async function () {
  console.log("Foundry Landing Page | Ready");

  // Register the landing page menu in game settings
  game.settings.registerMenu("foundry-landing", "landingPageConfig", {
    name: "Landing Page Configuration",
    label: "Configure Landing Page",
    hint: "Configure the landing page settings including background image and display options.",
    icon: "fas fa-cog",
    type: LandingPageApplication,
    restricted: true,
  });
});
