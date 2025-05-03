export class GameObject {
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    destructible: boolean;
  
    constructor(x: number, y: number, health = 3) {
      this.x = x;
      this.y = y;
      this.health = health;
      this.maxHealth = health;
      this.destructible = true;
    }
  
    takeDamage(amount: number) {
      if (this.destructible) {
        this.health -= amount;
      }
    }
  
    isDestroyed(): boolean {
      return this.health <= 0;
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      if (this.isDestroyed()) return;
  
      // Draw object
      ctx.fillStyle = 'brown';
      ctx.fillRect(this.x * 32 + 4, this.y * 32 + 4, 24, 24);
  
      // Draw health bar
      if (this.health < this.maxHealth) {
        const healthRatio = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x * 32 + 4, this.y * 32, 24 * healthRatio, 4);
      }
    }
  }
  