import { NPC } from './NPC';
import { TILE_SIZE } from '../utils/Constants';
import { Text, TextStyle } from 'pixi.js';

export class GuideNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.dialogue = [
            "Chào mừng đến với Đảo Pixel!",
            "Dùng Joystick để di chuyển.",
            "Chọn công cụ ở thanh bên dưới.",
            "Hãy sống sót qua màn đêm!"
        ];
        this.dialogueIndex = 0;
        this.showNameTag();
    }

    showNameTag() {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 10,
            fill: '#FFFF00',
            stroke: { color: '#000000', width: 2 }
        });
        const text = new Text({ text: 'Guide', style });
        text.anchor.set(0.5);
        text.y = -10;
        text.x = TILE_SIZE / 2;
        this.visual.addChild(text);
    }

    interact() {
        // Advance dialogue on click
        this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogue.length;
        return this.dialogue[this.dialogueIndex];
    }

    getCurrentDialogue() {
        return this.dialogue[this.dialogueIndex];
    }

    update(delta) {
        // Override NPC update to disable wandering
        // Just idle animation
        this.animTimer += delta * 0.05;
        this.visual.y = Math.sin(this.animTimer) * 1;
    }

    draw() {
        const g = this.graphics;
        g.clear();

        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Enhanced Shadow
        g.ellipse(centerX, bottomY, 10, 4);
        g.fill({ color: 0x000000, alpha: 0.35 });

        // Legs (Purple Pants - Special character)
        g.rect(centerX - 4, bottomY - 8, 3, 8);
        g.rect(centerX + 1, bottomY - 8, 3, 8);
        g.fill(0x5E35B1); // Purple

        // Shoes (Gold/Yellow)
        g.rect(centerX - 5, bottomY - 2, 4, 2);
        g.rect(centerX + 1, bottomY - 2, 4, 2);
        g.fill(0xFFD700); // Gold

        // Body (Magical Blue Robe)
        // Inner white shirt
        g.rect(centerX - 5, bottomY - 16, 10, 9);
        g.fill(0xF5F5F5);
        // Blue robe/vest
        g.rect(centerX - 6, bottomY - 17, 12, 10);
        g.fill(0x1976D2); // Bright blue
        // Robe trim (gold)
        g.rect(centerX - 6, bottomY - 17, 12, 1);
        g.rect(centerX - 6, bottomY - 8, 12, 1);
        g.fill(0xFFD700);
        // Central design
        g.moveTo(centerX, bottomY - 15);
        g.lineTo(centerX - 2, bottomY - 12);
        g.lineTo(centerX, bottomY - 10);
        g.lineTo(centerX + 2, bottomY - 12);
        g.closePath();
        g.fill(0xFFEB3B); // Yellow star
        
        // Arms
        g.rect(centerX - 7, bottomY - 14, 2, 6);
        g.rect(centerX + 5, bottomY - 14, 2, 6);
        g.fill(0x1976D2);
        // Hands with gloves
        g.rect(centerX - 7, bottomY - 8, 2, 2);
        g.rect(centerX + 5, bottomY - 8, 2, 2);
        g.fill(0xFFFFFF); // White gloves

        // Head (Detailed Skin)
        g.rect(centerX - 5, bottomY - 25, 10, 10);
        g.fill(0xFFCCAA);
        // Neck
        g.rect(centerX - 2, bottomY - 16, 4, 2);
        g.fill(0xFFCCAA);
        
        // Beard (small, wise guide)
        g.rect(centerX - 4, bottomY - 17, 8, 3);
        g.fill(0xE0E0E0); // Grey beard

        // Wizard Hat (Red with gold details)
        // Brim
        g.ellipse(centerX, bottomY - 26, 9, 4);
        g.fill(0xB71C1C); // Dark red
        g.rect(centerX - 8, bottomY - 27, 16, 2);
        g.fill(0xD32F2F); // Red
        // Cone
        g.moveTo(centerX - 6, bottomY - 27);
        g.lineTo(centerX, bottomY - 36);
        g.lineTo(centerX + 6, bottomY - 27);
        g.closePath();
        g.fill(0xD32F2F); // Red
        // Gold trim on hat
        g.rect(centerX - 6, bottomY - 27, 12, 1);
        g.fill(0xFFD700);
        // Stars on hat
        g.circle(centerX - 2, bottomY - 32, 1);
        g.circle(centerX + 2, bottomY - 30, 1);
        g.circle(centerX, bottomY - 34, 1);
        g.fill(0xFFEB3B); // Yellow stars
        // Hat tip
        g.circle(centerX, bottomY - 36, 2);
        g.fill(0xFFD700);

        // Face Details
        // Eyes (wise and friendly)
        g.rect(centerX - 3, bottomY - 22, 2, 2);
        g.rect(centerX + 1, bottomY - 22, 2, 2);
        g.fill(0xFFFFFF);
        g.rect(centerX - 2, bottomY - 21, 1, 1);
        g.rect(centerX + 2, bottomY - 21, 1, 1);
        g.fill(0x1976D2); // Blue eyes
        // Eye shine
        g.rect(centerX - 2, bottomY - 22, 1, 1);
        g.rect(centerX + 2, bottomY - 22, 1, 1);
        g.fill(0xFFFFFF);
        
        // Smile
        g.rect(centerX - 2, bottomY - 19, 4, 1);
        g.fill(0x885555);
        
        // Rosy cheeks
        g.circle(centerX - 4, bottomY - 20, 1);
        g.circle(centerX + 4, bottomY - 20, 1);
        g.fill({ color: 0xFF9999, alpha: 0.6 });

        // Eyebrows (friendly)
        g.rect(centerX - 4, bottomY - 23, 3, 1);
        g.rect(centerX + 1, bottomY - 23, 3, 1);
        g.fill(0xBDBDBD); // Grey
        
        // Magic sparkles around guide
        g.circle(centerX - 10, bottomY - 15, 1);
        g.circle(centerX + 10, bottomY - 18, 1);
        g.circle(centerX - 8, bottomY - 25, 1);
        g.fill({ color: 0xFFEB3B, alpha: 0.8 });
    }
}
