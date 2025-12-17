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

        // Shadow
        g.ellipse(cx, cy + 8, 10, 4);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Body
        g.roundRect(cx - 10, cy - 6, 20, 14, 4);
        g.fill(0x8B4513); // SaddleBrown

        // Head
        g.rect(cx - 14, cy - 4, 6, 10);
        g.fill(0x8B4513);

        // Tusks
        g.moveTo(cx - 14, cy + 4);
        g.lineTo(cx - 16, cy + 2);
        g.stroke({ width: 2, color: 0xFFFFFF });

        // Legs
        g.rect(cx - 8, cy + 8, 4, 4);
        g.rect(cx + 4, cy + 8, 4, 4);
        g.fill(0x331100);
    }

    update(delta) {
        if (this.state === 'IDLE') {
            this.idleTimer += delta;
            if (this.idleTimer > 100) {
                this.state = 'MOVE';
                this.targetX = this.x + (Math.random() - 0.5) * 100;
                this.targetY = this.y + (Math.random() - 0.5) * 100;

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
                this.x += (dx / dist) * this.speed * delta;
                this.y += (dy / dist) * this.speed * delta;

                // Hop animation
                this.visual.y = Math.abs(Math.sin(Date.now() / 200)) * -2;
            }
        }
    }
}
