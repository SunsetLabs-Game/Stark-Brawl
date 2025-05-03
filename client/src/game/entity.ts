import { GameObject } from "./game-object"

export abstract class Entity extends GameObject {
  protected sprites: {
    idle: Record<string, HTMLImageElement | null>
    walk: Record<string, HTMLImageElement | null>
    attack: Record<string, HTMLImageElement | null>
  } = {
    idle: { up: null, down: null, left: null, right: null },
    walk: { up: null, down: null, left: null, right: null },
    attack: { up: null, down: null, left: null, right: null },
  }

  // Make update method abstract to enforce implementation in subclasses
  // This avoids unused parameter warnings
  abstract update(deltaTime: number, ...args: any[]): void;

  getHealth(): number {
    return this.health
  }

  getMaxHealth(): number {
    return this.maxHealth
  }
}