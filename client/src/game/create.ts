import type { AssetManager } from "./asset-manager"
import { GameObject } from "./game-object"

export class Crate extends GameObject {
  private breakSprite: HTMLImageElement | null = null
  private isBreaking = false
  private breakAnimationTime = 0
  private breakAnimationDuration = 0.5 // seconds

  constructor(x: number, y: number) {
    super(x, y, 32, 32, 2, true)
  }

  init(assetManager: AssetManager): void {
    this.sprite = assetManager.getImage("crate")
    this.breakSprite = assetManager.getImage("crate_break")
  }

  update(deltaTime: number): void {
    if (this.isBreaking) {
      this.breakAnimationTime += deltaTime
      if (this.breakAnimationTime >= this.breakAnimationDuration) {
        this.health = 0 // Destroy the crate
      }
    }
  }

  takeDamage(amount: number): void {
    if (this.health <= amount && !this.isBreaking) {
      // Start break animation
      this.isBreaking = true
      this.breakAnimationTime = 0
    } else {
      super.takeDamage(amount)
    }
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (this.isDestroyed()) return

    if (this.isBreaking && this.breakSprite) {
      // Draw break animation
      const progress = this.breakAnimationTime / this.breakAnimationDuration
      const scale = 1 + progress * 0.3
      const alpha = 1 - progress

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(Math.round(this.x - cameraX + this.width / 2), Math.round(this.y - cameraY + this.height / 2))
      ctx.scale(scale, scale)
      ctx.drawImage(this.breakSprite, -this.width / 2, -this.height / 2, this.width, this.height)
      ctx.restore()
    } else {
      super.render(ctx, cameraX, cameraY)
    }
  }
}
