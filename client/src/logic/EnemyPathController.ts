import { mapsConfig } from '../components/Map/mapsConfig';

export interface Position {
  x: number;
  y: number;
}

export class EnemyPathController {
  private currentWaypointIndex: number = 0;
  private progress: number = 0;
  private readonly mapId: string;
  private readonly speed: number;

  constructor(mapId: string, speed: number = 0.001) {
    this.mapId = mapId;
    this.speed = speed;
  }

  public getCurrentPosition(): Position {
    const mapConfig = mapsConfig[this.mapId];
    if (!mapConfig) {
      throw new Error(`Map configuration not found for mapId: ${this.mapId}`);
    }

    const waypoints = mapConfig.waypoints;
    if (this.currentWaypointIndex >= waypoints.length - 1) {
      return waypoints[waypoints.length - 1];
    }

    const currentWaypoint = waypoints[this.currentWaypointIndex];
    const nextWaypoint = waypoints[this.currentWaypointIndex + 1];

    return {
      x: currentWaypoint.x + (nextWaypoint.x - currentWaypoint.x) * this.progress,
      y: currentWaypoint.y + (nextWaypoint.y - currentWaypoint.y) * this.progress,
    };
  }

  public update(deltaTime: number): void {
    this.progress += this.speed * deltaTime;

    if (this.progress >= 1) {
      this.progress = 0;
      this.currentWaypointIndex++;

      const mapConfig = mapsConfig[this.mapId];
      if (this.currentWaypointIndex >= mapConfig.waypoints.length - 1) {
        this.currentWaypointIndex = mapConfig.waypoints.length - 1;
        this.progress = 1;
      }
    }
  }

  public hasReachedEnd(): boolean {
    const mapConfig = mapsConfig[this.mapId];
    return (
      this.currentWaypointIndex === mapConfig.waypoints.length - 1 &&
      this.progress >= 1
    );
  }

  public reset(): void {
    this.currentWaypointIndex = 0;
    this.progress = 0;
  }
} 