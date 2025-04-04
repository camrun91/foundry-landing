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
