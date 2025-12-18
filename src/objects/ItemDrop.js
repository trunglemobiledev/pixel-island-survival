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
            // Log shape (detailed)
            g.roundRect(cx - 8, cy - 4, 16, 8, 2);
            g.fill(0x8B4513); // Brown
            // Rings
            g.circle(cx - 4, cy, 3);
            g.circle(cx + 4, cy, 3);
            g.stroke({ width: 1, color: 0x654321 });
            // Highlight
            g.roundRect(cx - 6, cy - 2, 12, 4, 1);
            g.fill({ color: 0xA0522D, alpha: 0.6 });
        } else if (this.itemType === ITEM_TYPE.STONE) {
            // Rock shape (detailed)
            g.circle(cx, cy, 7);
            g.fill(0x909090); // Grey
            g.circle(cx - 2, cy - 2, 3);
            g.fill(0xBBBBBB); // Light Grey Highlight
            g.circle(cx + 2, cy + 1, 2);
            g.fill(0x707070); // Dark spot
        } else if (this.itemType === ITEM_TYPE.CRYSTAL) {
            // Crystal (purple gem)
            g.moveTo(cx, cy - 8);
            g.lineTo(cx + 6, cy - 2);
            g.lineTo(cx + 4, cy + 6);
            g.lineTo(cx - 4, cy + 6);
            g.lineTo(cx - 6, cy - 2);
            g.closePath();
            g.fill(0x9C27B0); // Purple
            // Sparkle
            g.circle(cx, cy - 4, 2);
            g.fill({ color: 0xFFFFFF, alpha: 0.7 });
        } else if (this.itemType === ITEM_TYPE.MEAT) {
            // Meat (steak shape)
            g.ellipse(cx, cy, 7, 5);
            g.fill(0xC62828); // Red meat
            g.ellipse(cx - 2, cy, 5, 4);
            g.fill(0xE57373); // Lighter red
            // Bone
            g.rect(cx + 4, cy - 1, 4, 2);
            g.fill(0xFFF8DC); // Bone white
            g.circle(cx + 8, cy, 2);
            g.fill(0xFFF8DC);
        } else if (this.itemType === ITEM_TYPE.LEATHER) {
            // Leather (hide)
            g.roundRect(cx - 6, cy - 5, 12, 10, 2);
            g.fill(0x8D6E63); // Brown leather
            // Texture
            g.moveTo(cx - 4, cy - 3);
            g.lineTo(cx + 4, cy - 3);
            g.moveTo(cx - 4, cy);
            g.lineTo(cx + 4, cy);
            g.moveTo(cx - 4, cy + 3);
            g.lineTo(cx + 4, cy + 3);
            g.stroke({ width: 1, color: 0x6D4C41 });
        } else if (this.itemType === ITEM_TYPE.GOLD) {
            // Coin shape
            g.circle(cx, cy, 6);
            g.fill(0xFFD700); // Gold
            g.circle(cx, cy, 4);
            g.stroke({ width: 2, color: 0xB8860B });
            // Shine
            g.circle(cx - 1, cy - 1, 2);
            g.fill({ color: 0xFFFFAA, alpha: 0.6 });
        } else if (this.itemType === ITEM_TYPE.POTION) {
            // Potion bottle
            g.circle(cx, cy + 2, 5);
            g.fill(0xFF0000); // Red liquid
            g.rect(cx - 2, cy - 6, 4, 6);
            g.fill({ color: 0x88CCFF, alpha: 0.6 }); // Glass
            g.rect(cx - 1, cy - 8, 2, 2);
            g.fill(0x8B4513); // Cork
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
