import React from "react";
import { mapsConfig } from "./mapsConfig";

interface MapRendererProps {
  mapId: string;
  className?: string;
}

const MapRenderer: React.FC<MapRendererProps> = ({ mapId, className }) => {
  const config = mapsConfig[mapId];
  if (!config) return null;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Path visualization for debugging (optional) */}
      {/* <svg ...> ... </svg> */}
    </div>
  );
};

export default MapRenderer; 