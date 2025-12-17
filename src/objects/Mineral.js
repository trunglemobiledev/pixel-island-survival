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

        // Shadow
        g.ellipse(cx, cy + 8, 10, 4);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Crystal Shape
        g.moveTo(cx, cy - 12);
        g.lineTo(cx + 8, cy - 4);
        g.lineTo(cx + 6, cy + 8);
        g.lineTo(cx - 6, cy + 8);
        g.lineTo(cx - 8, cy - 4);
        g.closePath();
        g.fill(0x8A2BE2); // BlueViolet

        // Facets
        g.moveTo(cx, cy - 12);
        g.lineTo(cx, cy + 2);
        g.lineTo(cx - 6, cy + 8);
        g.stroke({ width: 1, color: 0xDA70D6 }); // Orchid

        g.moveTo(cx, cy + 2);
        g.lineTo(cx + 6, cy + 8);
        g.stroke({ width: 1, color: 0xDA70D6 });
    }
}
