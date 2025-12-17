import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Enemy extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.ENEMY, x, y);
        this.moveTimer = 0;
        this.baseScaleY = 1;
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Shadow
        g.ellipse(centerX, bottomY, 10, 3);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Slime Body (Purple)
        // Draw a semi-circle/blob shape
        g.moveTo(centerX - 10, bottomY);
        g.bezierCurveTo(centerX - 12, bottomY - 10, centerX - 8, bottomY - 20, centerX, bottomY - 20);
        g.bezierCurveTo(centerX + 8, bottomY - 20, centerX + 12, bottomY - 10, centerX + 10, bottomY);
        g.fill(0xAA44AA);

        // Eyes
        g.circle(centerX - 4, bottomY - 12, 2);
        g.circle(centerX + 4, bottomY - 12, 2);
        g.fill(0xFFFFFF);
        g.circle(centerX - 4, bottomY - 12, 1);
        g.circle(centerX + 4, bottomY - 12, 1);
        g.fill(0x000000);
    }

    update(delta) {
        // Squish animation
        this.moveTimer += delta * 0.1;
        const squish = Math.sin(this.moveTimer) * 0.1;

        this.visual.scale.y = 1 + squish;
        this.visual.scale.x = 1 - squish;

        // Adjust Y to keep bottom fixed
        // Since pivot is top-left (0,0) relative to visual container
        // Actually visual container is at 0,0 of Entity.
        // We need to offset Y so it looks like it's squishing from bottom.
        // Simple hack: just move visual.y slightly
        this.visual.y = (1 - this.visual.scale.y) * TILE_SIZE;
    }
}
