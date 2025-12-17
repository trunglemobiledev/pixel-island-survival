import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Bird extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.BIRD, x, y);
        this.speed = 2;
        this.flyTimer = Math.random() * 100;
        this.targetX = this.x;
        this.targetY = this.y;
        this.state = 'FLY';
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Shadow (smaller and further down to simulate height)
        g.ellipse(cx, cy + 15, 4, 2);
        g.fill({ color: 0x000000, alpha: 0.2 });

        // Body
        g.ellipse(cx, cy, 6, 4);
        g.fill(0x87CEEB); // SkyBlue

        // Wings
        g.moveTo(cx - 2, cy - 2);
        g.lineTo(cx - 8, cy - 6);
        g.lineTo(cx - 4, cy);
        g.fill(0xFFFFFF);

        g.moveTo(cx + 2, cy - 2);
        g.lineTo(cx + 8, cy - 6);
        g.lineTo(cx + 4, cy);
        g.fill(0xFFFFFF);

        // Beak
        g.moveTo(cx + 4, cy);
        g.lineTo(cx + 8, cy + 2);
        g.lineTo(cx + 4, cy + 4);
        g.fill(0xFFA500); // Orange
    }

    update(delta) {
        this.flyTimer += delta * 0.2;

        // Bobbing (Flying effect)
        this.visual.y = Math.sin(this.flyTimer) * 5 - 10; // -10 to be above ground

        // Random movement
        if (Math.random() < 0.02) {
            this.targetX = this.x + (Math.random() - 0.5) * 100;
            this.targetY = this.y + (Math.random() - 0.5) * 100;

            // Face direction
            if (this.targetX > this.x) this.visual.scale.x = 1;
            else this.visual.scale.x = -1;
        }

        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            this.x += (dx / dist) * this.speed * delta;
            this.y += (dy / dist) * this.speed * delta;
        }
    }
}
