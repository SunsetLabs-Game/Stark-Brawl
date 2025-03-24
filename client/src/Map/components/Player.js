export default class Player {
    constructor(c, images, mapCanvas, mapData, tileSize, crates, enemies) {
        this.c = c; // player canvas context
        this.images = images;
        this.mapData = mapData;
        this.tileSize = tileSize;
        this.crates = crates;
        this.enemies = enemies;

        // Audio setup
        this.sounds = {
            grassStep: new Audio('assets/sounds/running-on-grass.mp3'),
            bushRuffle: new Audio('assets/sounds/bush-ruffle.mp3'),
            crateBreak: new Audio('assets/sounds/wood-break.mp3'),
            enemyHurt: new Audio('assets/sounds/ouch.mp3')
        };

        // Player positioning
        this.x = mapCanvas.width / 2 - 28;
        this.y = mapCanvas.height / 2 - 28;
        this.width = tileSize * 0.8;
        this.height = tileSize * 0.8;
        this.speed = 3;

        // Input tracking
        this.keys = { w: false, a: false, s: false, d: false };

        this.setUpControls();
    }

    // Handle movement and attack input
    setUpControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = false;
            }
        });

        // Handle clicks for attacking crates/enemies
        window.addEventListener('mousedown', (e) => {
            const rect = this.c.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const playerCenterX = this.x + this.width / 2;
            const playerCenterY = this.y + this.height / 2;

            // Crates
            this.crates.forEach(crate => {
                if (crate.isClicked(clickX, clickY)) {
                    const dx = playerCenterX - (crate.x + crate.tileSize / 2);
                    const dy = playerCenterY - (crate.y + crate.tileSize / 2);
                    if (Math.sqrt(dx * dx + dy * dy) / this.tileSize <= 2) {
                        crate.takeDamage();
                        this.playSound(this.sounds.crateBreak);
                    }
                }
            });

            // Enemies
            this.enemies.forEach(enemy => {
                if (enemy.isClicked(clickX, clickY)) {
                    const dx = playerCenterX - (enemy.x + enemy.width / 2);
                    const dy = playerCenterY - (enemy.y + enemy.height / 2);
                    if (Math.sqrt(dx * dx + dy * dy) / this.tileSize <= 2) {
                        enemy.takeDamage();
                        this.playSound(this.sounds.enemyHurt);
                    }
                }
            });
        });
    }

    // Movement logic with collision and slow effect
    update() {
        let newX = this.x;
        let newY = this.y;

        if (this.keys.w) newY -= this.speed;
        if (this.keys.s) newY += this.speed;
        if (this.keys.a) newX -= this.speed;
        if (this.keys.d) newX += this.speed;

        const corners = [
            { x: newX, y: newY },
            { x: newX + this.width, y: newY },
            { x: newX, y: newY + this.height },
            { x: newX + this.width, y: newY + this.height }
        ];

        let blocked = false;
        let slowed = false;

        corners.forEach(corner => {
            const col = Math.floor(corner.x / this.tileSize);
            const row = Math.floor(corner.y / this.tileSize);

            if (this.mapData[row]) {
                const tile = this.mapData[row][col];
                if (tile === 'WALL' || tile === 'CRATE') blocked = true;
                if (tile === 'BUSH') slowed = true;
            }
        });

        // Adjust speed based on terrain
        if (slowed) {
            this.speed = 1;
            this.playSoundOncePerStep(this.sounds.bushRuffle);
        } else {
            this.speed = 3;
            this.playSoundOncePerStep(this.sounds.grassStep);
        }

        // Apply movement if not blocked
        if (!blocked) {
            this.x = newX;
            this.y = newY;
        }

        this.draw();
    }

    // Single play per step cooldown logic
    playSoundOncePerStep(sound) {
        if (!this.lastSound || this.lastSound !== sound) {
            this.playSound(sound);
            this.lastSound = sound;
            setTimeout(() => this.lastSound = null, 300);
        }
    }

    // Utility sound player
    playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    // Draw player sprite
    draw() {
        this.c.drawImage(this.images.player, this.x, this.y, this.width, this.height);
    }
}