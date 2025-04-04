export class LandingPageApplication extends FormApplication {
  static get defaultOptions() {
    console.log("LandingPageApplication | Initializing defaultOptions");
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "landing-page",
      title: "Landing Page",
      template: "modules/foundry-landing/templates/landing-page.html",
      width: 960,
      height: 700,
      resizable: true,
      closeOnSubmit: false,
      submitOnChange: true,
      tabs: [
        {
          navSelector: ".tabs",
          contentSelector: ".content",
          initial: "general",
        },
      ],
    });
  }

  getData() {
    console.log("LandingPageApplication | Getting Data");
    const data = {
      backgroundImage: game.settings.get("foundry-landing", "backgroundImage"),
      showNpcHistory: game.settings.get("foundry-landing", "showNpcHistory"),
      showPlayerInfo: game.settings.get("foundry-landing", "showPlayerInfo"),
      npcs: this._getNpcs(),
      players: this._getPlayers(),
      isGM: game.user.isGM,
    };
    console.log("LandingPageApplication | Data:", data);
    return data;
  }

  _getNpcs() {
    console.log("LandingPageApplication | Getting NPCs");
    const npcs = game.actors
      .filter((actor) => actor.type === "npc")
      .map((npc) => {
        return {
          id: npc.id,
          name: npc.name,
          img: npc.img,
          description:
            npc.system.details?.biography?.value || "No description available",
          isVisible: npc.getFlag("foundry-landing", "visible") ?? false,
        };
      });
    console.log("LandingPageApplication | NPCs found:", npcs.length);
    return npcs;
  }

  _getPlayers() {
    console.log("LandingPageApplication | Getting Players");
    const players = game.actors
      .filter((actor) => actor.type === "character")
      .map((player) => {
        return {
          id: player.id,
          name: player.name,
          img: player.img,
          class: player.system.details?.class?.value || "Unknown",
          level: player.system.details?.level?.value || "Unknown",
          description:
            player.system.details?.biography?.value ||
            "No description available",
        };
      });
    console.log("LandingPageApplication | Players found:", players.length);
    return players;
  }

  async _updateObject(event, formData) {
    for (let [key, value] of Object.entries(formData)) {
      await game.settings.set("foundry-landing", key, value);
    }
    this.render();
  }

  activateListeners(html) {
    super.activateListeners(html);
    console.log("LandingPageApplication | Activating Listeners");

    if (game.user.isGM) {
      // Add visibility toggle handlers for NPCs
      html.find(".npc-visibility-toggle").click(async (ev) => {
        const npcId = ev.currentTarget.dataset.npcId;
        const npc = game.actors.get(npcId);
        if (npc) {
          const currentVisibility =
            npc.getFlag("foundry-landing", "visible") ?? false;
          await npc.setFlag("foundry-landing", "visible", !currentVisibility);
          this.render();
        }
      });
    }

    // Add click handlers for NPCs
    html.find(".npc-card").click((ev) => {
      if (ev.target.classList.contains("npc-visibility-toggle")) return; // Don't open sheet when clicking toggle
      const npcId = ev.currentTarget.dataset.npcId;
      const npc = game.actors.get(npcId);
      if (npc) npc.sheet.render(true);
    });

    // Add click handlers for Players
    html.find(".player-card").click((ev) => {
      const playerId = ev.currentTarget.dataset.playerId;
      const player = game.actors.get(playerId);
      if (player) player.sheet.render(true);
    });
  }

  render(force = false, options = {}) {
    console.log("LandingPageApplication | Rendering");
    return super.render(force, options);
  }
}
