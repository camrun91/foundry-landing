import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

Hooks.once("init", async function () {
  console.log("Foundry Landing Page | Initializing");
  registerSettings();
});

Hooks.once("ready", async function () {
  console.log("Foundry Landing Page | Ready");

  // Create the landing page application
  const landingPage = new LandingPageApplication();
  landingPage.render(true);

  // Add button to the sidebar
  game.settings.register("foundry-landing", "showSidebarButton", {
    name: "Show Sidebar Button",
    hint: "Show a button in the sidebar to access the landing page",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  if (game.settings.get("foundry-landing", "showSidebarButton")) {
    // Add button to the sidebar
    game.settings.registerMenu("foundry-landing", "landingPageMenu", {
      name: "Landing Page Settings",
      label: "Landing Page",
      hint: "Configure the landing page settings",
      icon: "fas fa-home",
      type: LandingPageApplication,
      restricted: true,
    });
  }
});
