import type { AssetManager } from "./asset-manager"

export abstract class GameObject {
  protected x: number
  protected y: number
  protected width: number
  protected height: number
  protected health: number
  protected maxHealth: number
  protected destructible: boolean
  protected sprite: HTMLImageElement | null = null

  constructor(x: number, y: number, width: number, height: number, health = 3, destructible = true) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.health = health
    this.maxHealth = health
    this.destructible = destructible
  }

  abstract init(assetManager: AssetManager): void

  update(_deltaTime: number): void {
    // Base implementation does nothing
  }

  takeDamage(amount: number): void {
    if (this.destructible) {
      this.health = Math.max(0, this.health - amount)
    }
  }

  isDestroyed(): boolean {
    return this.health <= 0
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (this.isDestroyed()) return

    // Draw object sprite
    if (this.sprite) {
      ctx.drawImage(this.sprite, Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    } else {
      // Fallback if sprite not loaded
      ctx.fillStyle = "gray"
      ctx.fillRect(Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    }

    // Draw health bar if damaged
    if (this.destructible && this.health < this.maxHealth) {
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

  getX(): number {
    return this.x
  }

  getY(): number {
    return this.y
  }

  getWidth(): number {
    return this.width
  }

  getHeight(): number {
    return this.height
  }

  isCollidingWith(other: GameObject): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }
}
