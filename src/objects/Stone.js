import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Stone extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.STONE, x, y);
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Shadow
        g.ellipse(cx, cy + 10, 12, 5);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Main Rock
        g.moveTo(cx - 10, cy + 8);
        g.lineTo(cx - 12, cy - 2);
        g.lineTo(cx - 5, cy - 10);
        g.lineTo(cx + 8, cy - 8);
        g.lineTo(cx + 12, cy + 5);
        g.lineTo(cx + 5, cy + 10);
        g.closePath();
        g.fill(0x808080); // Grey

        // Highlights
        g.moveTo(cx - 5, cy - 5);
        g.lineTo(cx + 2, cy - 5);
        g.stroke({ width: 2, color: 0xAAAAAA });
    }
}
