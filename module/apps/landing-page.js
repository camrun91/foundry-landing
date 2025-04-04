export class LandingPageApplication extends Application {
  static get defaultOptions() {
    console.log("LandingPageApplication | Initializing defaultOptions");
    return mergeObject(super.defaultOptions, {
      id: "landing-page",
      title: "Landing Page",
      template: "modules/foundry-landing/templates/landing-page.html",
      width: 960,
      height: 700,
      resizable: true,
      popOut: true,
      classes: ["landing-page"],
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

  activateListeners(html) {
    super.activateListeners(html);
    console.log("LandingPageApplication | Activating Listeners");

    // Add click handlers for NPCs
    html.find(".npc-card").click((ev) => {
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
