import LavaHellBg from '@/assets/td-tilesets1-2/tower-defense-game-tile-set-pack-2/PNG/game_background_2/game_background_2.png';

export interface MapConfig {
  backgroundImage: string;
  waypoints: Array<{ x: number; y: number }>;
}

export const mapsConfig: Record<string, MapConfig> = {
  lavaHell: {
    backgroundImage: LavaHellBg,
    waypoints: [
      { x: 0.05, y: 0.6 },
      { x: 0.15, y: 0.6 },
      { x: 0.25, y: 0.7 },
      { x: 0.35, y: 0.8 },
      { x: 0.45, y: 0.7 },
      { x: 0.55, y: 0.6 },
      { x: 0.65, y: 0.5 },
      { x: 0.75, y: 0.4 },
      { x: 0.85, y: 0.3 },
      { x: 0.95, y: 0.2 },
    ],
  },
}; 