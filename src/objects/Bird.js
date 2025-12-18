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
        
        // Calculate wing flap based on flyTimer
        const wingFlap = Math.abs(Math.sin(this.flyTimer * 2)) * 4;

        // Shadow (smaller and further down to simulate height)
        g.ellipse(cx, cy + 16, 6, 3);
        g.fill({ color: 0x000000, alpha: 0.25 });

        // Tail feathers
        g.moveTo(cx - 6, cy + 2);
        g.lineTo(cx - 10, cy + 5);
        g.lineTo(cx - 8, cy + 2);
        g.lineTo(cx - 10, cy);
        g.closePath();
        g.fill(0x4A90E2); // Darker blue
        
        // Body (detailed with gradient effect)
        g.ellipse(cx, cy, 7, 5);
        g.fill(0x87CEEB); // Sky blue body
        // Belly (lighter)
        g.ellipse(cx, cy + 2, 5, 3);
        g.fill(0xE0F7FF);

        // Wings (animated flapping)
        // Left wing
        g.moveTo(cx - 2, cy - 1);
        g.lineTo(cx - 10, cy - 8 - wingFlap);
        g.lineTo(cx - 8, cy - 6 - wingFlap);
        g.lineTo(cx - 5, cy);
        g.closePath();
        g.fill(0xFFFFFF);
        // Wing details
        g.moveTo(cx - 3, cy - 2);
        g.lineTo(cx - 7, cy - 6 - wingFlap);
        g.stroke({ width: 1, color: 0xCCE5FF });

        // Right wing
        g.moveTo(cx + 2, cy - 1);
        g.lineTo(cx + 10, cy - 8 - wingFlap);
        g.lineTo(cx + 8, cy - 6 - wingFlap);
        g.lineTo(cx + 5, cy);
        g.closePath();
        g.fill(0xFFFFFF);
        // Wing details
        g.moveTo(cx + 3, cy - 2);
        g.lineTo(cx + 7, cy - 6 - wingFlap);
        g.stroke({ width: 1, color: 0xCCE5FF });

        // Head
        g.circle(cx + 3, cy - 3, 4);
        g.fill(0x87CEEB);
        
        // Beak (detailed)
        g.moveTo(cx + 6, cy - 3);
        g.lineTo(cx + 9, cy - 2);
        g.lineTo(cx + 6, cy - 1);
        g.closePath();
        g.fill(0xFFA500); // Orange
        // Beak tip
        g.circle(cx + 9, cy - 2, 1);
        g.fill(0xFF8C00);

        // Eye
        g.circle(cx + 4, cy - 4, 2);
        g.fill(0x000000);
        // Eye shine
        g.circle(cx + 5, cy - 4, 1);
        g.fill(0xFFFFFF);
        
        // Cheek marking
        g.circle(cx + 2, cy - 1, 1);
        g.fill({ color: 0xFF9999, alpha: 0.5 });

        // Feet (small)
        g.moveTo(cx - 1, cy + 4);
        g.lineTo(cx - 2, cy + 6);
        g.moveTo(cx + 1, cy + 4);
        g.lineTo(cx + 2, cy + 6);
        g.stroke({ width: 1, color: 0xFFA500 });
    }

    update(delta) {
        this.flyTimer += delta * 0.2;

        // Bobbing (Flying effect)
        this.visual.y = Math.sin(this.flyTimer) * 5 - 10; // -10 to be above ground

        // Random movement
        if (Math.random() < 0.02) {
            this.targetX = this.x + (Math.random() - 0.5) * 100;
            this.targetY = this.y + (Math.random() - 0.5) * 100;

            // Clamp to map bounds
            const maxX = (60 - 1) * TILE_SIZE; // MAP_WIDTH - 1
            const maxY = (60 - 1) * TILE_SIZE; // MAP_HEIGHT - 1
            this.targetX = Math.max(0, Math.min(this.targetX, maxX));
            this.targetY = Math.max(0, Math.min(this.targetY, maxY));

            // Face direction
            if (this.targetX > this.x) this.visual.scale.x = 1;
            else this.visual.scale.x = -1;
        }

        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            const newX = this.x + (dx / dist) * this.speed * delta;
            const newY = this.y + (dy / dist) * this.speed * delta;

            // Clamp to map bounds
            const maxX = (60 - 1) * TILE_SIZE;
            const maxY = (60 - 1) * TILE_SIZE;
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));
        }
    }
}
