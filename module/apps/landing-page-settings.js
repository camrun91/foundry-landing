export class LandingPageSettings extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "landing-page-settings",
      title: "Landing Page Settings",
      template: "modules/foundry-landing/templates/settings.html",
      width: 480,
      height: 320,
      closeOnSubmit: false,
    });
  }

  getData() {
    return {
      backgroundImage: game.settings.get("foundry-landing", "backgroundImage"),
      showNpcHistory: game.settings.get("foundry-landing", "showNpcHistory"),
      showPlayerInfo: game.settings.get("foundry-landing", "showPlayerInfo"),
    };
  }

  async _updateObject(event, formData) {
    for (let [key, value] of Object.entries(formData)) {
      await game.settings.set("foundry-landing", key, value);
    }
    // Trigger a re-render of the landing page if it exists
    if (window.landingPage) {
      window.landingPage.render(true);
    }
  }
}
