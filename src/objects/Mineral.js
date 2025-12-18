import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Mineral extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.MINERAL, x, y);
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Enhanced Shadow with glow
        g.ellipse(cx, cy + 10, 12, 5);
        g.fill({ color: 0x000000, alpha: 0.4 });
        
        // Glow effect around crystal
        g.ellipse(cx, cy, 18, 16);
        g.fill({ color: 0x9370DB, alpha: 0.15 });
        g.ellipse(cx, cy, 14, 12);
        g.fill({ color: 0x8A2BE2, alpha: 0.2 });

        // Main Crystal Shape (larger, more detailed)
        g.moveTo(cx, cy - 14);
        g.lineTo(cx + 9, cy - 5);
        g.lineTo(cx + 7, cy + 9);
        g.lineTo(cx - 7, cy + 9);
        g.lineTo(cx - 9, cy - 5);
        g.closePath();
        g.fill(0x8A2BE2); // BlueViolet base

        // Inner darker facets (depth)
        g.moveTo(cx, cy - 14);
        g.lineTo(cx - 5, cy - 2);
        g.lineTo(cx - 7, cy + 9);
        g.closePath();
        g.fill(0x6A1BB2); // Darker violet
        
        g.moveTo(cx + 7, cy + 9);
        g.lineTo(cx + 9, cy - 5);
        g.lineTo(cx + 3, cy);
        g.closePath();
        g.fill(0x6A1BB2);

        // Bright highlight facets
        g.moveTo(cx, cy - 14);
        g.lineTo(cx + 5, cy - 6);
        g.lineTo(cx + 2, cy - 2);
        g.closePath();
        g.fill(0xBA68C8); // Light violet
        
        g.moveTo(cx, cy - 2);
        g.lineTo(cx + 2, cy + 4);
        g.lineTo(cx - 2, cy + 4);
        g.closePath();
        g.fill(0xBA68C8);

        // Very bright highlights (light reflections)
        g.moveTo(cx + 1, cy - 10);
        g.lineTo(cx + 4, cy - 7);
        g.lineTo(cx + 2, cy - 6);
        g.closePath();
        g.fill({ color: 0xE1BEE7, alpha: 0.9 }); // Very light purple
        
        g.circle(cx - 3, cy - 5, 2);
        g.fill({ color: 0xFFFFFF, alpha: 0.6 });
        
        g.circle(cx + 3, cy + 2, 2);
        g.fill({ color: 0xFFFFFF, alpha: 0.5 });

        // Facet lines for more detail
        g.moveTo(cx, cy - 14);
        g.lineTo(cx, cy + 5);
        g.stroke({ width: 1, color: 0xDA70D6 });
        
        g.moveTo(cx - 5, cy - 2);
        g.lineTo(cx + 5, cy - 2);
        g.stroke({ width: 1, color: 0xDA70D6 });
        
        g.moveTo(cx - 7, cy + 9);
        g.lineTo(cx, cy);
        g.lineTo(cx + 7, cy + 9);
        g.stroke({ width: 1, color: 0xDA70D6 });

        // Sparkle effects (animated would be even better)
        g.moveTo(cx - 10, cy - 8);
        g.lineTo(cx - 11, cy - 8);
        g.moveTo(cx - 10.5, cy - 9);
        g.lineTo(cx - 10.5, cy - 7);
        g.stroke({ width: 1, color: 0xFFFFFF });
        
        g.moveTo(cx + 11, cy - 2);
        g.lineTo(cx + 12, cy - 2);
        g.moveTo(cx + 11.5, cy - 3);
        g.lineTo(cx + 11.5, cy - 1);
        g.stroke({ width: 1, color: 0xFFFFFF });
    }
}
