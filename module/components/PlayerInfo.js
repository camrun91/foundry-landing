import React from "react";

export const PlayerInfo = ({ players }) => {
  return (
    <div className="player-info-grid">
      {players.map((player) => (
        <div key={player.id} className="player-card">
          <div className="player-image">
            {player.img && <img src={player.img} alt={player.name} />}
          </div>
          <div className="player-info">
            <h3>{player.name}</h3>
            <div className="player-stats">
              <p>Class: {player.system?.class || "Unknown"}</p>
              <p>Level: {player.system?.level || "Unknown"}</p>
              <p>Race: {player.system?.race || "Unknown"}</p>
            </div>
            <div className="player-description">
              <p>{player.system?.description || "No description available"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
