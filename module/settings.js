export function registerSettings() {
  // Register all module settings
  game.settings.register("foundry-landing", "backgroundImage", {
    name: "Background Image",
    hint: "The URL of the background image to use for the landing page",
    scope: "world",
    config: false,
    type: String,
    default: "",
  });

  game.settings.register("foundry-landing", "showNpcHistory", {
    name: "Show NPC History",
    hint: "Whether to show the NPC history section on the landing page",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
  });

  game.settings.register("foundry-landing", "showPlayerInfo", {
    name: "Show Player Information",
    hint: "Whether to show the player information section on the landing page",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
  });

  // Add setting for visible NPCs
  game.settings.register("foundry-landing", "visibleNpcs", {
    name: "Visible NPCs",
    hint: "List of NPC IDs that should be visible to players",
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register("foundry-landing", "lastRecap", {
    name: "Last Session Recap",
    hint: "The AI-generated recap of the last session",
    scope: "world",
    config: false,
    type: String,
    default: "",
  });

  // Add OpenAI API settings
  game.settings.register("foundry-landing", "openaiApiKey", {
    name: "OpenAI API Key",
    hint: "Your OpenAI API key for generating session recaps",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register("foundry-landing", "openaiModel", {
    name: "OpenAI Model",
    hint: "The OpenAI model to use for generating recaps",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "gpt-4": "GPT-4 (Most capable)",
      "gpt-3.5-turbo": "GPT-3.5 Turbo (Faster, cheaper)",
    },
    default: "gpt-3.5-turbo",
  });
}
