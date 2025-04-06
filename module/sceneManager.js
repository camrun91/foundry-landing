// Scene management functions
export async function createLandingScene(templateData) {
  console.log("Foundry Landing Page | Creating new landing page scene");

  const sceneData = {
    name: "Landing Page",
    active: false,
    padding: 0,
    ...templateData,
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
  };

  return await Scene.create(sceneData);
}

export async function deactivateAllScenes() {
  for (const scene of game.scenes) {
    if (scene.active) {
      await scene.update({ active: false }, { render: false });
    }
  }
}

export async function activateScene(scene) {
  await scene.update({ active: true }, { render: true });
}

export function findLandingScene() {
  return game.scenes.find((scene) => scene.name === "Landing Page");
}
