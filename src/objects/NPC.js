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

        // Enhanced Shadow
        g.ellipse(centerX, bottomY, 10, 4);
        g.fill({ color: 0x000000, alpha: 0.35 });

        // Legs (Detailed Brown Pants)
        g.rect(centerX - 4, bottomY - 8, 3, 8);
        g.rect(centerX + 1, bottomY - 8, 3, 8);
        g.fill(0x6B5D3F); // Brown
        // Pants pockets
        g.rect(centerX - 3, bottomY - 6, 2, 2);
        g.fill(0x554433);

        // Shoes (Simple)
        g.rect(centerX - 5, bottomY - 2, 4, 2);
        g.rect(centerX + 1, bottomY - 2, 4, 2);
        g.fill(0x3E2723);

        // Body (Detailed Green Vest over white shirt)
        // White shirt
        g.rect(centerX - 5, bottomY - 16, 10, 9);
        g.fill(0xECEFF1); // Light grey/white
        // Vest
        g.rect(centerX - 5, bottomY - 16, 10, 7);
        g.fill(0x4CAF50); // Green
        // Vest details
        g.rect(centerX - 4, bottomY - 15, 3, 5);
        g.rect(centerX + 1, bottomY - 15, 3, 5);
        g.fill(0x388E3C); // Darker green
        // Buttons
        g.circle(centerX - 2, bottomY - 13, 1);
        g.circle(centerX - 2, bottomY - 11, 1);
        g.fill(0x795548); // Brown buttons

        // Arms
        g.rect(centerX - 7, bottomY - 14, 2, 6);
        g.rect(centerX + 5, bottomY - 14, 2, 6);
        g.fill(0x4CAF50);
        // Hands
        g.rect(centerX - 7, bottomY - 8, 2, 2);
        g.rect(centerX + 5, bottomY - 8, 2, 2);
        g.fill(0xFFCCAA);

        // Head (Detailed Skin)
        g.rect(centerX - 5, bottomY - 24, 10, 9);
        g.fill(0xFFCCAA);
        // Neck
        g.rect(centerX - 2, bottomY - 16, 4, 2);
        g.fill(0xFFCCAA);

        // Straw Hat (Detailed)
        // Brim
        g.ellipse(centerX, bottomY - 26, 8, 4);
        g.fill(0xF4E4C1); // Light straw
        g.rect(centerX - 7, bottomY - 27, 14, 2);
        g.fill(0xE8D4A0); // Straw color
        // Crown
        g.roundRect(centerX - 5, bottomY - 31, 10, 5, 2);
        g.fill(0xE8D4A0);
        // Hat band
        g.rect(centerX - 5, bottomY - 27, 10, 2);
        g.fill(0xA0522D); // Brown band
        // Hat texture
        g.moveTo(centerX - 4, bottomY - 30);
        g.lineTo(centerX + 4, bottomY - 30);
        g.moveTo(centerX - 4, bottomY - 28);
        g.lineTo(centerX + 4, bottomY - 28);
        g.stroke({ width: 1, color: 0xD4C090 });

        // Face Details
        // Eyes
        g.rect(centerX - 3, bottomY - 21, 2, 2);
        g.rect(centerX + 1, bottomY - 21, 2, 2);
        g.fill(0xFFFFFF);
        g.rect(centerX - 2, bottomY - 20, 1, 1);
        g.rect(centerX + 2, bottomY - 20, 1, 1);
        g.fill(0x000000);
        
        // Friendly smile
        g.rect(centerX - 2, bottomY - 18, 4, 1);
        g.fill(0x885555);
        g.rect(centerX - 3, bottomY - 19, 1, 1);
        g.rect(centerX + 2, bottomY - 19, 1, 1);
        g.fill(0x885555);

        // Eyebrows
        g.rect(centerX - 4, bottomY - 22, 3, 1);
        g.rect(centerX + 1, bottomY - 22, 3, 1);
        g.fill(0x8B7355);
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
            const newX = this.x + Math.cos(angle) * this.speed * delta;
            const newY = this.y + Math.sin(angle) * this.speed * delta;

            // Clamp to map bounds
            const maxX = (60 - 1) * TILE_SIZE;
            const maxY = (60 - 1) * TILE_SIZE;
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));
        }
    }
}
