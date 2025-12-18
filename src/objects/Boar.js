import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Boar extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.BOAR, x, y);
        this.speed = 1;
        this.targetX = this.x;
        this.targetY = this.y;
        this.state = 'IDLE';
        this.idleTimer = 0;
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Enhanced Shadow
        g.ellipse(cx, cy + 10, 14, 5);
        g.fill({ color: 0x000000, alpha: 0.35 });

        // Tail (curly)
        g.moveTo(cx + 10, cy - 2);
        g.bezierCurveTo(cx + 12, cy - 4, cx + 13, cy - 2, cx + 12, cy);
        g.stroke({ width: 2, color: 0x6B3410 });

        // Back legs
        g.rect(cx + 2, cy + 8, 4, 5);
        g.rect(cx - 6, cy + 8, 4, 5);
        g.fill(0x5A2D0C); // Dark brown
        // Hooves
        g.rect(cx + 2, cy + 11, 4, 2);
        g.rect(cx - 6, cy + 11, 4, 2);
        g.fill(0x2C1810);

        // Body (Detailed with fur texture)
        g.roundRect(cx - 11, cy - 7, 22, 16, 5);
        g.fill(0x8B4513); // Saddle brown
        
        // Fur texture (darker stripes)
        g.rect(cx - 9, cy - 5, 2, 12);
        g.rect(cx - 5, cy - 6, 2, 13);
        g.rect(cx - 1, cy - 5, 2, 12);
        g.rect(cx + 3, cy - 6, 2, 13);
        g.rect(cx + 7, cy - 4, 2, 11);
        g.fill({ color: 0x6B3410, alpha: 0.4 });
        
        // Belly (lighter)
        g.ellipse(cx, cy + 4, 8, 5);
        g.fill({ color: 0xA0522D, alpha: 0.6 });

        // Front legs
        g.rect(cx + 4, cy + 8, 4, 5);
        g.rect(cx - 8, cy + 8, 4, 5);
        g.fill(0x5A2D0C);
        // Front hooves
        g.rect(cx + 4, cy + 11, 4, 2);
        g.rect(cx - 8, cy + 11, 4, 2);
        g.fill(0x2C1810);

        // Head (Detailed)
        g.roundRect(cx - 15, cy - 5, 7, 11, 2);
        g.fill(0x8B4513);
        // Snout
        g.roundRect(cx - 16, cy + 2, 5, 5, 2);
        g.fill(0xCD853F); // Tan
        // Nostrils
        g.circle(cx - 15, cy + 4, 1);
        g.circle(cx - 13, cy + 4, 1);
        g.fill(0x000000);

        // Ear
        g.moveTo(cx - 13, cy - 6);
        g.lineTo(cx - 11, cy - 8);
        g.lineTo(cx - 10, cy - 5);
        g.closePath();
        g.fill(0x6B3410);

        // Eye
        g.circle(cx - 11, cy - 2, 2);
        g.fill(0x000000);
        g.circle(cx - 10, cy - 2, 1);
        g.fill(0xFFFFFF); // Eye shine

        // Tusks (Enhanced)
        g.moveTo(cx - 15, cy + 5);
        g.lineTo(cx - 18, cy + 3);
        g.lineTo(cx - 17, cy + 6);
        g.closePath();
        g.fill(0xFFFAF0); // Ivory white
        
        g.moveTo(cx - 14, cy + 6);
        g.lineTo(cx - 16, cy + 5);
        g.lineTo(cx - 15, cy + 7);
        g.closePath();
        g.fill(0xFFFAF0);

        // Bristles on back
        for (let i = 0; i < 5; i++) {
            const bx = cx - 8 + i * 4;
            g.moveTo(bx, cy - 7);
            g.lineTo(bx, cy - 9);
            g.stroke({ width: 1, color: 0x5A2D0C });
        }
    }

    update(delta) {
        if (this.state === 'IDLE') {
            this.idleTimer += delta;
            if (this.idleTimer > 100) {
                this.state = 'MOVE';
                this.targetX = this.x + (Math.random() - 0.5) * 100;
                this.targetY = this.y + (Math.random() - 0.5) * 100;

                // Clamp to map bounds
                const maxX = (60 - 1) * TILE_SIZE; // MAP_WIDTH - 1
                const maxY = (60 - 1) * TILE_SIZE; // MAP_HEIGHT - 1
                this.targetX = Math.max(0, Math.min(this.targetX, maxX));
                this.targetY = Math.max(0, Math.min(this.targetY, maxY));

                if (this.targetX > this.x) this.setFacing(1);
                else this.setFacing(-1);
            }
        } else {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                this.state = 'IDLE';
                this.idleTimer = 0;
            } else {
                const newX = this.x + (dx / dist) * this.speed * delta;
                const newY = this.y + (dy / dist) * this.speed * delta;

                // Clamp to map bounds
                const maxX = (60 - 1) * TILE_SIZE;
                const maxY = (60 - 1) * TILE_SIZE;
                this.x = Math.max(0, Math.min(newX, maxX));
                this.y = Math.max(0, Math.min(newY, maxY));

                // Hop animation
                this.visual.y = Math.abs(Math.sin(Date.now() / 200)) * -2;
            }
        }
    }
}
