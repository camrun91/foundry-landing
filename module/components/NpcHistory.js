import React from "react";

export const NpcHistory = ({ npcs }) => {
  return (
    <div className="npc-history-grid">
      {npcs.map((npc) => (
        <div key={npc.id} className="npc-card">
          <div className="npc-image">
            {npc.img && <img src={npc.img} alt={npc.name} />}
          </div>
          <div className="npc-info">
            <h3>{npc.name}</h3>
            <p>{npc.system?.description || "No description available"}</p>
            <div className="npc-metadata">
              <span>
                Last Interaction: {npc.system?.lastInteraction || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
