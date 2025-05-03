import { Map } from "./Map"

export class CollisionManager {
  private map: Map

  constructor(map: Map) {
    this.map = map
  }

  checkCollision(x: number, y: number, width: number, height: number): boolean {
    const tileSize = this.map.getTileSize()

    // Check each corner of the entity
    const points = [
      { x: x + 4, y: y + 4 }, // Top-left
      { x: x + width - 4, y: y + 4 }, // Top-right
      { x: x + 4, y: y + height - 4 }, // Bottom-left
      { x: x + width - 4, y: y + height - 4 }, // Bottom-right
    ]

    for (const point of points) {
      const tileX = Math.floor(point.x / tileSize)
      const tileY = Math.floor(point.y / tileSize)

      if (this.map.isTileBlocking(tileX, tileY)) {
        return true
      }
    }

    return false
  }
}
