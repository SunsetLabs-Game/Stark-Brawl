import { Enemy } from "./enemy"
import { CollisionManager } from "./collision-manager"
import { AssetManager } from "./asset-manager"
import { Map } from "./Map"
import { SoundManager } from "./sound-manager"
import { InputManager } from "./input-manager"
import { Player } from "./Player"

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private player: Player
  private map: Map
  private enemies: Enemy[] = []
  private soundManager: SoundManager
  private inputManager: InputManager
  private collisionManager: CollisionManager
  private assetManager: AssetManager
  private lastTimestamp = 0
  private animationFrameId = 0
  private isRunning = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not get canvas context")
    this.ctx = context

    this.assetManager = new AssetManager()
    this.soundManager = new SoundManager()
    this.inputManager = new InputManager(canvas)
    this.map = new Map(25, 19)
    this.player = new Player(12, 9)
    this.collisionManager = new CollisionManager(this.map)

    // Focus canvas for keyboard input
    canvas.focus()
  }

  async start() {
    if (this.isRunning) return

    try {
      // Load assets
      await this.assetManager.loadAssets()
    } catch (e) {
      console.error("Failed to load assets:", e)
      // Continue anyway with placeholder assets
    }

    // Initialize game objects
    this.map.init(this.assetManager)
    this.player.init(this.assetManager)

    // Spawn enemies
    this.spawnEnemies()

    // Start game loop
    this.isRunning = true
    this.lastTimestamp = performance.now()
    this.gameLoop(this.lastTimestamp)

    try {
      // Play background music
      this.soundManager.playMusic()
    } catch (e) {
      console.warn("Could not play background music:", e)
    }
  }

  stop() {
    this.isRunning = false
    cancelAnimationFrame(this.animationFrameId)
    this.inputManager.cleanup()
    this.soundManager.stopAll()
  }

  toggleSound() {
    this.soundManager.toggleMute()
  }

  private spawnEnemies() {
    // Create some enemies at different positions
    const enemyPositions = [
      { x: 5, y: 15 },
      { x: 18, y: 5 },
      { x: 20, y: 15 },
      { x: 3, y: 3 },
      { x: 22, y: 12 },
    ]

    enemyPositions.forEach((pos) => {
      const enemy = new Enemy(pos.x, pos.y)
      enemy.init(this.assetManager)
      this.enemies.push(enemy)
    })
  }

  private gameLoop(timestamp: number) {
    if (!this.isRunning) return

    const deltaTime = timestamp - this.lastTimestamp
    this.lastTimestamp = timestamp

    this.update(deltaTime / 1000)
    this.render()

    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this))
  }

  private update(deltaTime: number) {
    // Handle player input
    const input = this.inputManager.getInput()

    // Update player
    this.player.update(deltaTime, input, this.collisionManager)

    // Check for player attacks
    if (input.attack) {
      const attackedObjects = this.player.attack(input.mouseX, input.mouseY, [
        ...this.map.getObjects(),
        ...this.enemies,
      ])

      if (attackedObjects.length > 0) {
        this.soundManager.playSound("attack")
      }
    }

    // Update enemies
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime, this.player, this.collisionManager)
    })

    // Filter out destroyed enemies
    this.enemies = this.enemies.filter((enemy) => !enemy.isDestroyed())

    // Update map objects
    this.map.update(deltaTime)
  }

  private render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Calculate camera position (centered on player)
    const cameraX = Math.max(
      0,
      Math.min(this.map.getWidthInPixels() - this.canvas.width, this.player.getX() - this.canvas.width / 2),
    )
    const cameraY = Math.max(
      0,
      Math.min(this.map.getHeightInPixels() - this.canvas.height, this.player.getY() - this.canvas.height / 2),
    )

    // Render map with camera offset
    this.map.render(this.ctx, cameraX, cameraY)

    // Render enemies
    this.enemies.forEach((enemy) => {
      enemy.render(this.ctx, cameraX, cameraY)
    })

    // Render player
    this.player.render(this.ctx, cameraX, cameraY)

    // Render UI elements
    this.renderUI()
  }

  private renderUI() {
    // Render player health
    const health = this.player.getHealth()
    const maxHealth = this.player.getMaxHealth()

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    this.ctx.fillRect(10, 10, 104, 24)

    this.ctx.fillStyle = "red"
    this.ctx.fillRect(12, 12, 100 * (health / maxHealth), 20)

    this.ctx.fillStyle = "white"
    this.ctx.font = "14px Arial"
    this.ctx.fillText(`HP: ${health}/${maxHealth}`, 15, 28)
  }
}
