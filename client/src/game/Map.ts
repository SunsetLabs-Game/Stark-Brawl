import type { GameObject } from "./game-object"
import type { AssetManager } from "./asset-manager"
import { Bush } from "./bush"
import { Crate } from "./create"

export enum TileType {
  GRASS = 0,
  WALL = 1,
  WATER = 2,
}

export class Map {
  private width: number
  private height: number
  private tileSize = 32
  private tiles: TileType[][]
  private objects: GameObject[] = []
  private tileSprites: Record<TileType, HTMLImageElement | null> = {
    [TileType.GRASS]: null,
    [TileType.WALL]: null,
    [TileType.WATER]: null,
  }

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.tiles = Array.from({ length: height }, () => Array(width).fill(TileType.GRASS))
    this.generateMap()
  }

  init(assetManager: AssetManager) {
    // Load tile sprites
    this.tileSprites[TileType.GRASS] = assetManager.getImage("tile_grass")
    this.tileSprites[TileType.WALL] = assetManager.getImage("tile_wall")
    this.tileSprites[TileType.WATER] = assetManager.getImage("tile_water")

    // Initialize objects
    this.objects.forEach((obj) => obj.init(assetManager))
  }

  private generateMap() {
    // Add walls around edges
    for (let x = 0; x < this.width; x++) {
      this.tiles[0][x] = TileType.WALL
      this.tiles[this.height - 1][x] = TileType.WALL
    }
    for (let y = 0; y < this.height; y++) {
      this.tiles[y][0] = TileType.WALL
      this.tiles[y][this.width - 1] = TileType.WALL
    }

    // Add some random walls
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * (this.width - 2)) + 1
      const y = Math.floor(Math.random() * (this.height - 2)) + 1
      this.tiles[y][x] = TileType.WALL
    }

    // Add some water
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * (this.width - 2)) + 1
      const y = Math.floor(Math.random() * (this.height - 2)) + 1
      this.tiles[y][x] = TileType.WATER
    }

    // Add bushes (non-blocking but provides cover)
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(Math.random() * (this.width - 2)) + 1
      const y = Math.floor(Math.random() * (this.height - 2)) + 1

      if (this.tiles[y][x] === TileType.GRASS) {
        this.objects.push(new Bush(x * this.tileSize, y * this.tileSize))
      }
    }

    // Add crates (destructible obstacles)
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * (this.width - 2)) + 1
      const y = Math.floor(Math.random() * (this.height - 2)) + 1

      if (this.tiles[y][x] === TileType.GRASS) {
        this.objects.push(new Crate(x * this.tileSize, y * this.tileSize))
      }
    }
  }

  update(deltaTime: number) {
    // Update all objects
    this.objects.forEach((obj) => obj.update(deltaTime))

    // Remove destroyed objects
    this.objects = this.objects.filter((obj) => !obj.isDestroyed())
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
    // Calculate visible tile range
    const startX = Math.floor(cameraX / this.tileSize)
    const startY = Math.floor(cameraY / this.tileSize)
    const endX = Math.min(this.width, startX + Math.ceil(ctx.canvas.width / this.tileSize) + 1)
    const endY = Math.min(this.height, startY + Math.ceil(ctx.canvas.height / this.tileSize) + 1)

    // Render visible tiles
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tileType = this.tiles[y][x]
        const sprite = this.tileSprites[tileType]

        if (sprite) {
          ctx.drawImage(sprite, x * this.tileSize - cameraX, y * this.tileSize - cameraY, this.tileSize, this.tileSize)
        } else {
          // Fallback if sprite not loaded
          switch (tileType) {
            case TileType.GRASS:
              ctx.fillStyle = "#8FBC8F"
              break
            case TileType.WALL:
              ctx.fillStyle = "#444"
              break
            case TileType.WATER:
              ctx.fillStyle = "#4682B4"
              break
          }

          ctx.fillRect(x * this.tileSize - cameraX, y * this.tileSize - cameraY, this.tileSize, this.tileSize)
        }
      }
    }

    // Render objects
    this.objects.forEach((obj) => {
      if (
        obj.getX() + obj.getWidth() > cameraX &&
        obj.getX() < cameraX + ctx.canvas.width &&
        obj.getY() + obj.getHeight() > cameraY &&
        obj.getY() < cameraY + ctx.canvas.height
      ) {
        obj.render(ctx, cameraX, cameraY)
      }
    })
  }

  isTileBlocking(x: number, y: number): boolean {
    // Check if coordinates are out of bounds
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return true
    }

    // Check if tile is blocking
    const tileType = this.tiles[y][x]
    return tileType === TileType.WALL || tileType === TileType.WATER
  }

  getObjects(): GameObject[] {
    return this.objects
  }

  getWidthInPixels(): number {
    return this.width * this.tileSize
  }

  getHeightInPixels(): number {
    return this.height * this.tileSize
  }

  getTileSize(): number {
    return this.tileSize
  }
}
