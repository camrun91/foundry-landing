export class LandingPageApplication extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "landing-page",
      title: "Landing Page",
      template: "modules/foundry-landing/templates/landing-page.html",
      width: 960,
      height: "auto",
      minimizable: true,
      resizable: true,
      classes: ["landing-page"],
      popOut: true,
    });
  }

  getData() {
    return {
      backgroundImage: game.settings.get("foundry-landing", "backgroundImage"),
      showNpcHistory: game.settings.get("foundry-landing", "showNpcHistory"),
      showPlayerInfo: game.settings.get("foundry-landing", "showPlayerInfo"),
      npcs: this._getNpcs(),
      players: this._getPlayers(),
      isGM: game.user.isGM,
      isPaused: game.paused,
      recap: game.settings.get("foundry-landing", "lastRecap"),
    };
  }

  _getNpcs() {
    const npcs = game.actors.filter((actor) => actor.type === "npc");
    return npcs.map((npc) => ({
      id: npc.id,
      name: npc.name,
      img: npc.img,
      isVisible: npc.getFlag("foundry-landing", "visible") ?? true,
      position: npc.getFlag("foundry-landing", "position") ?? { x: 0, y: 0 },
    }));
  }

  _getPlayers() {
    return game.actors
      .filter((actor) => actor.type === "character")
      .map((player) => ({
        id: player.id,
        name: player.name,
        img: player.img,
        position: player.getFlag("foundry-landing", "position") ?? {
          x: 0,
          y: 0,
        },
      }));
  }

  activateListeners(html) {
    super.activateListeners(html);

    const cards = html.find(".npc-card, .player-card");

    // Position all cards
    cards.each((i, card) => {
      const $card = $(card);
      const actorId = $card.data("actorId");
      const actor = game.actors.get(actorId);
      const position = actor.getFlag("foundry-landing", "position") ?? {
        x: 0,
        y: 0,
      };

      $card.css({
        position: "absolute",
        left: position.x + "%",
        top: position.y + "%",
      });
    });

    // Add click handlers for NPCs
    html.find(".npc-card").click((ev) => {
      if ($(ev.target).hasClass("drag-handle")) return;
      const npcId = ev.currentTarget.dataset.actorId;
      const npc = game.actors.get(npcId);
      if (npc) npc.sheet.render(true);
    });

    // Add click handlers for Players
    html.find(".player-card").click((ev) => {
      if ($(ev.target).hasClass("drag-handle")) return;
      const playerId = ev.currentTarget.dataset.actorId;
      const player = game.actors.get(playerId);
      if (player) player.sheet.render(true);
    });

    if (game.user.isGM) {
      // Set up drag-drop for GMs
      this._dragDrop = new DragDrop({
        dragSelector: ".npc-card, .player-card",
        dropSelector: ".character-container",
        permissions: { dragstart: () => true, drop: () => true },
        callbacks: {
          dragstart: this._onDragStart.bind(this),
          dragover: this._onDragOver.bind(this),
          drop: this._onDrop.bind(this),
        },
      });
      this._dragDrop.bind(html[0]);

      // Add recap generation handler
      html.find(".generate-recap").click(this._onGenerateRecap.bind(this));
    }
  }

  async _onGenerateRecap(event) {
    const button = event.currentTarget;
    const form = button.closest(".recap-controls");
    const text = form.querySelector("[name='recap-text']").value.trim();
    const file = form.querySelector("[name='recap-file']").files[0];
    const style = form.querySelector("[name='recap-style']").value;

    if (!text && !file) {
      ui.notifications.warn(
        "Please provide either text or a file for the recap."
      );
      return;
    }

    button.classList.add("loading");
    button.querySelector("i").classList.replace("fa-magic", "fa-spinner");

    try {
      let content = text;
      if (file) {
        content = await this._readFileContent(file);
      }

      const recap = await this._generateRecapWithAI(content, style);
      await game.settings.set("foundry-landing", "lastRecap", recap);
      this.render(true);
    } catch (error) {
      ui.notifications.error("Failed to generate recap. Please try again.");
      console.error(error);
    } finally {
      button.classList.remove("loading");
      button.querySelector("i").classList.replace("fa-spinner", "fa-magic");
    }
  }

  async _readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  async _generateRecapWithAI(content, style) {
    const stylePrompts = {
      dragonball:
        "Rewrite the following D&D session recap in the style of the Dragon Ball Z narrator, complete with dramatic tension and cliffhangers. Make it exciting and over-the-top, focusing on the epic moments and character power-ups. Start with 'Last time on [Campaign Name]...' and end with a dramatic question about what will happen next:",
      noir: "Rewrite the following D&D session recap in the style of a hard-boiled film noir detective's case notes. Include atmospheric details, cynical observations, and treat the fantasy elements as mysterious and dangerous. Make it gritty and atmospheric:",
      bard: "Rewrite the following D&D session recap as a medieval bard's tale, complete with flowery language, heroic descriptions, and perhaps even a verse or two. Make it grand and theatrical, as if being performed in a medieval tavern:",
      news: "Rewrite the following D&D session recap as a fantasy newspaper report, complete with headlines, quotes from witnesses, and journalistic style. Include dramatic testimonies and expert opinions from sage wizards or local authorities:",
      letter:
        "Rewrite the following D&D session recap as a personal letter from one of the party members to a friend or family member. Make it personal and reflective, sharing both the events and the character's feelings about them:",
    };

    const prompt = stylePrompts[style];
    if (!prompt) {
      throw new Error(`Unknown style: ${style}`);
    }

    const provider = game.settings.get("foundry-landing", "llmProvider");
    let recap;

    try {
      switch (provider) {
        case "openai":
          recap = await this._generateWithOpenAI(prompt, content);
          break;
        case "huggingface":
          recap = await this._generateWithHuggingFace(prompt, content);
          break;
        case "ollama":
          recap = await this._generateWithOllama(prompt, content);
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      // Format the recap with some basic HTML
      return recap
        .split("\n")
        .map((para) => (para.trim() ? `<p>${para}</p>` : ""))
        .join("");
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  }

  async _generateWithOpenAI(prompt, content) {
    const apiKey = game.settings.get("foundry-landing", "openaiApiKey");
    if (!apiKey) {
      ui.notifications.error(
        "Please configure your OpenAI API key in the module settings."
      );
      throw new Error("OpenAI API key not configured");
    }

    const model = game.settings.get("foundry-landing", "openaiModel");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "system",
                content:
                  "You are a creative writing assistant specializing in transforming D&D session notes into engaging narratives.",
              },
              {
                role: "user",
                content: `${prompt}\n\nSession Notes:\n${content}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API error: ${error.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw new Error(`Failed to generate recap with OpenAI: ${error.message}`);
    }
  }

  async _generateWithHuggingFace(prompt, content) {
    const apiKey = game.settings.get("foundry-landing", "hfApiKey");
    if (!apiKey) {
      ui.notifications.error(
        "Please configure your Hugging Face API key in the module settings."
      );
      throw new Error("Hugging Face API key not configured");
    }

    const model = game.settings.get("foundry-landing", "hfModel");

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs: `You are a creative writing assistant specializing in transforming D&D session notes into engaging narratives.

${prompt}

Session Notes:
${content}

Remember to maintain the specified style throughout the recap and make it engaging for the players.`,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${error}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data[0].generated_text : data.generated_text;
    } catch (error) {
      console.error("Hugging Face Error:", error);
      throw new Error(
        `Failed to generate recap with Hugging Face: ${error.message}`
      );
    }
  }

  async _generateWithOllama(prompt, content) {
    const endpoint = game.settings.get("foundry-landing", "ollamaEndpoint");
    const model = game.settings.get("foundry-landing", "ollamaModel");

    try {
      // First, check if Ollama is running
      try {
        const healthCheck = await fetch(`${endpoint}/api/health`);
        if (!healthCheck.ok) {
          throw new Error("Ollama server is not responding");
        }
      } catch (error) {
        ui.notifications.error(
          "Cannot connect to Ollama. Please make sure it's running."
        );
        throw new Error("Ollama connection failed: " + error.message);
      }

      const response = await fetch(`${endpoint}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          prompt: `You are a creative writing assistant specializing in transforming D&D session notes into engaging narratives.

${prompt}

Session Notes:
${content}

Remember to maintain the specified style throughout the recap and make it engaging for the players.`,
          stream: false,
          options: {
            temperature: 0.7,
            top_k: 50,
            top_p: 0.9,
            repeat_penalty: 1.1,
            max_tokens: 1000,
            stop: ["<end>"],
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${errorText}`);
      }

      const data = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error("Ollama Error:", error);
      throw new Error(`Failed to generate recap with Ollama: ${error.message}`);
    }
  }

  _onDragStart(event) {
    event.currentTarget.classList.add("dragging");
  }

  _onDragOver(event) {
    event.preventDefault();
    const card = event.target.closest(".npc-card, .player-card");
    if (!card) return;

    const container = card.closest(".character-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const x =
      ((event.clientX - containerRect.left) / containerRect.width) * 100;
    const y =
      ((event.clientY - containerRect.top) / containerRect.height) * 100;

    card.style.left = x + "%";
    card.style.top = y + "%";
  }

  async _onDrop(event) {
    event.preventDefault();
    const card = event.target.closest(".npc-card, .player-card");
    if (!card) return;

    card.classList.remove("dragging");
    const container = card.closest(".character-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const x =
      ((cardRect.left - containerRect.left) / containerRect.width) * 100;
    const y = ((cardRect.top - containerRect.top) / containerRect.height) * 100;

    const actorId = card.dataset.actorId;
    const actor = game.actors.get(actorId);
    await actor.setFlag("foundry-landing", "position", { x, y });
  }

  async close(options = {}) {
    if (this._dragDrop) {
      this._dragDrop.destroy();
    }
    $("#board").css("opacity", "1");
    return super.close(options);
  }
}
