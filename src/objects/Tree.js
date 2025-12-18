import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Tree extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.TREE, x, y);
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Shadow
        g.ellipse(cx, TILE_SIZE - 4, 14, 5);
        g.fill({ color: 0x000000, alpha: 0.35 });

        // Trunk (Detailed with texture)
        g.rect(cx - 5, cy + 2, 10, TILE_SIZE / 2 - 2);
        g.fill(0x8B4513); // Brown
        // Trunk texture lines
        g.rect(cx - 4, cy + 5, 1, 4);
        g.rect(cx + 3, cy + 8, 1, 5);
        g.fill(0x654321); // Dark brown
        // Trunk highlight
        g.rect(cx - 2, cy + 3, 2, TILE_SIZE / 2 - 4);
        g.fill(0xA0522D);

        // Tree Crown - Layered leaves for depth
        // Bottom layer (darkest)
        g.circle(cx, cy - 2, 13);
        g.fill(0x1B5E20); // Dark green
        
        // Middle layer
        g.circle(cx - 3, cy - 5, 11);
        g.circle(cx + 4, cy - 4, 10);
        g.fill(0x2E7D32); // Medium green
        
        // Top layer (brightest)
        g.circle(cx - 1, cy - 8, 9);
        g.circle(cx + 2, cy - 7, 8);
        g.fill(0x43A047); // Light green
        
        // Leaf highlights (sunny spots)
        g.circle(cx - 4, cy - 9, 4);
        g.circle(cx + 5, cy - 6, 3);
        g.fill({ color: 0x66BB6A, alpha: 0.8 }); // Bright green
        
        // Small leaf details
        g.circle(cx - 8, cy - 3, 3);
        g.circle(cx + 8, cy - 2, 3);
        g.circle(cx, cy + 2, 4);
        g.fill(0x2E7D32);
    }
}
