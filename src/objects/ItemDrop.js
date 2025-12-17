import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE, ITEM_TYPE } from '../utils/Constants';

export class ItemDrop extends Entity {
    constructor(x, y, itemType) {
        super(ENTITY_TYPE.ITEM_DROP, x, y);
        this.itemType = itemType;
        this.floatTimer = Math.random() * 100;
        this.pickupRange = 20; // pixels

        // Random slight offset from center
        this.visual.x = (Math.random() - 0.5) * 10;
        this.visual.y = (Math.random() - 0.5) * 10;
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const cx = TILE_SIZE / 2;
        const cy = TILE_SIZE / 2;

        // Shadow
        g.ellipse(cx, cy + 8, 6, 3);
        g.fill({ color: 0x000000, alpha: 0.3 });

        if (this.itemType === ITEM_TYPE.WOOD) {
            // Log shape
            g.roundRect(cx - 8, cy - 4, 16, 8, 2);
            g.fill(0x8B4513); // Brown
            g.roundRect(cx - 6, cy - 2, 12, 4, 1);
            g.fill(0xA0522D); // Lighter Brown
        } else if (this.itemType === ITEM_TYPE.STONE) {
            // Rock shape
            g.circle(cx, cy, 6);
            g.fill(0x808080); // Grey
            g.circle(cx - 2, cy - 2, 2);
            g.fill(0xA9A9A9); // Light Grey Highlight
        } else if (this.itemType === ITEM_TYPE.GOLD) {
            // Coin shape
            g.circle(cx, cy, 5);
            g.fill(0xFFD700); // Gold
            g.circle(cx, cy, 3);
            g.stroke({ width: 1, color: 0xB8860B });
        } else if (this.itemType === ITEM_TYPE.POTION) {
            // Potion bottle
            g.circle(cx, cy + 2, 5);
            g.fill(0xFF0000); // Red liquid
            g.rect(cx - 2, cy - 6, 4, 6);
            g.fill(0xFFFFFF); // Glass neck
        } else if (this.itemType === ITEM_TYPE.WEAPON_SWORD) {
            // Sword
            g.moveTo(cx - 6, cy + 6);
            g.lineTo(cx + 6, cy - 6);
            g.stroke({ width: 3, color: 0xCCCCCC }); // Blade

            g.moveTo(cx - 4, cy + 4);
            g.lineTo(cx - 8, cy + 8);
            g.stroke({ width: 3, color: 0x8B4513 }); // Handle

            g.moveTo(cx - 2, cy + 2);
            g.lineTo(cx - 6, cy + 6);
            g.stroke({ width: 1, color: 0xFFD700 }); // Hilt
        }
    }

    update(delta) {
        // Floating animation
        this.floatTimer += delta * 0.1;
        this.visual.y = Math.sin(this.floatTimer) * 3;
    }
}
