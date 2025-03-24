import Player from './Player.js';
import { Crate, Enemy } from './Objects.js';

// Canvas elements for the map and player layers
const mapCanvas = document.getElementById('mapLayer');
const playerCanvas = document.getElementById('playerLayer'); // Separate canvas for player for movements

// Map dimensions (grid-based)
const cols = 20;
const rows = 11;
const tileSize = 64;

// Set canvas dimensions based on grid size
const canvasWidth = cols * tileSize;
const canvasHeight = rows * tileSize;
mapCanvas.width = canvasWidth
mapCanvas.height = canvasHeight
playerCanvas.width = mapCanvas.width;
playerCanvas.height = mapCanvas.height;

// Get drawing contexts
const mapCtx = mapCanvas.getContext('2d');
const playerCtx = playerCanvas.getContext('2d');

// Image assets for tiles, player, enemies, etc.
const images = {
    cobblestone: new Image(),
    grass: new Image(),
    bush: new Image(),
    crate: new Image(),
    player: new Image(),
    enemy: new Image()
};

// Image sources
images.cobblestone.src = 'assets/cobble-tile.png';
images.grass.src = 'assets/grass-tile.png';
images.bush.src = 'assets/bush-tile.png';
images.crate.src = 'assets/crate-tile.png';
images.player.src = 'assets/player-static.png';
images.enemy.src = 'assets/enemy.png';

// Game state variables
let player;
let mapData = [];    // Grid data for collision detection
let grassTiles = []; // Available grass tiles for placing objects
let crates = [];
let enemies = [];

// Wait for all images to load before generating map
let loadedImages = 0; 
const totalImages = Object.keys(images).length;

for (const key in images) {
    images[key].onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
            generateMap();
            player = new Player(playerCtx, images, mapCanvas, mapData, tileSize, crates, enemies);
            playerLoop();
        }
    };
}

// Main map generation
function generateMap() {
    for (let row = 0; row < rows; row++){
        mapData[row] = [];
        for (let col = 0; col < cols; col++){
            const x = col * tileSize;
            const y = row * tileSize;

            //==> Map Border (walls) <==//
            if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1){
                mapCtx.drawImage(images.cobblestone, x, y, tileSize, tileSize);
                mapData[row][col] = 'WALL';
            }

            // Occasional cobblestone near edges
            else if ((row <= 1 || row >= rows - 2 || col <= 1 || col >= cols - 2) && Math.random() < 0.05) {
                mapCtx.drawImage(images.cobblestone, x, y, tileSize, tileSize);
                mapData[row][col] = 'WALL';
            }

            //==> Grass (Default) <==//
            else {
                mapCtx.drawImage(images.grass, x, y, tileSize, tileSize);
                grassTiles.push({ row, col, x, y });
                mapData[row][col] = 'GRASS';
            }
        }
    }

    //==> Place crates <==//
    const minCrates = 5;
    const crateTiles = getRandomTiles(grassTiles, minCrates);
    crateTiles.forEach(tile => { 
        const crate = new Crate(tile.x, tile.y, tileSize, images, playerCtx, mapCtx, tile.row, tile.col, mapData);
        crates.push(crate);   
        mapData[tile.row][tile.col] = 'CRATE';
        // Prevent bushes or enemies from spawning here
        grassTiles = grassTiles.filter(grass => !(grass.row === tile.row && grass.col === tile.col));
    });
        
    // Place bushes
    const minBushes = 3;
    const bushes = getRandomTiles(grassTiles, minBushes);
    bushes.forEach(tile => {
        generateBushes(tile.row, tile.col);
        mapData[tile.row][tile.col] = 'BUSH';
    });

    // Place enemies
    const minEnemies = 2;
    const maxEnemies = 5; 
    const enemyLocations = getRandomTilesForEnemies(grassTiles, minEnemies, maxEnemies);
    enemyLocations.forEach(tile => {
        const enemy = new Enemy(tile.x, tile.y, tileSize, images, mapData);
        enemies.push(enemy);
        mapData[tile.row][tile.col] = 'ENEMY';
    });
}

// Main game loop
function playerLoop() {
    requestAnimationFrame(playerLoop);

    // Clear player canvas before redraw
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);

    // Update enemies
    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw(playerCtx);
    });

    // Draw crate health bars
    crates.forEach(crate => {
        if (crate.health > 0) {
            crate.drawHealthBar();
        }
    });

    player.update();
}

////////////////////////////
//==> Helper Functions <==//
////////////////////////////

// Utility for getting random grass tiles
function getRandomTiles(tiles, count){
    const shuffled = [...tiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Utility for getting random tiles for enemies
function getRandomTilesForEnemies(tiles, min, max) {
    const shuffled = [...tiles].sort(() => 0.5 - Math.random());
    const enemyLocations = shuffled.slice(min, max);
    return enemyLocations;
}

// Generate a bush "vein" pattern
function generateBushes(row, col){
    const directions = [
        {r: 0, c: 0},
        { r: 1, c: 0 },
        { r: -1, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: -1 }
    ];

    directions.forEach(dir => {
        const newRow = row + dir.r;
        const newCol = col + dir.c;

        if (newRow > 0 && newRow < rows - 1 && newCol > 0 && newCol < cols - 1) {
            const x = newCol * tileSize;
            const y = newRow * tileSize;

            if (mapData[newRow][newCol] === 'GRASS') {
                mapCtx.drawImage(images.bush, x, y, tileSize, tileSize);
            }
        }
    });
}