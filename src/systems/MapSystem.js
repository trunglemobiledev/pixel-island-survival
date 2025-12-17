import { Container, Graphics } from 'pixi.js';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, TILE_TYPE } from '../utils/Constants';

export class MapSystem extends Container {
    constructor() {
        super();
        this.grid = [];
        this.initMap();
    }

    initMap() {
        // Generate map with zones
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                let type = TILE_TYPE.GRASS;

                // Zone 0: Home (Top) - Grass
                if (y < 20) {
                    type = TILE_TYPE.GRASS;
                }
                // Zone 1: Garden (Middle) - Soil
                else if (y >= 20 && y < 40) {
                    type = TILE_TYPE.SOIL;
                }
                // Zone 2: Water/Forest (Bottom)
                else {
                    const rand = Math.random();
                    if (rand < 0.1) type = TILE_TYPE.WATER;
                    else if (rand < 0.2) type = TILE_TYPE.STONE;
                    else type = TILE_TYPE.GRASS;
                }

                row.push(type);
            }
            this.grid.push(row);
        }
        this.renderMap();
    }

    renderMap() {
        const graphics = new Graphics();

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const type = this.grid[y][x];
                let color = 0x66CC66; // Grass

                if (type === TILE_TYPE.WATER) color = 0x3366CC;
                if (type === TILE_TYPE.STONE) color = 0x888888;
                if (type === TILE_TYPE.SOIL) color = 0x8B4513; // Brown Soil

                graphics.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                graphics.fill(color);

                // Grid lines
                graphics.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                graphics.stroke({ width: 1, color: 0x000000, alpha: 0.1 });
            }
        }
        this.addChild(graphics);
    }

    getTileAt(x, y) {
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);

        if (gridX >= 0 && gridX < MAP_WIDTH && gridY >= 0 && gridY < MAP_HEIGHT) {
            return {
                x: gridX,
                y: gridY,
                type: this.grid[gridY][gridX]
            };
        }
        return null;
    }
}
