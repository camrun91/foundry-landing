import { registerSettings } from "./settings.js";
import { LandingPageApplication } from "./apps/landing-page.js";

let landingPage;

console.log("Foundry Landing Page | Starting module load");

try {
  Hooks.on("init", function () {
    console.log("Foundry Landing Page | Initializing module");
    try {
      registerSettings();
      console.log("Foundry Landing Page | Settings registered successfully");
    } catch (error) {
      console.error(
        "Foundry Landing Page | Error registering settings:",
        error
      );
    }
  });

  Hooks.on("ready", function () {
    try {
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
      console.log("Foundry Landing Page | Menu registered");

      // Create initial landing page instance
      console.log(
        "Foundry Landing Page | Creating initial landing page instance"
      );
      landingPage = new LandingPageApplication();
      landingPage.render(true);
      console.log("Foundry Landing Page | Landing page rendered");
    } catch (error) {
      console.error("Foundry Landing Page | Error in ready hook:", error);
    }
  });

  Hooks.on("getSceneControlButtons", function (controls) {
    try {
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
              try {
                if (!landingPage) {
                  console.log(
                    "Foundry Landing Page | Creating new landing page instance"
                  );
                  landingPage = new LandingPageApplication();
                }
                landingPage.render(true);
              } catch (error) {
                console.error(
                  "Foundry Landing Page | Error in button click:",
                  error
                );
              }
            },
          },
        ],
      });
      console.log("Foundry Landing Page | Scene control button added");
    } catch (error) {
      console.error(
        "Foundry Landing Page | Error adding scene control:",
        error
      );
    }
  });
} catch (error) {
  console.error("Foundry Landing Page | Critical error loading module:", error);
}
