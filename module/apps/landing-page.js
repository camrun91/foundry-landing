import React from "react";
import { createRoot } from "react-dom/client";
import { LandingPage } from "../components/LandingPage.js";

export class LandingPageApplication extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "landing-page",
      title: "Landing Page",
      template: "modules/foundry-landing/templates/landing-page.html",
      width: 1200,
      height: 800,
      resizable: true,
    });
  }

  getData() {
    return {
      backgroundImage: game.settings.get("foundry-landing", "backgroundImage"),
      showNpcHistory: game.settings.get("foundry-landing", "showNpcHistory"),
      showPlayerInfo: game.settings.get("foundry-landing", "showPlayerInfo"),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    const container = html[0].querySelector("#landing-page-container");
    const root = createRoot(container);
    root.render(
      <LandingPage
        backgroundImage={this.getData().backgroundImage}
        showNpcHistory={this.getData().showNpcHistory}
        showPlayerInfo={this.getData().showPlayerInfo}
      />
    );
  }
}
