import type { AssetManager } from "./asset-manager"
import { GameObject } from "./game-object"

export class Bush extends GameObject {
  constructor(x: number, y: number) {
    super(x, y, 32, 32, 1, true)
  }

  init(assetManager: AssetManager): void {
    this.sprite = assetManager.getImage("bush")
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (this.isDestroyed()) return

    // Draw bush sprite
    if (this.sprite) {
      ctx.drawImage(this.sprite, Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    } else {
      // Fallback if sprite not loaded
      ctx.fillStyle = "#4CAF50"
      ctx.fillRect(Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    }

    // Draw health bar if damaged
    if (this.health < this.maxHealth) {
      const healthRatio = this.health / this.maxHealth
      const barWidth = this.width
      const barHeight = 4

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(Math.round(this.x - cameraX), Math.round(this.y - cameraY - barHeight - 2), barWidth, barHeight)

      ctx.fillStyle = "red"
      ctx.fillRect(
        Math.round(this.x - cameraX),
        Math.round(this.y - cameraY - barHeight - 2),
        barWidth * healthRatio,
        barHeight,
      )
    }
  }
}
