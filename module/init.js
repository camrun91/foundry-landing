/**
 * Initialize the Landing Page Scene module
 */

import { isFirstLogin, setLoggedIn, clearLoginState } from "./loginState.js";
import { PREDEFINED_SCENES } from "./sceneTemplates.js";
import {
  createLandingScene,
  deactivateAllScenes,
  activateScene,
  findLandingScene,
} from "./sceneManager.js";

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
      const landingPageScene = findLandingScene();
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
      const landingPageScene = findLandingScene();
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

  // Check if this is first login for the user
  const firstLogin = isFirstLogin();
  console.log("Foundry Landing Page | First login:", firstLogin);

  // Check if the landing page scene exists
  const landingPageScene = findLandingScene();

  if (!landingPageScene) {
    // Only GMs can create the scene
    if (!game.user.isGM) {
      console.log("Foundry Landing Page | Non-GM user cannot create scene");
      return;
    }

    // Get the selected scene template
    const selectedSceneKey = game.settings.get(
      "foundry-landing",
      "selectedScene"
    );
    const selectedTemplate = PREDEFINED_SCENES[selectedSceneKey];
    console.log("Foundry Landing Page | Using template:", selectedSceneKey);

    try {
      // Only deactivate other scenes if this is first login and user is GM
      if (firstLogin && game.user.isGM) {
        await deactivateAllScenes();
      }

      // Create the scene with the selected template
      const scene = await createLandingScene(selectedTemplate.data);
      console.log("Foundry Landing Page | Scene created successfully:", scene);

      // Set the login flag for this user
      if (firstLogin) {
        setLoggedIn();
      }

      // If this is first login and user is GM, activate the scene
      if (firstLogin && game.user.isGM) {
        await activateScene(scene);
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

      if (game.user.isGM) {
        try {
          await deactivateAllScenes();
          await activateScene(landingPageScene);
        } catch (error) {
          console.error(
            "Foundry Landing Page | Error activating scene:",
            error
          );
        }
      } else {
        // For non-GM users, just view the landing page scene
        try {
          console.log(
            "Foundry Landing Page | Non-GM user viewing landing page"
          );
          await landingPageScene.view();
        } catch (error) {
          console.error("Foundry Landing Page | Error viewing scene:", error);
        }
      }
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
      const landingPageScene = findLandingScene();
      if (landingPageScene) {
        try {
          // Deactivate any currently active scenes
          for (const scene of game.scenes) {
            if (scene.active) {
              await scene.update({ active: false }, { render: false });
            }
          }
          // Now activate the landing page scene
          await activateScene(landingPageScene);
        } catch (error) {
          console.error("Foundry Landing Page | Error updating scene:", error);
        }
      }
    },
  });
});
