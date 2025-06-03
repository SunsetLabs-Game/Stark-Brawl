import React, { useEffect, useRef, useState } from 'react';
import MapRenderer from '@/components/Map/MapRenderer';
import EnemyRenderer from '@/components/Enemy/EnemyRenderer';
import { EnemyPathController } from '@/logic/EnemyPathController';
import EnemySprite from '@/assets/monster-character-2d-sprites/PNG/1/2_enemies_1_WALK_000.png';

const MAP_ID = 'lavaHell';

const MapDemo: React.FC = () => {
  const [enemyPosition, setEnemyPosition] = useState({ x: 0, y: 0 });
  const pathControllerRef = useRef<EnemyPathController | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    pathControllerRef.current = new EnemyPathController(MAP_ID, 0.0005);

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (pathControllerRef.current) {
        pathControllerRef.current.update(deltaTime);
        setEnemyPosition(pathControllerRef.current.getCurrentPosition());

        if (!pathControllerRef.current.hasReachedEnd()) {
          requestAnimationFrame(animate);
        }
      }
    };

    requestAnimationFrame(animate);

    return () => {
      pathControllerRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <MapRenderer mapId={MAP_ID} className="w-full h-full" />
      <EnemyRenderer
        spritePath={EnemySprite}
        position={enemyPosition}
        scale={1.5}
      />
    </div>
  );
};

export default MapDemo; 