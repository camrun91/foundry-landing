import React, { useState, useEffect } from "react";
import { NpcHistory } from "./NpcHistory.js";
import { PlayerInfo } from "./PlayerInfo.js";

export const LandingPage = ({
  backgroundImage,
  showNpcHistory,
  showPlayerInfo,
}) => {
  const [npcs, setNpcs] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Load NPCs and players when component mounts
    loadNpcs();
    loadPlayers();
  }, []);

  const loadNpcs = async () => {
    const npcActors = game.actors.filter((actor) => actor.type === "npc");
    setNpcs(npcActors);
  };

  const loadPlayers = async () => {
    const playerActors = game.actors.filter(
      (actor) => actor.type === "character"
    );
    setPlayers(playerActors);
  };

  return (
    <div
      className="landing-page-container"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="landing-page-content">
        {showNpcHistory && (
          <div className="npc-history-section">
            <h2>NPC History</h2>
            <NpcHistory npcs={npcs} />
          </div>
        )}

        {showPlayerInfo && (
          <div className="player-info-section">
            <h2>Player Information</h2>
            <PlayerInfo players={players} />
          </div>
        )}
      </div>
    </div>
  );
};
