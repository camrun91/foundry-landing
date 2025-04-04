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

    // Make cards draggable for GMs
    if (game.user.isGM) {
      cards.each((i, card) => {
        const $card = $(card);
        const actorId = $card.data("actorId");
        const actor = game.actors.get(actorId);
        const position = actor.getFlag("foundry-landing", "position") ?? {
          x: 0,
          y: 0,
        };

        // Set initial position
        $card.css({
          position: "absolute",
          left: position.x + "%",
          top: position.y + "%",
        });

        // Make draggable
        $card.draggable({
          containment: "parent",
          stop: async (event, ui) => {
            const container = ui.helper.parent();
            const x = (ui.position.left / container.width()) * 100;
            const y = (ui.position.top / container.height()) * 100;
            await actor.setFlag("foundry-landing", "position", { x, y });
          },
        });
      });
    } else {
      // For non-GMs, just position the cards
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

  async close(options = {}) {
    $("#board").css("opacity", "1");
    return super.close(options);
  }
}
