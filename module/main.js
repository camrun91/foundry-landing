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
});
