export class Crate {
    constructor(x, y, tileSize, images, playerCtx, mapCtx, row, col, mapData) {
        // Crate properties
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.images = images;
        this.mapCtx = mapCtx;
        this.playerCtx = playerCtx;
        this.row = row;
        this.col = col;
        this.mapData = mapData;
        this.isDestroyed = false;

        // Health
        this.maxHealth = 5;
        this.health = Math.floor(Math.random() * this.maxHealth) + 1;

        this.draw();
    }

    // Draw crate
    draw() {
        this.mapCtx.drawImage(this.images.crate, this.x, this.y, this.tileSize, this.tileSize);
    }

    // Draw health bar above crate
    drawHealthBar() {
        if (this.health <= this.maxHealth) {
            const healthRatio = this.health / this.maxHealth;
            this.playerCtx.fillStyle = 'red';
            this.playerCtx.fillRect(this.x, this.y - 5, this.tileSize * healthRatio, 2);
        }
    }

    // Called when player clicks to attack
    takeDamage() {
        if (this.isDestroyed) return;

        this.health -= 1;

        if (this.health > 0) {
            this.shake();
        } else {
            this.destroy();
        }

        this.drawHealthBar();
    }

    // Handle crate destruction
    destroy() {
        this.isDestroyed = true;
        this.mapCtx.clearRect(this.x, this.y, this.tileSize, this.tileSize);
        this.mapCtx.drawImage(this.images.grass, this.x, this.y, this.tileSize, this.tileSize);
        this.mapData[this.row][this.col] = 'GRASS';
    }

    // Shake effect when crate is hit
    shake() {
        const originalX = this.x;
        const originalY = this.y;

        let i = 0;
        const interval = setInterval(() => {
            this.mapCtx.clearRect(originalX - 2, originalY - 2, this.tileSize + 4, this.tileSize + 4);
            const offsetX = (i % 2 === 0) ? 3 : -3;
            const offsetY = (i % 2 === 0) ? 2 : -2;

            this.mapCtx.drawImage(this.images.grass, originalX, originalY, this.tileSize, this.tileSize);
            this.mapCtx.drawImage(this.images.crate, originalX + offsetX, originalY + offsetY, this.tileSize, this.tileSize);
            i++;

            if (i > 4) {
                clearInterval(interval);
                this.mapCtx.clearRect(originalX - 2, originalY - 2, this.tileSize + 4, this.tileSize + 4);
                this.mapCtx.drawImage(this.images.grass, originalX, originalY, this.tileSize, this.tileSize);
                if (!this.isDestroyed) {
                    this.mapCtx.drawImage(this.images.crate, originalX, originalY, this.tileSize, this.tileSize);
                }
            }
        }, 50);
    }

    // Check if clicked by player
    isClicked(clickX, clickY) {
        return (
            clickX > this.x &&
            clickX < this.x + this.tileSize &&
            clickY > this.y &&
            clickY < this.y + this.tileSize
        );
    }
}

export class Enemy {
    constructor(x, y, tileSize, images, mapData) {
        // Enemy properties
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.images = images;
        this.mapData = mapData;

        this.width = tileSize * 0.8;
        this.height = tileSize * 0.8;
        this.speed = 1;

        // Health system (3 to 10 clicks)
        this.maxHealth = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
        this.health = this.maxHealth;

        // Movement AI
        this.directions = ['up', 'down', 'left', 'right'];
        this.currentDirection = this.getRandomDirection();
        this.changeDirectionInterval = Math.random() * 2000 + 1000; // 1s - 3s

        this.setDirectionTimer();
    }

    // Pick random direction
    getRandomDirection() {
        return this.directions[Math.floor(Math.random() * this.directions.length)];
    }

    // Change direction at intervals
    setDirectionTimer() {
        setInterval(() => {
            this.currentDirection = this.getRandomDirection();
        }, this.changeDirectionInterval);
    }

    // Basic movement logic with collisions
    move() {
        if (this.health <= 0) return;

        let newX = this.x;
        let newY = this.y;

        if (this.currentDirection === 'up') newY -= this.speed;
        if (this.currentDirection === 'down') newY += this.speed;
        if (this.currentDirection === 'left') newX -= this.speed;
        if (this.currentDirection === 'right') newX += this.speed;

        const corners = [
            { x: newX, y: newY },
            { x: newX + this.width, y: newY },
            { x: newX, y: newY + this.height },
            { x: newX + this.width, y: newY + this.height }
        ];

        let blocked = false;
        corners.forEach(corner => {
            const col = Math.floor(corner.x / this.tileSize);
            const row = Math.floor(corner.y / this.tileSize);
            if (this.mapData[row] && (this.mapData[row][col] === 'WALL' || this.mapData[row][col] === 'CRATE')) {
                blocked = true;
            }
        });

        if (!blocked) {
            this.x = newX;
            this.y = newY;
        }
    }

    // Draw enemy and health bar
    draw(ctx) {
        if (this.health <= 0) return;

        ctx.drawImage(this.images.enemy, this.x, this.y, this.width, this.height);

        const ratio = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 5, this.width * ratio, 4);
    }

    // Take damage and apply flinch animation
    takeDamage() {
        this.health -= 1;
        this.flinch();
    }

    // Simple flinch (jump) animation
    flinch() {
        const originalY = this.y;
        const jumpHeight = 5;

        this.y = originalY - jumpHeight;

        setTimeout(() => {
            this.y = originalY;
        }, 100);
    }

    // Check if clicked by player
    isClicked(clickX, clickY) {
        return (
            clickX > this.x &&
            clickX < this.x + this.width &&
            clickY > this.y &&
            clickY < this.y + this.height
        );
    }
}