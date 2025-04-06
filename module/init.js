/**
 * Initialize the Landing Page Scene module
 */

// Define the predefined scenes
const PREDEFINED_SCENES = {
  fantasy_dungeon: {
    name: "Fantasy Dungeon",
    data: {
      background: {
        src: "modules/foundry-landing/assets/images/A_fantasy_adventure-themed_background_image_design_taller.png",
        tint: "#ffffff",
        anchorX: 0,
        anchorY: 0,
        offsetX: 0,
        offsetY: 0,
        fit: "fill",
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        alphaThreshold: 0,
      },
      thumb:
        "modules/foundry-landing/assets/images/A_fantasy_adventure-themed_background_image_design_taller.png",
      environment: {
        globalLight: {
          enabled: true,
          darkness: {
            max: 1,
            min: 0,
          },
          alpha: 0.5,
          bright: false,
          color: null,
          coloration: 1,
          luminosity: 0,
          saturation: 0,
          contrast: 0,
          shadows: 0,
        },
        darknessLevel: 0.65,
        darknessLock: false,
        cycle: true,
        base: {
          hue: 0,
          intensity: 0,
          luminosity: 0,
          saturation: 0,
          shadows: 0,
        },
        dark: {
          hue: 0.7138888888888889,
          intensity: 0,
          luminosity: -0.25,
          saturation: 0,
          shadows: 0,
        },
      },
      lights: [
        {
          _id: "CuNvyxWmFTiiMjt9",
          x: 1062,
          y: 201,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.45,
            angle: 360,
            bright: 12.39,
            color: null,
            coloration: 1,
            dim: 24.77,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "torch",
              speed: 2,
              intensity: 3,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "4MktlGNH2ftONMve",
          x: 1435,
          y: 219,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 31.19,
            color: null,
            coloration: 1,
            dim: 62.37,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: null,
              speed: 5,
              intensity: 5,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "hEB0FVOdEVBEwnoT",
          x: 1718,
          y: 254,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 61.96,
            color: null,
            coloration: 1,
            dim: 123.93,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "torch",
              speed: 2,
              intensity: 7,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "S1hY5QrFI5TSpRDQ",
          x: 3575,
          y: 11,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 22.61,
            color: null,
            coloration: 1,
            dim: 45.22,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "fog",
              speed: 1,
              intensity: 4,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "mN3HHqPJKLS8Oc1s",
          x: 53,
          y: 83,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 27.18,
            color: null,
            coloration: 1,
            dim: 54.37,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "fog",
              speed: 3,
              intensity: 2,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
      ],
    },
  },
  // Add more predefined scenes here in the future
};

// Register module settings
Hooks.on("init", () => {
  console.log("Foundry Landing Page | Initializing module settings");

  // Register scene template selection
  game.settings.register("foundry-landing", "selectedScene", {
    name: "Landing Page Scene Template",
    hint: "Select which predefined scene template to use for the landing page",
    scope: "world",
    config: true,
    type: String,
    choices: Object.fromEntries(
      Object.entries(PREDEFINED_SCENES).map(([key, scene]) => [key, scene.name])
    ),
    default: "fantasy_dungeon",
    onChange: async (value) => {
      console.log("Foundry Landing Page | Scene template changed:", value);
      // Update the existing landing page if it exists
      const landingPageScene = game.scenes?.find(
        (s) => s.name === "Landing Page"
      );
      if (landingPageScene) {
        const selectedTemplate = PREDEFINED_SCENES[value];
        console.log("Foundry Landing Page | Updating scene template");
        await landingPageScene.update(selectedTemplate.data);
      }
    },
  });

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

// Helper functions for managing login state
const LOGIN_STATE_KEY = "foundry_landing_logged_in";

function isFirstLogin() {
  return !localStorage.getItem(LOGIN_STATE_KEY);
}

function setLoggedIn() {
  localStorage.setItem(LOGIN_STATE_KEY, "true");
}

function clearLoginState() {
  console.log("Foundry Landing Page | Clearing login state");
  localStorage.removeItem(LOGIN_STATE_KEY);
}

/**
 * Create the landing page scene when the game is ready
 */
Hooks.once("ready", async () => {
  console.log("Foundry Landing Page | Checking for landing page scene");

  // Check if this is first login for the user
  const firstLogin = isFirstLogin();
  console.log("Foundry Landing Page | First login:", firstLogin);

  // Check if the landing page scene exists
  const landingPageScene = game.scenes.find(
    (scene) => scene.name === "Landing Page"
  );

  if (!landingPageScene) {
    // Only GMs can create the scene
    if (!game.user.isGM) {
      console.log("Foundry Landing Page | Non-GM user cannot create scene");
      return;
    }

    console.log("Foundry Landing Page | Creating new landing page scene");

    // Get the selected scene template
    const selectedSceneKey = game.settings.get(
      "foundry-landing",
      "selectedScene"
    );
    const selectedTemplate = PREDEFINED_SCENES[selectedSceneKey];
    console.log("Foundry Landing Page | Using template:", selectedSceneKey);

    // Create the landing page scene with the selected template
    const sceneData = {
      name: "Landing Page",
      active: false,
      padding: 0,
      ...selectedTemplate.data,
      foreground: null,
      foregroundElevation: 4,
      tokenVision: false,
      backgroundColor: "#000000",
      grid: {
        type: 0,
        size: 100,
        style: "solidLines",
        thickness: 1,
        color: "#000000",
        alpha: 0.2,
        distance: 5,
        units: "",
      },
      initial: {
        x: 1811,
        y: 1143,
        scale: 0.3333333333333333,
      },
      width: 3584,
      height: 2304,
      fog: {
        exploration: true,
        overlay: null,
        colors: {
          explored: null,
          unexplored: null,
        },
      },
      flags: {
        "foundry-landing": {
          isResponsive: true,
          originalWidth: 3584,
          originalHeight: 2304,
        },
        pf2e: {
          rulesBasedVision: null,
          hearingRange: null,
          environmentTypes: [],
        },
      },
      _id: "Cc0y7DvM0cfXgJ9a",
      navigation: true,
      navOrder: 0,
      navName: "",
      drawings: [],
      tokens: [],
      lights: [
        {
          _id: "CuNvyxWmFTiiMjt9",
          x: 1062,
          y: 201,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.45,
            angle: 360,
            bright: 12.39,
            color: null,
            coloration: 1,
            dim: 24.77,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "torch",
              speed: 2,
              intensity: 3,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "4MktlGNH2ftONMve",
          x: 1435,
          y: 219,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 31.19,
            color: null,
            coloration: 1,
            dim: 62.37,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: null,
              speed: 5,
              intensity: 5,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "hEB0FVOdEVBEwnoT",
          x: 1718,
          y: 254,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 61.96,
            color: null,
            coloration: 1,
            dim: 123.93,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "torch",
              speed: 2,
              intensity: 7,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "S1hY5QrFI5TSpRDQ",
          x: 3575,
          y: 11,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 22.61,
            color: null,
            coloration: 1,
            dim: 45.22,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "fog",
              speed: 1,
              intensity: 4,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
        {
          _id: "mN3HHqPJKLS8Oc1s",
          x: 53,
          y: 83,
          elevation: 0,
          rotation: 0,
          walls: true,
          vision: false,
          config: {
            negative: false,
            priority: 0,
            alpha: 0.5,
            angle: 360,
            bright: 27.18,
            color: null,
            coloration: 1,
            dim: 54.37,
            attenuation: 0.5,
            luminosity: 0.5,
            saturation: 0,
            contrast: 0,
            shadows: 0,
            animation: {
              type: "fog",
              speed: 3,
              intensity: 2,
              reverse: false,
            },
            darkness: {
              min: 0,
              max: 1,
            },
          },
          hidden: false,
          flags: {},
        },
      ],
      notes: [],
      sounds: [],
      regions: [],
      templates: [],
      tiles: [],
      walls: [],
      playlist: null,
      playlistSound: null,
      journal: null,
      journalEntryPage: null,
      weather: "",
      folder: null,
      sort: 0,
      ownership: {
        default: 0,
        EwavU248h4urXbbL: 3,
      },
      _stats: {
        compendiumSource: null,
        duplicateSource: null,
        coreVersion: "12.331",
        systemId: "pf2e",
        systemVersion: "6.11.1",
        createdTime: 1743887276795,
        modifiedTime: 1743887780527,
        lastModifiedBy: "EwavU248h4urXbbL",
      },
    };

    try {
      // Only deactivate other scenes if this is first login and user is GM
      if (firstLogin && game.user.isGM) {
        // Deactivate any currently active scenes
        for (const scene of game.scenes) {
          if (scene.active) {
            await scene.update({ active: false }, { render: false });
          }
        }
      }

      // Create the scene with a unique ID to prevent duplicates
      const scene = await Scene.create(sceneData);
      console.log("Foundry Landing Page | Scene created successfully:", scene);

      // Set the login flag for this user
      if (firstLogin) {
        setLoggedIn();
      }

      // If this is first login and user is GM, activate the scene
      if (firstLogin && game.user.isGM) {
        await scene.update({ active: true }, { render: true });
      }

      if (game.user.isGM) {
        console.log("Foundry Landing Page | Scene creation complete");
      }
    } catch (error) {
      console.error("Foundry Landing Page | Error creating scene:", error);
    }
  } else {
    console.log("Foundry Landing Page | Landing page scene already exists");

    // If scene exists and this is first login
    if (firstLogin) {
      // Set the login flag for this user
      setLoggedIn();

      // Only GM can activate scenes
      if (game.user.isGM) {
        try {
          // Deactivate any currently active scenes
          for (const scene of game.scenes) {
            if (scene.active) {
              await scene.update({ active: false }, { render: false });
            }
          }
          // Activate the landing page scene
          await landingPageScene.update({ active: true }, { render: true });
        } catch (error) {
          console.error(
            "Foundry Landing Page | Error activating scene:",
            error
          );
        }
      }
    }
  }
});

// Reset the login flag when the logout dialog appears
Hooks.on("renderApplication", (app, html, data) => {
  if (app.options.id === "logOut") {
    try {
      console.log(
        "Foundry Landing Page | Detected logout dialog, resetting login flag"
      );
      clearLoginState();
    } catch (error) {
      console.error(
        "Foundry Landing Page | Error resetting login flag:",
        error
      );
    }
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
    callback: async () => {
      const landingPageScene = game.scenes.find(
        (scene) => scene.name === "Landing Page"
      );
      if (landingPageScene) {
        try {
          // Deactivate any currently active scenes
          for (const scene of game.scenes) {
            if (scene.active) {
              await scene.update({ active: false }, { render: false });
            }
          }
          // Now activate the landing page scene
          await landingPageScene.update({ active: true }, { render: true });
        } catch (error) {
          console.error("Foundry Landing Page | Error updating scene:", error);
        }
      }
    },
  });
});

Hooks.on("canvasTearDown", (canvas) => {
  // Your code to execute on logout
  console.log("Canvas is tearing down, user likely logged out.");
  // Example: Save some data
  // game.settings.set("your-module", "someSetting", "someValue");
});
