export class LandingPageApplication {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    // Create the landing page container
    const landingPage = document.createElement("div");
    landingPage.id = "landing-page-background";
    landingPage.classList.add("landing-page-background");

    // Insert it as the first child of the body, before the game canvas
    document.body.insertBefore(landingPage, document.body.firstChild);

    this.element = landingPage;
    this.initialized = true;

    this.render();
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
    return game.actors
      .filter((actor) => actor.type === "npc")
      .map((npc) => ({
        id: npc.id,
        name: npc.name,
        img: npc.img,
        description:
          npc.system.details?.biography?.value || "No description available",
        isVisible: npc.getFlag("foundry-landing", "visible") ?? false,
      }));
  }

  _getPlayers() {
    return game.actors
      .filter((actor) => actor.type === "character")
      .map((player) => ({
        id: player.id,
        name: player.name,
        img: player.img,
        class: player.system.details?.class?.value || "Unknown",
        level: player.system.details?.level?.value || "Unknown",
        description:
          player.system.details?.biography?.value || "No description available",
      }));
  }

  async render(show = true) {
    if (!this.initialized) this.initialize();

    if (show) {
      const data = this.getData();
      const content = await renderTemplate(
        "modules/foundry-landing/templates/landing-page.html",
        data
      );
      this.element.innerHTML = content;
      this.element.style.display = "block";
      this.activateListeners($(this.element));
    } else {
      this.element.style.display = "none";
    }
  }

  activateListeners(html) {
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
      if (ev.target.classList.contains("npc-visibility-toggle")) return;
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

  close() {
    this.render(false);
  }
}
