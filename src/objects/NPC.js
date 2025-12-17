import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE, MAP_WIDTH, MAP_HEIGHT } from '../utils/Constants';

export class NPC extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.NPC, x, y);
        this.speed = 1.5; // Slower than player
        this.targetX = this.x;
        this.targetY = this.y;
        this.isMoving = false;
        this.idleTimer = 0;
        this.state = 'IDLE'; // IDLE, WALK
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Shadow
        g.ellipse(centerX, bottomY, 8, 3);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Legs (Brown Pants)
        g.rect(centerX - 4, bottomY - 8, 3, 8);
        g.rect(centerX + 1, bottomY - 8, 3, 8);
        g.fill(0x554433);

        // Body (Green Shirt - Villager)
        g.rect(centerX - 5, bottomY - 16, 10, 9);
        g.fill(0x44AA44);

        // Head (Skin)
        g.rect(centerX - 5, bottomY - 24, 10, 9);
        g.fill(0xFFCCAA);

        // Hat (Straw Hat)
        g.rect(centerX - 7, bottomY - 26, 14, 2); // Brim
        g.rect(centerX - 5, bottomY - 29, 10, 3); // Top
        g.fill(0xDDCC55);

        // Eyes
        g.rect(centerX - 2, bottomY - 20, 2, 2);
        g.rect(centerX + 2, bottomY - 20, 2, 2);
        g.fill(0x000000);
    }

    update(delta) {
        // AI Logic
        if (this.state === 'IDLE') {
            this.idleTimer += delta;

            // Idle animation
            this.animTimer += delta * 0.05;
            this.visual.y = Math.sin(this.animTimer) * 1;

            if (this.idleTimer > 120 + Math.random() * 100) { // Wait 2-4 seconds
                this.pickRandomDestination();
            }
        } else if (this.state === 'WALK') {
            this.move(delta);
        }
    }

    pickRandomDestination() {
        // Pick a random nearby tile
        const range = 3;
        const dx = Math.floor(Math.random() * (range * 2 + 1)) - range;
        const dy = Math.floor(Math.random() * (range * 2 + 1)) - range;

        const newGridX = Math.max(0, Math.min(MAP_WIDTH - 1, this.gridX + dx));
        const newGridY = Math.max(0, Math.min(MAP_HEIGHT - 1, this.gridY + dy));

        this.targetX = newGridX * TILE_SIZE;
        this.targetY = newGridY * TILE_SIZE;

        // Update grid pos
        this.gridX = newGridX;
        this.gridY = newGridY;

        this.state = 'WALK';
        this.isMoving = true;

        // Face direction
        const moveDx = this.targetX - this.x;
        this.setFacing(moveDx);
    }

    move(delta) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Walking animation
        this.animTimer += delta * 0.2;
        this.visual.y = Math.abs(Math.sin(this.animTimer)) * -2;

        if (distance < this.speed * delta) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.state = 'IDLE';
            this.idleTimer = 0;
            this.visual.y = 0;
        } else {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed * delta;
            this.y += Math.sin(angle) * this.speed * delta;
        }
    }
}
