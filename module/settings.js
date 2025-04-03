export function registerSettings() {
  // Register all module settings
  game.settings.register("foundry-landing", "backgroundImage", {
    name: game.i18n.localize("FOUNDRY_LANDING.Settings.BackgroundImage.Name"),
    hint: game.i18n.localize("FOUNDRY_LANDING.Settings.BackgroundImage.Hint"),
    scope: "world",
    config: true,
    type: String,
    default: "",
    filePicker: "image",
  });

  game.settings.register("foundry-landing", "showNpcHistory", {
    name: game.i18n.localize("FOUNDRY_LANDING.Settings.ShowNpcHistory.Name"),
    hint: game.i18n.localize("FOUNDRY_LANDING.Settings.ShowNpcHistory.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register("foundry-landing", "showPlayerInfo", {
    name: game.i18n.localize("FOUNDRY_LANDING.Settings.ShowPlayerInfo.Name"),
    hint: game.i18n.localize("FOUNDRY_LANDING.Settings.ShowPlayerInfo.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
}
