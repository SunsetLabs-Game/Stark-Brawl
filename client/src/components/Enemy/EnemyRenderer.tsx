import React from "react";

interface EnemyRendererProps {
  spritePath: string;
  position: { x: number; y: number };
  scale?: number;
  className?: string;
}

const EnemyRenderer: React.FC<EnemyRendererProps> = ({ spritePath, position, scale = 1, className }) => {
  return (
    <img
      src={spritePath}
      alt="Enemy"
      className={className}
      style={{
        position: "absolute",
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        pointerEvents: "none",
      }}
    />
  );
};

export default EnemyRenderer; 