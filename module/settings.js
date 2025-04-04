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

  // LLM Provider Settings
  game.settings.register("foundry-landing", "llmProvider", {
    name: "AI Provider",
    hint: "Choose which AI service to use for generating recaps",
    scope: "world",
    config: true,
    type: String,
    choices: {
      openai: "OpenAI (GPT-3.5/4)",
      huggingface: "Hugging Face (Free)",
      ollama: "Ollama (Local)",
    },
    default: "huggingface",
  });

  // OpenAI Settings
  game.settings.register("foundry-landing", "openaiApiKey", {
    name: "OpenAI API Key",
    hint: "Your OpenAI API key (if using OpenAI)",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register("foundry-landing", "openaiModel", {
    name: "OpenAI Model",
    hint: "The OpenAI model to use",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "gpt-4": "GPT-4 (Most capable)",
      "gpt-3.5-turbo": "GPT-3.5 (Faster, cheaper)",
    },
    default: "gpt-3.5-turbo",
  });

  // Hugging Face Settings
  game.settings.register("foundry-landing", "hfApiKey", {
    name: "Hugging Face API Key",
    hint: "Your Hugging Face API key (get a free one at huggingface.co)",
    scope: "world",
    config: true,
    type: String,
    default: "",
  });

  game.settings.register("foundry-landing", "hfModel", {
    name: "Hugging Face Model",
    hint: "The model to use for generating recaps",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "meta-llama/Llama-2-7b-chat-hf": "Llama 2 Chat",
      "tiiuae/falcon-7b-instruct": "Falcon Instruct",
      "bigscience/bloomz": "BLOOMZ",
      "google/flan-t5-xxl": "Flan-T5",
    },
    default: "meta-llama/Llama-2-7b-chat-hf",
  });

  // Ollama Settings
  game.settings.register("foundry-landing", "ollamaEndpoint", {
    name: "Ollama Endpoint",
    hint: "Your Ollama endpoint (usually http://localhost:11434)",
    scope: "world",
    config: true,
    type: String,
    default: "http://localhost:11434",
  });

  game.settings.register("foundry-landing", "ollamaModel", {
    name: "Ollama Model",
    hint: "The Ollama model to use",
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

Hooks.on("init", () => {
  registerSettings();
});

Hooks.on("ready", () => {
  // Initialize provider settings visibility
  const provider = game.settings.get("foundry-landing", "llmProvider");
  updateProviderSettings(provider);

  // Add change listener for provider selection
  const providerSelect = document.querySelector("#llmProvider");
  if (providerSelect) {
    providerSelect.addEventListener("change", (event) => {
      updateProviderSettings(event.target.value);
    });
  }
});

function updateProviderSettings(provider) {
  // Hide all provider settings
  document.querySelectorAll(".provider-settings").forEach((el) => {
    el.classList.remove("active");
  });

  // Show selected provider settings
  const selectedSettings = document.querySelector(
    `.provider-settings[data-provider="${provider}"]`
  );
  if (selectedSettings) {
    selectedSettings.classList.add("active");
  }
}
