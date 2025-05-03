import type { InputState } from "./input-manager"
import type { CollisionManager } from "./collision-manager"
import type { GameObject } from "./game-object"
import type { AssetManager } from "./asset-manager"
import { Entity } from "./entity"

export class Player extends Entity {
  private attackRange = 80
  private attackCooldown = 0
  private attackCooldownMax = 0.5 // seconds
  private targetX: number
  private targetY: number
  private moveSpeed = 200 // pixels per second
  private direction: "up" | "down" | "left" | "right" = "down"
  private isAttacking = false
  private attackAnimationTime = 0
  private attackAnimationDuration = 0.3 // seconds

  constructor(x: number, y: number) {
    super(x, y, 32, 32, 5)
    this.targetX = x * 32
    this.targetY = y * 32
  }

  init(assetManager: AssetManager) {
    this.sprites = {
      idle: {
        down: assetManager.getImage("player_idle_down"),
        up: assetManager.getImage("player_idle_up"),
        left: assetManager.getImage("player_idle_left"),
        right: assetManager.getImage("player_idle_right"),
      },
      walk: {
        down: assetManager.getImage("player_walk_down"),
        up: assetManager.getImage("player_walk_up"),
        left: assetManager.getImage("player_walk_left"),
        right: assetManager.getImage("player_walk_right"),
      },
      attack: {
        down: assetManager.getImage("player_attack_down"),
        up: assetManager.getImage("player_attack_up"),
        left: assetManager.getImage("player_attack_left"),
        right: assetManager.getImage("player_attack_right"),
      },
    }
  }

  update(deltaTime: number, input: InputState, collisionManager: CollisionManager) {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime
    }

    // Update attack animation
    if (this.isAttacking) {
      this.attackAnimationTime += deltaTime
      if (this.attackAnimationTime >= this.attackAnimationDuration) {
        this.isAttacking = false
        this.attackAnimationTime = 0
      }
    }

    // Handle movement input
    let dx = 0
    let dy = 0

    if (input.up) {
      dy -= 1
      this.direction = "up"
    }
    if (input.down) {
      dy += 1
      this.direction = "down"
    }
    if (input.left) {
      dx -= 1
      this.direction = "left"
    }
    if (input.right) {
      dx += 1
      this.direction = "right"
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy)
      dx /= length
      dy /= length
    }

    // Calculate new position
    const newX = this.x + dx * this.moveSpeed * deltaTime
    const newY = this.y + dy * this.moveSpeed * deltaTime

    // Check for collisions
    if (!collisionManager.checkCollision(newX, this.y, this.width, this.height)) {
      this.x = newX
    }

    if (!collisionManager.checkCollision(this.x, newY, this.width, this.height)) {
      this.y = newY
    }
  }

  attack(mouseX: number, mouseY: number, objects: GameObject[]): GameObject[] {
    if (this.attackCooldown > 0 || this.isAttacking) return []

    // Start attack animation
    this.isAttacking = true
    this.attackAnimationTime = 0
    this.attackCooldown = this.attackCooldownMax

    // Calculate attack direction based on mouse position
    const dx = mouseX - this.x
    const dy = mouseY - this.y

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? "right" : "left"
    } else {
      this.direction = dy > 0 ? "down" : "up"
    }

    // Find objects in attack range
    const attackedObjects: GameObject[] = []

    for (const obj of objects) {
      const objCenterX = obj.getX() + obj.getWidth() / 2
      const objCenterY = obj.getY() + obj.getHeight() / 2
      const playerCenterX = this.x + this.width / 2
      const playerCenterY = this.y + this.height / 2

      const dx = objCenterX - playerCenterX
      const dy = objCenterY - playerCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.attackRange) {
        obj.takeDamage(1)
        attackedObjects.push(obj)
      }
    }

    return attackedObjects
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Determine which sprite to use based on state
    let sprite

    if (this.isAttacking) {
      sprite = this.sprites.attack[this.direction]
    } else if (this.isMoving()) {
      sprite = this.sprites.walk[this.direction]
    } else {
      sprite = this.sprites.idle[this.direction]
    }

    // Draw player sprite
    if (sprite) {
      ctx.drawImage(sprite, Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    } else {
      // Fallback if sprite not loaded
      ctx.fillStyle = "blue"
      ctx.fillRect(Math.round(this.x - cameraX), Math.round(this.y - cameraY), this.width, this.height)
    }

    // Draw attack effect if attacking
    if (this.isAttacking) {
      ctx.save()
      ctx.globalAlpha = 1 - this.attackAnimationTime / this.attackAnimationDuration

      let attackX = this.x
      let attackY = this.y

      switch (this.direction) {
        case "up":
          attackY -= 20
          break
        case "down":
          attackY += this.height
          break
        case "left":
          attackX -= 20
          break
        case "right":
          attackX += this.width
          break
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.beginPath()
      ctx.arc(
        attackX + this.width / 2 - cameraX,
        attackY + this.height / 2 - cameraY,
        this.attackRange * ctx.globalAlpha,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      ctx.restore()
    }
  }

  private isMoving(): boolean {
    return this.x !== this.targetX || this.y !== this.targetY
  }

  getX(): number {
    return this.x
  }

  getY(): number {
    return this.y
  }
}
