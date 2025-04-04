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
    }));
  }

  _getPlayers() {
    return game.actors
      .filter((actor) => actor.type === "character")
      .map((player) => ({
        id: player.id,
        name: player.name,
        img: player.img,
      }));
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle NPC visibility toggle
    if (game.user.isGM) {
      html.find(".npc-visibility-toggle").click(async (event) => {
        const npcId = event.currentTarget.dataset.npcId;
        const npc = game.actors.get(npcId);
        const currentVisibility =
          npc.getFlag("foundry-landing", "visible") ?? true;
        await npc.setFlag("foundry-landing", "visible", !currentVisibility);
        this.render(true);
      });
    }
  }

  async close(options = {}) {
    $("#board").css("opacity", "1");
    return super.close(options);
  }
}
