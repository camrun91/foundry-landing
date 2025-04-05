/**
 * Landing Page Scene
 * A special scene type for the landing page
 */
export class LandingPageScene extends Scene {
  constructor(data, context) {
    super(data, context);
    console.log(
      "Foundry Landing Page | Creating LandingPageScene instance",
      this
    );
  }

  /**
   * Define the default properties for a Landing Page Scene
   * @returns {Object}
   */
  static get defaultProperties() {
    console.log("Foundry Landing Page | Getting default properties");
    const backgroundImage =
      game.settings.get("foundry-landing", "backgroundImage") || "";
    console.log(
      "Foundry Landing Page | Default background image:",
      backgroundImage
    );

    return {
      name: "Landing Page",
      background: {
        src: backgroundImage,
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
      backgroundImage: backgroundImage,
      showNpcHistory:
        game.settings.get("foundry-landing", "showNpcHistory") || true,
      showPlayerInfo:
        game.settings.get("foundry-landing", "showPlayerInfo") || true,
    };
  }

  /**
   * Get the HTML content for the scene
   * @returns {Promise<string>}
   */
  async getSceneContent() {
    console.log("Foundry Landing Page | Getting scene content");
    const npcs = await this._getNpcs();
    const players = await this._getPlayers();
    console.log("Foundry Landing Page | NPCs:", npcs);
    console.log("Foundry Landing Page | Players:", players);

    return `
      <div class="landing-page-content">
        ${
          this.showNpcHistory
            ? `
          <div class="character-container">
            <h2>NPCs</h2>
            <div class="character-grid">
              ${npcs
                .map((npc) =>
                  npc.isVisible
                    ? `
                <div class="npc-card" data-actor-id="${npc.id}">
                  <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
                  <img src="${npc.img}" alt="${npc.name}">
                  <div class="name">${npc.name}</div>
                </div>
              `
                    : ""
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          this.showPlayerInfo
            ? `
          <div class="character-container">
            <h2>Players</h2>
            <div class="character-grid">
              ${players
                .map((player) =>
                  player.isVisible
                    ? `
                <div class="player-card" data-actor-id="${player.id}">
                  <div class="drag-handle"><i class="fas fa-grip-lines"></i></div>
                  <img src="${player.img}" alt="${player.name}">
                  <div class="name">${player.name}</div>
                </div>
              `
                    : ""
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  /**
   * Get NPCs for the scene
   * @returns {Promise<Array>}
   */
  async _getNpcs() {
    console.log("Foundry Landing Page | Getting NPCs");
    // Get visibility settings with proper defaults
    const visibleActors = game.settings.get(
      "foundry-landing",
      "visibleActors"
    ) || { npcs: {}, players: {} };

    // Ensure npcs property exists
    if (!visibleActors.npcs) {
      visibleActors.npcs = {};
    }

    const npcs = game.actors.filter((actor) => actor.type === "npc");
    const mappedNpcs = npcs.map((npc) => ({
      id: npc.id,
      name: npc.name,
      img: npc.img,
      isVisible: visibleActors.npcs[npc.id] === true,
      position: npc.getFlag("foundry-landing", "position") ?? { x: 0, y: 0 },
    }));
    console.log("Foundry Landing Page | Mapped NPCs:", mappedNpcs);
    return mappedNpcs;
  }

  /**
   * Get players for the scene
   * @returns {Promise<Array>}
   */
  async _getPlayers() {
    console.log("Foundry Landing Page | Getting players");
    // Get visibility settings with proper defaults
    const visibleActors = game.settings.get(
      "foundry-landing",
      "visibleActors"
    ) || { npcs: {}, players: {} };

    // Ensure players property exists
    if (!visibleActors.players) {
      visibleActors.players = {};
    }

    const players = game.actors.filter((actor) => actor.type === "character");
    const mappedPlayers = players.map((player) => ({
      id: player.id,
      name: player.name,
      img: player.img,
      isVisible: visibleActors.players[player.id] !== false,
      position: player.getFlag("foundry-landing", "position") ?? {
        x: 0,
        y: 0,
      },
    }));
    console.log("Foundry Landing Page | Mapped players:", mappedPlayers);
    return mappedPlayers;
  }

  /**
   * Override the default scene rendering to include our custom content
   * @param {Object} options
   */
  async _renderScene(options = {}) {
    console.log("Foundry Landing Page | Rendering scene", this);

    try {
      // Try to call the parent class's _renderScene method
      await super._renderScene(options);
      console.log(
        "Foundry Landing Page | Parent _renderScene completed successfully"
      );
    } catch (error) {
      console.error(
        "Foundry Landing Page | Error in parent _renderScene:",
        error
      );
      // If there's an error, try to render the scene manually
      if (!this.element) {
        console.log("Foundry Landing Page | Creating scene element manually");
        this.element = $(`<div id="${this.id}" class="scene"></div>`);
        this.element.appendTo("#board");
      }
    }

    // Add our custom content to the scene
    if (this.rendered) {
      console.log("Foundry Landing Page | Adding custom content to scene");
      const content = await this.getSceneContent();
      const container = this.element.find(".scene-content");
      if (!container.length) {
        console.log("Foundry Landing Page | Creating scene-content container");
        this.element.append('<div class="scene-content"></div>');
      }
      this.element.find(".scene-content").html(content);

      // Add visibility controls if GM
      if (game.user.isGM) {
        console.log("Foundry Landing Page | Adding visibility controls for GM");
        const visibilityControls = new VisibilityControls(this);
        const controlsElement = await visibilityControls.render();
        this.element.find(".scene-content").prepend(controlsElement);
      }

      // Initialize drag and drop if GM
      if (game.user.isGM) {
        console.log("Foundry Landing Page | Initializing drag and drop for GM");
        this._initializeDragDrop();
      }
    }
  }

  /**
   * Initialize drag and drop functionality
   */
  _initializeDragDrop() {
    const html = this.element[0];

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
    this._dragDrop.bind(html);
  }

  /**
   * Handle drag start
   * @param {Event} event
   */
  _onDragStart(event) {
    const card = event.target.closest(".npc-card, .player-card");
    if (!card) return;

    // Store initial positions
    const rect = card.getBoundingClientRect();
    this._dragData = {
      card: card,
      actorId: card.dataset.actorId,
      startX: event.clientX,
      startY: event.clientY,
      cardStartX: rect.left,
      cardStartY: rect.top,
      originalPosition: {
        x: parseFloat(card.style.left) || 0,
        y: parseFloat(card.style.top) || 0,
      },
    };

    // Add dragging class
    card.classList.add("dragging");
  }

  /**
   * Handle drag over
   * @param {Event} event
   */
  _onDragOver(event) {
    if (!this._dragData) return;

    const card = this._dragData.card;
    const container = event.target.closest(".character-container");
    if (!container) return;

    // Calculate movement
    const deltaX = event.clientX - this._dragData.startX;
    const deltaY = event.clientY - this._dragData.startY;

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    // Calculate new position as percentage of container
    const newX =
      this._dragData.originalPosition.x + (deltaX / containerRect.width) * 100;
    const newY =
      this._dragData.originalPosition.y + (deltaY / containerRect.height) * 100;

    // Apply bounds
    const boundedX = Math.max(
      0,
      Math.min(newX, 100 - (cardRect.width / containerRect.width) * 100)
    );
    const boundedY = Math.max(
      0,
      Math.min(newY, 100 - (cardRect.height / containerRect.height) * 100)
    );

    // Update card position
    card.style.left = `${boundedX}%`;
    card.style.top = `${boundedY}%`;
  }

  /**
   * Handle drop
   * @param {Event} event
   */
  async _onDrop(event) {
    if (!this._dragData) return;

    const card = this._dragData.card;
    const actorId = this._dragData.actorId;

    // Remove dragging class
    card.classList.remove("dragging");

    // Get final position
    const finalPosition = {
      x: parseFloat(card.style.left) || 0,
      y: parseFloat(card.style.top) || 0,
    };

    // Save position to actor
    const actor = game.actors.get(actorId);
    if (actor) {
      await actor.setFlag("foundry-landing", "position", finalPosition);
    }

    // Clear drag data
    this._dragData = null;
  }
}

// Create and register the appropriate scene class
Hooks.once("init", () => {
  console.log("Foundry Landing Page | Initializing scene class");

  // For PF2e, we need to wait for the system to be ready
  if (game.system?.id === "pf2e") {
    console.log("Foundry Landing Page | PF2e system detected");

    // Register a hook to run when PF2e is ready
    Hooks.once("pf2e.systemReady", () => {
      console.log(
        "Foundry Landing Page | PF2e system ready, getting scene class"
      );

      // Get the PF2e scene class from the documents module
      const PF2eScene = foundry.documents.BaseScene;
      if (PF2eScene) {
        console.log("Foundry Landing Page | Found PF2e scene class");

        // Create PF2e-specific scene class
        class PF2eLandingPageScene extends PF2eScene {
          constructor(data, context) {
            super(data, context);
            console.log(
              "Foundry Landing Page | Creating PF2e landing page scene instance"
            );

            // Copy properties from LandingPageScene
            Object.getOwnPropertyNames(LandingPageScene.prototype).forEach(
              (name) => {
                if (name !== "constructor") {
                  this[name] = LandingPageScene.prototype[name].bind(this);
                }
              }
            );
          }

          static get defaultProperties() {
            return foundry.utils.mergeObject(
              super.defaultProperties,
              LandingPageScene.defaultProperties
            );
          }
        }

        // Register the PF2e-specific scene class
        CONFIG.Scene.documentClass = PF2eLandingPageScene;
        console.log(
          "Foundry Landing Page | Registered PF2e landing page scene class"
        );
      } else {
        console.warn(
          "Foundry Landing Page | PF2e scene class not found, using default"
        );
        CONFIG.Scene.documentClass = LandingPageScene;
      }
    });
  } else {
    // For other systems, use the standard LandingPageScene
    console.log("Foundry Landing Page | Using standard scene class");
    CONFIG.Scene.documentClass = LandingPageScene;
  }
});
