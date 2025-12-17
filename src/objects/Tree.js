import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Tree extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.TREE, x, y);
    }

    draw() {
        const g = this.graphics;
        g.clear();

        // Tree visual: Green circle
        g.circle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2 - 2);
        g.fill(0x228B22); // Forest Green

        // Trunk
        g.rect(TILE_SIZE / 2 - 4, TILE_SIZE / 2, 8, TILE_SIZE / 2);
        g.fill(0x8B4513); // Saddle Brown
    }
}
