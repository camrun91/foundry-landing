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

  // Local LLM settings
  game.settings.register("foundry-landing", "localLlmEndpoint", {
    name: "Local LLM Endpoint",
    hint: "The endpoint URL for Ollama (usually http://localhost:11434)",
    scope: "world",
    config: true,
    type: String,
    default: "http://localhost:11434",
  });

  game.settings.register("foundry-landing", "localLlmModel", {
    name: "Local LLM Model",
    hint: "The Ollama model to use (e.g., mistral, llama2, etc.)",
    scope: "world",
    config: true,
    type: String,
    choices: {
      mistral: "Mistral (Recommended)",
      llama2: "Llama 2",
      codellama: "Code Llama",
      "neural-chat": "Neural Chat",
      "starling-lm": "Starling",
    },
    default: "mistral",
  });
}
