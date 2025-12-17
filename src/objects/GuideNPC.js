import { NPC } from './NPC';
import { TILE_SIZE } from '../utils/Constants';
import { Text, TextStyle } from 'pixi.js';

export class GuideNPC extends NPC {
    constructor(x, y) {
        super(x, y);
        this.dialogue = [
            "Welcome to Pixel Island!",
            "Use the joystick to move.",
            "Select tools from the toolbar.",
            "Survive the night!"
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
        const text = this.dialogue[this.dialogueIndex];
        this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogue.length;
        return text;
    }

    draw() {
        super.draw();
        // Add something distinctive, maybe a different hat color?
        // Accessing graphics from super might be tricky if I didn't expose it well, 
        // but NPC.draw() clears graphics.
        // Let's just override draw completely or trust the base NPC look for now.
        // Actually, let's make him wear a Red Hat.

        const g = this.graphics;
        // Re-draw base NPC but change hat color
        // Copy-paste from NPC.js but change hat color

        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Shadow
        g.ellipse(centerX, bottomY, 8, 3);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Legs
        g.rect(centerX - 4, bottomY - 8, 3, 8);
        g.rect(centerX + 1, bottomY - 8, 3, 8);
        g.fill(0x554433);

        // Body
        g.rect(centerX - 5, bottomY - 16, 10, 9);
        g.fill(0x44AA44);

        // Head
        g.rect(centerX - 5, bottomY - 24, 10, 9);
        g.fill(0xFFCCAA);

        // Hat (Red Hat for Guide)
        g.rect(centerX - 7, bottomY - 26, 14, 2); // Brim
        g.rect(centerX - 5, bottomY - 29, 10, 3); // Top
        g.fill(0xFF0000); // Red

        // Eyes
        g.rect(centerX - 2, bottomY - 20, 2, 2);
        g.rect(centerX + 2, bottomY - 20, 2, 2);
        g.fill(0x000000);
    }
}
