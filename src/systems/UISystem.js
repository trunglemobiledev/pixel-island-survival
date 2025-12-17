import { Container, Graphics, Text, TextStyle, Sprite } from 'pixi.js';
import nipplejs from 'nipplejs';
import { TOOLBAR_SLOTS, SLOT_SIZE, TOOLS } from '../utils/Constants';

export class UISystem extends Container {
    constructor(app, player) {
        super();
        this.app = app;
        this.player = player;

        this.questBox = null;
        this.toolbar = null;
        this.joystickManager = null;
        this.activeToolIndex = 0;

        this.init();
    }

    init() {
        this.createQuestBox();
        this.createToolbar();
        this.createJoystick();
        this.createHelpButton();
        this.createHelpModal();
    }

    createQuestBox() {
        const box = new Container();

        // Background
        const bg = new Graphics();
        bg.roundRect(0, 0, 250, 100, 10);
        bg.fill({ color: 0x000000, alpha: 0.6 });
        bg.stroke({ width: 2, color: 0xFFFFFF });
        box.addChild(bg);

        // Title
        const titleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontWeight: 'bold',
            fill: '#FFD700', // Gold
        });
        const title = new Text({ text: 'Nhiệm Vụ', style: titleStyle });
        title.x = 10;
        title.y = 10;
        box.addChild(title);

        // Content
        const contentStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#FFFFFF',
            wordWrap: true,
            wordWrapWidth: 230,
        });
        this.questText = new Text({ text: 'Hãy nói chuyện với NPC Hướng dẫn.', style: contentStyle });
        this.questText.x = 10;
        this.questText.y = 35;
        box.addChild(this.questText);

        // Position: Top Right
        box.x = this.app.screen.width - 260;
        box.y = 10;

        this.addChild(box);
        this.questBox = box;
    }

    updateQuest(text) {
        this.questText.text = text;
    }

    createToolbar() {
        const bar = new Container();
        const startX = (this.app.screen.width - (TOOLBAR_SLOTS * SLOT_SIZE + (TOOLBAR_SLOTS - 1) * 10)) / 2;

        this.slots = [];

        const toolIcons = [TOOLS.HAND, TOOLS.HOE, TOOLS.AXE, TOOLS.SWORD, TOOLS.WATERING_CAN];

        for (let i = 0; i < TOOLBAR_SLOTS; i++) {
            const slot = new Container();
            slot.x = i * (SLOT_SIZE + 10);

            // Slot BG
            const bg = new Graphics();
            bg.rect(0, 0, SLOT_SIZE, SLOT_SIZE);
            bg.fill({ color: 0x333333, alpha: 0.8 });
            bg.stroke({ width: 2, color: 0x888888 });
            slot.addChild(bg);

            // Selection Highlight (Hidden by default)
            const highlight = new Graphics();
            highlight.rect(-2, -2, SLOT_SIZE + 4, SLOT_SIZE + 4);
            highlight.stroke({ width: 3, color: 0xFFFF00 });
            highlight.visible = i === 0;
            slot.addChild(highlight);
            slot.highlight = highlight;

            // Tool Text (Placeholder for Icon)
            const text = new Text({ text: toolIcons[i] || '', style: { fontSize: 10, fill: 'white' } });
            text.anchor.set(0.5);
            text.x = SLOT_SIZE / 2;
            text.y = SLOT_SIZE / 2;
            slot.addChild(text);

            // Interaction
            slot.eventMode = 'static';
            slot.on('pointerdown', () => this.selectTool(i));

            bar.addChild(slot);
            this.slots.push(slot);
        }

        // Position: Bottom Center
        bar.x = startX;
        bar.y = this.app.screen.height - SLOT_SIZE - 20;

        this.addChild(bar);
        this.toolbar = bar;
    }

    selectTool(index) {
        this.activeToolIndex = index;
        this.slots.forEach((slot, i) => {
            slot.highlight.visible = i === index;
        });
        console.log('Selected tool:', index);
        // TODO: Notify player of tool change
    }

    createJoystick() {
        // Nipple.js creates a DOM element, not a Pixi object.
        // We need to append it to the body or a container div.

        const zone = document.createElement('div');
        zone.id = 'joystick-zone';
        zone.style.position = 'absolute';
        zone.style.bottom = '50px';
        zone.style.left = '50px';
        zone.style.width = '150px';
        zone.style.height = '150px';
        zone.style.zIndex = '1000'; // Above canvas
        // zone.style.background = 'rgba(255, 0, 0, 0.1)'; // Debug
        document.body.appendChild(zone);

        this.joystickManager = nipplejs.create({
            zone: zone,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
            size: 100
        });

        this.joystickManager.on('move', (evt, data) => {
            if (data.vector) {
                this.player.setInput(data.vector.x, -data.vector.y); // NippleJS Y is inverted relative to screen usually? No, up is positive Y in math, but screen is negative Y.
                // Actually NippleJS vector: up is Y=1, down is Y=-1.
                // Pixi: up is Y negative, down is Y positive.
                // So we need to invert Y.
            }
        });

        this.joystickManager.on('end', () => {
            this.player.setInput(0, 0);
        });
    }

    createHelpButton() {
        const btn = new Container();

        // Circle BG
        const bg = new Graphics();
        bg.circle(0, 0, 20);
        bg.fill({ color: 0x000000, alpha: 0.6 });
        bg.stroke({ width: 2, color: 0xFFFFFF });
        btn.addChild(bg);

        // Text "?"
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#FFFFFF',
        });
        const text = new Text({ text: '?', style });
        text.anchor.set(0.5);
        btn.addChild(text);

        // Interaction
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', () => this.toggleHelp());

        // Position: Top Left (below title)
        btn.x = 30;
        btn.y = 80; // Below the "Pixel Island" title

        this.addChild(btn);
        this.helpButton = btn;
    }

    createHelpModal() {
        const modal = new Container();
        modal.visible = false;

        // Overlay
        const overlay = new Graphics();
        overlay.rect(0, 0, this.app.screen.width, this.app.screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.8 });
        overlay.eventMode = 'static'; // Block clicks below
        overlay.on('pointerdown', () => this.toggleHelp()); // Click outside to close
        modal.addChild(overlay);
        this.helpOverlay = overlay;

        // Box
        const box = new Container();
        const boxW = 400;
        const boxH = 300;

        const bg = new Graphics();
        bg.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);
        bg.fill(0x222222);
        bg.stroke({ width: 4, color: 0xFFFFFF });
        box.addChild(bg);

        // Content
        const titleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#FFD700',
        });
        const title = new Text({ text: 'HƯỚNG DẪN CHƠI', style: titleStyle });
        title.anchor.set(0.5, 0);
        title.y = -boxH / 2 + 20;
        box.addChild(title);

        const bodyStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#FFFFFF',
            wordWrap: true,
            wordWrapWidth: boxW - 40,
            lineHeight: 24,
        });

        const guideText =
            `1. Di chuyển: Dùng Joystick (Góc trái dưới) hoặc phím WASD / Mũi tên.
2. Tấn công: Click chuột vào mục tiêu.
3. Zoom: Lăn chuột giữa.
4. Tương tác: Click vào NPC hoặc Cây cối.
5. Công cụ: Chọn ở thanh bên dưới.
6. Mục tiêu: Sinh tồn và xây dựng nông trại!

Click bất kỳ đâu để đóng.`;

        const body = new Text({ text: guideText, style: bodyStyle });
        body.anchor.set(0.5, 0);
        body.y = -boxH / 2 + 70;
        box.addChild(body);

        // Center box
        box.x = this.app.screen.width / 2;
        box.y = this.app.screen.height / 2;
        modal.addChild(box);
        this.helpBox = box;

        this.addChild(modal);
        this.helpModal = modal;
    }

    toggleHelp() {
        this.helpModal.visible = !this.helpModal.visible;
    }

    resize() {
        // Update positions on resize
        if (this.questBox) {
            this.questBox.x = this.app.screen.width - 260;
        }
        if (this.toolbar) {
            this.toolbar.x = (this.app.screen.width - (TOOLBAR_SLOTS * SLOT_SIZE + (TOOLBAR_SLOTS - 1) * 10)) / 2;
            this.toolbar.y = this.app.screen.height - SLOT_SIZE - 20;
        }
        if (this.helpModal) {
            this.helpOverlay.width = this.app.screen.width;
            this.helpOverlay.height = this.app.screen.height;
            this.helpBox.x = this.app.screen.width / 2;
            this.helpBox.y = this.app.screen.height / 2;
        }
    }
}
