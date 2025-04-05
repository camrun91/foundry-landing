/**
 * Visibility Controls Component
 * A component for controlling actor visibility in the landing page scene
 */
export class VisibilityControls {
  /**
   * Create a new visibility controls component
   * @param {Scene} scene - The scene this component belongs to
   */
  constructor(scene) {
    this.scene = scene;
    this.element = null;
  }

  /**
   * Render the visibility controls
   * @returns {HTMLElement}
   */
  async render() {
    const npcs = await this.scene._getNpcs();
    const players = await this.scene._getPlayers();

    const container = document.createElement("div");
    container.className = "visibility-controls";

    // Create NPC visibility controls
    const npcControls = document.createElement("div");
    npcControls.className = "visibility-dropdown";

    const npcToggle = document.createElement("button");
    npcToggle.className = "visibility-toggle";
    npcToggle.innerHTML =
      '<i class="fas fa-eye"></i> NPC Visibility <i class="fas fa-chevron-down"></i>';

    const npcContent = document.createElement("div");
    npcContent.className = "visibility-content";

    const npcList = document.createElement("div");
    npcList.className = "visibility-list";

    npcs.forEach((npc) => {
      const item = document.createElement("div");
      item.className = "visibility-item";

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "actor-visibility";
      checkbox.dataset.actorId = npc.id;
      checkbox.dataset.actorType = "npc";
      checkbox.checked = npc.isVisible;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(npc.name));

      item.appendChild(label);
      npcList.appendChild(item);
    });

    npcContent.appendChild(npcList);
    npcControls.appendChild(npcToggle);
    npcControls.appendChild(npcContent);

    // Create player visibility controls
    const playerControls = document.createElement("div");
    playerControls.className = "visibility-dropdown";

    const playerToggle = document.createElement("button");
    playerToggle.className = "visibility-toggle";
    playerToggle.innerHTML =
      '<i class="fas fa-eye"></i> Player Visibility <i class="fas fa-chevron-down"></i>';

    const playerContent = document.createElement("div");
    playerContent.className = "visibility-content";

    const playerList = document.createElement("div");
    playerList.className = "visibility-list";

    players.forEach((player) => {
      const item = document.createElement("div");
      item.className = "visibility-item";

      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "actor-visibility";
      checkbox.dataset.actorId = player.id;
      checkbox.dataset.actorType = "player";
      checkbox.checked = player.isVisible;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(player.name));

      item.appendChild(label);
      playerList.appendChild(item);
    });

    playerContent.appendChild(playerList);
    playerControls.appendChild(playerToggle);
    playerControls.appendChild(playerContent);

    // Add controls to container
    container.appendChild(npcControls);
    container.appendChild(playerControls);

    // Store element reference
    this.element = container;

    // Add event listeners
    this._addEventListeners();

    return container;
  }

  /**
   * Add event listeners to the visibility controls
   */
  _addEventListeners() {
    if (!this.element) return;

    // Add click handlers for visibility toggles
    this.element.querySelectorAll(".visibility-toggle").forEach((toggle) => {
      toggle.addEventListener(
        "click",
        this._onVisibilityDropdownToggle.bind(this)
      );
    });

    // Add change handlers for visibility checkboxes
    this.element.querySelectorAll(".actor-visibility").forEach((checkbox) => {
      checkbox.addEventListener("change", this._onVisibilityToggle.bind(this));
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".visibility-dropdown")) {
        this.element
          .querySelectorAll(".visibility-dropdown")
          .forEach((dropdown) => {
            dropdown.classList.remove("active");
          });
      }
    });
  }

  /**
   * Handle visibility dropdown toggle
   * @param {Event} event
   */
  _onVisibilityDropdownToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const dropdown = event.currentTarget.closest(".visibility-dropdown");

    // Close other dropdowns
    this.element.querySelectorAll(".visibility-dropdown").forEach((d) => {
      if (d !== dropdown) {
        d.classList.remove("active");
      }
    });

    // Toggle this dropdown
    dropdown.classList.toggle("active");
  }

  /**
   * Handle visibility toggle
   * @param {Event} event
   */
  async _onVisibilityToggle(event) {
    const checkbox = event.target;
    const actorId = checkbox.dataset.actorId;
    const isVisible = checkbox.checked;
    const actorType = checkbox.dataset.actorType;

    // Get current visibility settings with proper defaults
    let visibleActors = game.settings.get(
      "foundry-landing",
      "visibleActors"
    ) || { npcs: {}, players: {} };

    // Ensure both properties exist
    if (!visibleActors.npcs) visibleActors.npcs = {};
    if (!visibleActors.players) visibleActors.players = {};

    // Update visibility for this actor
    if (actorType === "npc") {
      visibleActors.npcs[actorId] = isVisible;
    } else if (actorType === "player") {
      visibleActors.players[actorId] = isVisible;
    }

    // Save the updated settings
    await game.settings.set("foundry-landing", "visibleActors", visibleActors);

    // Re-render the scene to reflect changes
    this.scene.render(true);
  }
}
