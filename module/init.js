/**
 * Initialize the Landing Page Scene module
 */
import { LandingPageScene } from "./scenes/landing-scene.js";

// Register module settings
Hooks.on("init", () => {
  console.log("Foundry Landing Page | Initializing module settings");

  // Register settings
  game.settings.register("foundry-landing", "backgroundImage", {
    name: "Background Image",
    hint: "The background image for the landing page Scene",
    scope: "world",
    config: true,
    type: String,
    default: "",
    onChange: (value) => {
      console.log("Foundry Landing Page | Background image changed:", value);
      // Update the scene if it exists
      const landingPageScene = game.scenes?.find(
        (s) => s.name === "Landing Page"
      );
      if (landingPageScene) {
        console.log("Foundry Landing Page | Updating scene background");
        landingPageScene.update({
          background: { src: value },
        });
      }
    },
  });

  game.settings.register("foundry-landing", "showNpcHistory", {
    name: "Show NPC History",
    hint: "Show NPC history on the landing page Scene",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("foundry-landing", "showPlayerInfo", {
    name: "Show Player Info",
    hint: "Show player information on the landing page Scene",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("foundry-landing", "visibleActors", {
    name: "Visible Actors",
    hint: "List of actor IDs that should be visible on the landing page Scene",
    scope: "world",
    config: true,
    type: Object,
    default: {
      npcs: {},
      players: {},
    },
  });
});

/**
 * Create the landing page scene when the game is ready
 */
Hooks.once("ready", async () => {
  console.log("Foundry Landing Page | Checking for landing page scene");

  // Check if the landing page scene exists
  const landingPageScene = game.scenes.find(
    (scene) => scene.name === "Landing Page"
  );

  if (!landingPageScene) {
    console.log("Foundry Landing Page | Creating new landing page scene");
    // Create the landing page scene
    const backgroundImage = game.settings.get(
      "foundry-landing",
      "backgroundImage"
    );
    const sceneData = {
      name: "Landing Page",
      background: {
        src: backgroundImage || "",
        tint: null,
      },
      foreground: null,
      foregroundElevation: 20,
      tokenVision: false,
      globalLight: true,
      globalLightThreshold: null,
      darkness: 0,
      backgroundColor: "#999999",
      gridType: 0,
      grid: 100,
      gridColor: "#000000",
      gridDistance: 1,
      gridUnits: "ft",
      tokenMirrorX: false,
      tokenMirrorY: false,
      padding: 0.25,
      initial: {
        x: 0,
        y: 0,
        scale: 0.5,
      },
    };

    try {
      const scene = await Scene.create(sceneData);
      console.log("Foundry Landing Page | Scene created successfully:", scene);
    } catch (error) {
      console.error("Foundry Landing Page | Error creating scene:", error);
    }
  } else {
    console.log("Foundry Landing Page | Landing page scene already exists");
  }
});

/**
 * Add a button to the scene navigation to open the landing page
 */
Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
  contextOptions.push({
    name: "Open Landing Page",
    icon: '<i class="fas fa-home"></i>',
    condition: () => game.user.isGM,
    callback: () => {
      const landingPageScene = game.scenes.find(
        (scene) => scene.name === "Landing Page"
      );
      if (landingPageScene) {
        landingPageScene.view();
      }
    },
  });
});

/**
 * Update scene background when setting changes
 */
Hooks.on("updateSetting", (setting, value) => {
  if (setting === "foundry-landing.backgroundImage") {
    const landingPageScene = game.scenes.find(
      (scene) => scene.name === "Landing Page"
    );

    if (landingPageScene) {
      landingPageScene.update({
        background: {
          src: value || "",
          tint: null,
        },
      });
    }
  }
});
