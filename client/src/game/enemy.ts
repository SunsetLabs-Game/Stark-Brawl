import { Entity } from "./entity"
import type { Player } from "./Player" // Fixed casing issue
import type { CollisionManager } from "./collision-manager"
import type { AssetManager } from "./asset-manager"

export class Enemy extends Entity {
  private detectionRange = 200
  private moveSpeed = 80 // pixels per second
  private direction: "up" | "down" | "left" | "right" = "down"
  private state: "idle" | "chase" | "attack" = "idle"
  private idleTimer = 0
  private idleDirection = 0
  private attackCooldown = 0
  private attackCooldownMax = 1 // seconds
  private attackRange = 40
  private attackDamage = 1
  private isAttacking = false
  private attackAnimationTime = 0
  private attackAnimationDuration = 0.3 // seconds
  
  // Changed from private to protected to match the base class
  protected sprites: {
    idle: Record<string, HTMLImageElement | null>;
    walk: Record<string, HTMLImageElement | null>;
    attack: Record<string, HTMLImageElement | null>;
  } = {
    idle: { down: null, up: null, left: null, right: null },
    walk: { down: null, up: null, left: null, right: null },
    attack: { down: null, up: null, left: null, right: null }
  }

  constructor(x: number, y: number) {
    super(x * 32, y * 32, 32, 32, 3)
  }

  init(assetManager: AssetManager): void {
    this.sprites = {
      idle: {
        down: assetManager.getImage("enemy_idle_down"),
        up: assetManager.getImage("enemy_idle_up"),
        left: assetManager.getImage("enemy_idle_left"),
        right: assetManager.getImage("enemy_idle_right"),
      },
      walk: {
        down: assetManager.getImage("enemy_walk_down"),
        up: assetManager.getImage("enemy_walk_up"),
        left: assetManager.getImage("enemy_walk_left"),
        right: assetManager.getImage("enemy_walk_right"),
      },
      attack: {
        down: assetManager.getImage("enemy_attack_down"),
        up: assetManager.getImage("enemy_attack_up"),
        left: assetManager.getImage("enemy_attack_left"),
        right: assetManager.getImage("enemy_attack_right"),
      },
    }
  }

  // Fix the method override to match Entity's abstract method signature
  // Remove super.update() call since we can't call an abstract method
  update(deltaTime: number, player?: Player, collisionManager?: CollisionManager): void {
    // Skip the rest if player or collisionManager are missing
    if (!player || !collisionManager) return

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

    // Calculate distance to player
    const playerX = player.getX()
    const playerY = player.getY()
    const dx = playerX - this.getX()
    const dy = playerY - this.getY()
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy)

    // Determine state based on distance to player
    if (distanceToPlayer <= this.attackRange) {
      this.state = "attack"
    } else if (distanceToPlayer <= this.detectionRange) {
      this.state = "chase"
    } else {
      this.state = "idle"
    }

    // Handle state behavior
    switch (this.state) {
      case "idle":
        this.handleIdleState(deltaTime, collisionManager)
        break
      case "chase":
        this.handleChaseState(deltaTime, playerX, playerY, collisionManager)
        break
      case "attack":
        this.handleAttackState(player)
        break
    }
  }

  private handleIdleState(deltaTime: number, collisionManager: CollisionManager): void {
    // Randomly change direction occasionally
    this.idleTimer += deltaTime
    if (this.idleTimer > 2) {
      // Change direction every 2 seconds
      this.idleTimer = 0
      this.idleDirection = Math.floor(Math.random() * 4)

      switch (this.idleDirection) {
        case 0:
          this.direction = "up"
          break
        case 1:
          this.direction = "right"
          break
        case 2:
          this.direction = "down"
          break
        case 3:
          this.direction = "left"
          break
      }
    }

    // Move in the current direction
    let dx = 0
    let dy = 0

    switch (this.direction) {
      case "up":
        dy = -1
        break
      case "right":
        dx = 1
        break
      case "down":
        dy = 1
        break
      case "left":
        dx = -1
        break
    }

    // Move at half speed when idle
    const moveSpeed = this.moveSpeed * 0.5
    const newX = this.getX() + dx * moveSpeed * deltaTime
    const newY = this.getY() + dy * moveSpeed * deltaTime

    // Check for collisions and update position manually
    // Assuming Entity class inherits x and y properties from GameObject
    if (!collisionManager.checkCollision(newX, this.getY(), this.getWidth(), this.getHeight())) {
      // Direct property access assuming protected/public properties in parent
      if (typeof this.x !== 'undefined') {
        this.x = newX;
      } else {
        // Fallback for cases where x might be private in parent class
        Object.getPrototypeOf(this).constructor.prototype.x = newX;
      }
    }

    if (!collisionManager.checkCollision(this.getX(), newY, this.getWidth(), this.getHeight())) {
      if (typeof this.y !== 'undefined') {
        this.y = newY;
      } else {
        // Fallback for cases where y might be private in parent class
        Object.getPrototypeOf(this).constructor.prototype.y = newY;
      }
    }
  }

  private handleChaseState(
    deltaTime: number,
    playerX: number,
    playerY: number,
    collisionManager: CollisionManager,
  ): void {
    // Calculate direction to player
    const dx = playerX - this.getX()
    const dy = playerY - this.getY()
    const length = Math.sqrt(dx * dx + dy * dy)

    // Normalize direction
    const ndx = dx / length
    const ndy = dy / length

    // Update direction
    if (Math.abs(ndx) > Math.abs(ndy)) {
      this.direction = ndx > 0 ? "right" : "left"
    } else {
      this.direction = ndy > 0 ? "down" : "up"
    }

    // Move towards player
    const newX = this.getX() + ndx * this.moveSpeed * deltaTime
    const newY = this.getY() + ndy * this.moveSpeed * deltaTime

    // Check for collisions and update position manually
    if (!collisionManager.checkCollision(newX, this.getY(), this.getWidth(), this.getHeight())) {
      if (typeof this.x !== 'undefined') {
        this.x = newX;
      } else {
        // Fallback for cases where x might be private in parent class
        Object.getPrototypeOf(this).constructor.prototype.x = newX;
      }
    }

    if (!collisionManager.checkCollision(this.getX(), newY, this.getWidth(), this.getHeight())) {
      if (typeof this.y !== 'undefined') {
        this.y = newY;
      } else {
        // Fallback for cases where y might be private in parent class
        Object.getPrototypeOf(this).constructor.prototype.y = newY;
      }
    }
  }

  private handleAttackState(player: Player): void {
    // Removed unused deltaTime parameter
    
    // Attack player if cooldown is ready
    if (this.attackCooldown <= 0 && !this.isAttacking) {
      this.isAttacking = true
      this.attackAnimationTime = 0
      this.attackCooldown = this.attackCooldownMax

      // Deal damage to player
      // Assuming Player class has a takeDamage method
      if (typeof player.takeDamage === 'function') {
        player.takeDamage(this.attackDamage)
      }
    }

    // Update direction to face player
    const dx = player.getX() - this.getX()
    const dy = player.getY() - this.getY()

    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? "right" : "left"
    } else {
      this.direction = dy > 0 ? "down" : "up"
    }
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number): void {
    if (this.isDestroyed()) return

    // Determine which sprite to use based on state
    let sprite = null

    if (this.isAttacking) {
      sprite = this.sprites.attack[this.direction]
    } else if (this.state === "chase" || this.state === "idle") {
      sprite = this.sprites.walk[this.direction]
    } else {
      sprite = this.sprites.idle[this.direction]
    }

    // Draw enemy sprite
    if (sprite) {
      ctx.drawImage(sprite, Math.round(this.getX() - cameraX), Math.round(this.getY() - cameraY), this.getWidth(), this.getHeight())
    } else {
      // Fallback if sprite not loaded
      ctx.fillStyle = "red"
      ctx.fillRect(Math.round(this.getX() - cameraX), Math.round(this.getY() - cameraY), this.getWidth(), this.getHeight())
    }

    // Draw health bar
    const healthRatio = this.getHealth() / this.getMaxHealth()
    const barWidth = this.getWidth()
    const barHeight = 4

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(Math.round(this.getX() - cameraX), Math.round(this.getY() - cameraY - barHeight - 2), barWidth, barHeight)

    ctx.fillStyle = "red"
    ctx.fillRect(
      Math.round(this.getX() - cameraX),
      Math.round(this.getY() - cameraY - barHeight - 2),
      barWidth * healthRatio,
      barHeight,
    )
  }
}