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

    if (game.user.isGM) {
      // Set up drag handling for GMs
      cards.each((i, card) => {
        card.setAttribute("draggable", true);
        card.addEventListener("dragstart", this._onDragStart.bind(this));
        card.addEventListener("drag", this._onDrag.bind(this));
        card.addEventListener("dragend", this._onDragEnd.bind(this));
      });
    }

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
  }

  _onDragStart(event) {
    const card = event.currentTarget;
    card.classList.add("dragging");

    // Store the initial mouse position relative to the card
    const rect = card.getBoundingClientRect();
    card.dataset.offsetX = event.clientX - rect.left;
    card.dataset.offsetY = event.clientY - rect.top;
  }

  _onDrag(event) {
    if (!event.clientX || !event.clientY) return; // Ignore invalid drag events

    const card = event.currentTarget;
    const container = card.parentElement;
    const containerRect = container.getBoundingClientRect();

    // Calculate new position considering the initial offset
    const offsetX = Number(card.dataset.offsetX);
    const offsetY = Number(card.dataset.offsetY);

    let left = event.clientX - containerRect.left - offsetX;
    let top = event.clientY - containerRect.top - offsetY;

    // Constrain to container bounds
    left = Math.max(0, Math.min(left, containerRect.width - card.offsetWidth));
    top = Math.max(0, Math.min(top, containerRect.height - card.offsetHeight));

    // Convert to percentages
    const xPercent = (left / containerRect.width) * 100;
    const yPercent = (top / containerRect.height) * 100;

    card.style.left = xPercent + "%";
    card.style.top = yPercent + "%";
  }

  async _onDragEnd(event) {
    const card = event.currentTarget;
    card.classList.remove("dragging");

    // Save the final position
    const container = card.parentElement;
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
    $("#board").css("opacity", "1");
    return super.close(options);
  }
}
