export function registerSettings() {
  // Register all module settings
  game.settings.register("foundry-landing", "backgroundImage", {
    name: "Background Image",
    hint: "URL or path to the background image",
    scope: "world",
    config: true,
    type: String,
    default: "",
    filePicker: "imagevideo",
  });

  game.settings.register("foundry-landing", "showNpcHistory", {
    name: "Show NPC History",
    hint: "Enable or disable the NPC history section",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("foundry-landing", "showPlayerInfo", {
    name: "Show Player Information",
    hint: "Enable or disable the player information section",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
}
