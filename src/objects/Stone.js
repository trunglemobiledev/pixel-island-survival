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

        // Enhanced Shadow
        g.ellipse(cx, cy + 11, 14, 6);
        g.fill({ color: 0x000000, alpha: 0.4 });

        // Main Rock (Irregular boulder shape)
        g.moveTo(cx - 11, cy + 9);
        g.lineTo(cx - 13, cy + 2);
        g.lineTo(cx - 10, cy - 5);
        g.lineTo(cx - 4, cy - 11);
        g.lineTo(cx + 4, cy - 10);
        g.lineTo(cx + 9, cy - 6);
        g.lineTo(cx + 13, cy + 3);
        g.lineTo(cx + 10, cy + 8);
        g.lineTo(cx + 4, cy + 11);
        g.lineTo(cx - 4, cy + 10);
        g.closePath();
        g.fill(0x909090); // Light grey

        // Dark shaded areas
        g.moveTo(cx - 11, cy + 9);
        g.lineTo(cx - 13, cy + 2);
        g.lineTo(cx - 10, cy - 5);
        g.lineTo(cx - 8, cy);
        g.lineTo(cx - 7, cy + 8);
        g.closePath();
        g.fill(0x606060); // Dark grey
        
        g.moveTo(cx + 4, cy + 11);
        g.lineTo(cx + 10, cy + 8);
        g.lineTo(cx + 8, cy + 2);
        g.lineTo(cx + 3, cy + 5);
        g.closePath();
        g.fill(0x707070);

        // Highlights (bright spots)
        g.moveTo(cx - 6, cy - 8);
        g.lineTo(cx - 2, cy - 10);
        g.lineTo(cx + 2, cy - 9);
        g.lineTo(cx, cy - 5);
        g.closePath();
        g.fill(0xBBBBBB); // Bright grey
        
        // Small highlight spots
        g.rect(cx - 4, cy - 6, 3, 2);
        g.fill(0xCCCCCC);
        g.rect(cx + 5, cy - 4, 2, 2);
        g.fill(0xAAAAAA);

        // Crack details
        g.moveTo(cx - 3, cy - 2);
        g.lineTo(cx - 1, cy + 2);
        g.lineTo(cx + 1, cy + 5);
        g.stroke({ width: 1, color: 0x404040 });
        
        g.moveTo(cx + 4, cy - 3);
        g.lineTo(cx + 6, cy);
        g.stroke({ width: 1, color: 0x404040 });

        // Moss spots (green accents)
        g.circle(cx - 7, cy + 3, 2);
        g.circle(cx + 3, cy + 6, 2);
        g.fill({ color: 0x4CAF50, alpha: 0.6 });
    }
}
