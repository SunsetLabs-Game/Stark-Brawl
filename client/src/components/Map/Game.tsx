import MapRenderer from "./MapRenderer";
import EnemyRenderer from "../Enemy/EnemyRenderer";

interface GameSceneProps {
  mapSrc: string;
  enemyId: number;
  enemyInitialX: number;
  enemyInitialY: number;
}

export default function MainGameScene({
  mapSrc,
  enemyId,
  enemyInitialX,
  enemyInitialY,
}: GameSceneProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <MapRenderer src={mapSrc} />
      <EnemyRenderer
        enemyId={enemyId}
        initialX={enemyInitialX}
        initialY={enemyInitialY}
      />
    </div>
  );
}