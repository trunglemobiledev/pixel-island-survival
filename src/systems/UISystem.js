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
        this.createPlayerStats();
        this.createQuestBox();
        this.createToolbar();
        this.createInventoryButton();
        this.createInventoryModal();
        this.createJoystick();
        this.createHelpButton();
        this.createHelpModal();
    }

    createPlayerStats() {
        const stats = new Container();

        // HP Bar
        const hpBg = new Graphics();
        hpBg.rect(0, 0, 200, 20);
        hpBg.fill(0x330000);
        hpBg.stroke({ width: 2, color: 0xFFFFFF });
        stats.addChild(hpBg);

        this.hpBar = new Graphics();
        this.hpBar.rect(0, 0, 200, 20);
        this.hpBar.fill(0xFF0000);
        stats.addChild(this.hpBar);

        const hpText = new Text({ text: 'HP', style: { fontSize: 12, fill: 'white', fontWeight: 'bold' } });
        hpText.x = 5;
        hpText.y = 2;
        stats.addChild(hpText);

        // MP Bar
        const mpBg = new Graphics();
        mpBg.rect(0, 25, 200, 20);
        mpBg.fill(0x000033);
        mpBg.stroke({ width: 2, color: 0xFFFFFF });
        stats.addChild(mpBg);

        this.mpBar = new Graphics();
        this.mpBar.rect(0, 25, 200, 20);
        this.mpBar.fill(0x0000FF);
        stats.addChild(this.mpBar);

        const mpText = new Text({ text: 'MP', style: { fontSize: 12, fill: 'white', fontWeight: 'bold' } });
        mpText.x = 5;
        mpText.y = 27;
        stats.addChild(mpText);

        stats.x = 10;
        stats.y = 10;
        this.addChild(stats);
    }

    updateStats() {
        if (this.hpBar) {
            const hpPct = Math.max(0, this.player.hp / this.player.maxHp);
            this.hpBar.scale.x = hpPct;
        }
        if (this.mpBar) {
            const mpPct = Math.max(0, this.player.mp / this.player.maxMp);
            this.mpBar.scale.x = mpPct;
        }
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

            // Item Icon/Text
            const itemText = new Text({ text: '', style: { fontSize: 10, fill: 'white', wordWrap: true, wordWrapWidth: SLOT_SIZE } });
            itemText.anchor.set(0.5);
            itemText.x = SLOT_SIZE / 2;
            itemText.y = SLOT_SIZE / 2;
            slot.addChild(itemText);
            slot.itemText = itemText;

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
        this.updateInventory();
    }

    updateInventory() {
        // Update slots based on player inventory
        for (let i = 0; i < TOOLBAR_SLOTS; i++) {
            const slot = this.slots[i];
            const item = this.player.inventory[i];

            if (item) {
                slot.itemText.text = `${item.type}\nx${item.count}`;
            } else {
                slot.itemText.text = '';
            }
        }
    }

    selectTool(index) {
        this.activeToolIndex = index;
        this.slots.forEach((slot, i) => {
            slot.highlight.visible = i === index;
        });
        console.log('Selected tool:', index);
    }

    createInventoryButton() {
        const btn = new Container();

        // Bag icon background
        const bg = new Graphics();
        bg.roundRect(0, 0, 50, 50, 8);
        bg.fill({ color: 0x654321, alpha: 0.9 }); // Brown
        bg.stroke({ width: 2, color: 0xFFFFFF });
        btn.addChild(bg);

        // Bag icon (simple representation)
        const icon = new Graphics();
        // Bag body
        icon.roundRect(10, 15, 30, 25, 4);
        icon.fill(0x8B4513);
        // Bag handle
        icon.moveTo(15, 15);
        icon.bezierCurveTo(15, 10, 35, 10, 35, 15);
        icon.stroke({ width: 3, color: 0x8B4513 });
        // Bag clasp
        icon.rect(23, 20, 4, 6);
        icon.fill(0xFFD700);
        btn.addChild(icon);

        // Text
        const text = new Text({ 
            text: 'Túi', 
            style: { fontSize: 10, fill: 'white', fontWeight: 'bold' } 
        });
        text.anchor.set(0.5);
        text.x = 25;
        text.y = 45;
        btn.addChild(text);

        // Interaction
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', () => this.toggleInventory());

        // Position: Bottom right area, above toolbar
        btn.x = this.app.screen.width - 70;
        btn.y = this.app.screen.height - SLOT_SIZE - 90;

        this.addChild(btn);
        this.inventoryButton = btn;
    }

    createInventoryModal() {
        const modal = new Container();
        modal.visible = false;

        // Overlay
        const overlay = new Graphics();
        overlay.rect(0, 0, this.app.screen.width, this.app.screen.height);
        overlay.fill({ color: 0x000000, alpha: 0.7 });
        overlay.eventMode = 'static';
        overlay.on('pointerdown', () => this.toggleInventory());
        modal.addChild(overlay);
        this.inventoryOverlay = overlay;

        // Box
        const box = new Container();
        const boxW = 500;
        const boxH = 400;

        const bg = new Graphics();
        bg.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 20);
        bg.fill(0x3E2723);
        bg.stroke({ width: 4, color: 0xFFD700 });
        box.addChild(bg);

        // Title
        const titleStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fontWeight: 'bold',
            fill: '#FFD700',
        });
        const title = new Text({ text: '🎒 TÚI ĐỒ', style: titleStyle });
        title.anchor.set(0.5, 0);
        title.y = -boxH / 2 + 20;
        box.addChild(title);

        // Inventory grid (10 slots in 2 rows of 5)
        this.inventorySlots = [];
        const slotSize = 60;
        const spacing = 10;
        const startX = -((slotSize + spacing) * 5 - spacing) / 2;
        const startY = -boxH / 2 + 80;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                const index = row * 5 + col;
                const slot = new Container();
                slot.x = startX + col * (slotSize + spacing);
                slot.y = startY + row * (slotSize + spacing);

                // Slot background
                const slotBg = new Graphics();
                slotBg.roundRect(0, 0, slotSize, slotSize, 8);
                slotBg.fill({ color: 0x222222, alpha: 0.8 });
                slotBg.stroke({ width: 2, color: 0x666666 });
                slot.addChild(slotBg);

                // Item text
                const itemText = new Text({ 
                    text: '', 
                    style: { 
                        fontSize: 11, 
                        fill: 'white', 
                        align: 'center',
                        wordWrap: true, 
                        wordWrapWidth: slotSize - 4 
                    } 
                });
                itemText.anchor.set(0.5);
                itemText.x = slotSize / 2;
                itemText.y = slotSize / 2;
                slot.addChild(itemText);
                slot.itemText = itemText;

                // Count badge
                const countBadge = new Graphics();
                countBadge.circle(slotSize - 12, slotSize - 12, 10);
                countBadge.fill(0xFF5722);
                slot.addChild(countBadge);
                countBadge.visible = false;
                slot.countBadge = countBadge;

                const countText = new Text({ 
                    text: '', 
                    style: { fontSize: 10, fill: 'white', fontWeight: 'bold' } 
                });
                countText.anchor.set(0.5);
                countText.x = slotSize - 12;
                countText.y = slotSize - 12;
                slot.addChild(countText);
                slot.countText = countText;

                box.addChild(slot);
                this.inventorySlots.push(slot);
            }
        }

        // Close button
        const closeBtn = new Graphics();
        closeBtn.circle(boxW / 2 - 30, -boxH / 2 + 30, 20);
        closeBtn.fill({ color: 0xFF0000, alpha: 0.8 });
        closeBtn.stroke({ width: 2, color: 0xFFFFFF });
        box.addChild(closeBtn);

        const closeText = new Text({ 
            text: 'X', 
            style: { fontSize: 20, fill: 'white', fontWeight: 'bold' } 
        });
        closeText.anchor.set(0.5);
        closeText.x = boxW / 2 - 30;
        closeText.y = -boxH / 2 + 30;
        box.addChild(closeText);

        const closeBtnContainer = new Container();
        closeBtnContainer.addChild(closeBtn);
        closeBtnContainer.addChild(closeText);
        closeBtnContainer.eventMode = 'static';
        closeBtnContainer.cursor = 'pointer';
        closeBtnContainer.on('pointerdown', (e) => {
            e.stopPropagation();
            this.toggleInventory();
        });
        box.addChild(closeBtnContainer);

        // Center box
        box.x = this.app.screen.width / 2;
        box.y = this.app.screen.height / 2;
        modal.addChild(box);
        this.inventoryBox = box;

        this.addChild(modal);
        this.inventoryModal = modal;
    }

    toggleInventory() {
        this.inventoryModal.visible = !this.inventoryModal.visible;
        if (this.inventoryModal.visible) {
            this.updateInventoryModal();
        }
    }

    updateInventoryModal() {
        // Update all inventory slots in the modal
        for (let i = 0; i < this.inventorySlots.length; i++) {
            const slot = this.inventorySlots[i];
            const item = this.player.inventory[i];

            if (item) {
                // Get item emoji/icon
                let icon = '📦';
                if (item.type === 'wood') icon = '🪵';
                else if (item.type === 'stone') icon = '🪨';
                else if (item.type === 'crystal') icon = '💎';
                else if (item.type === 'meat') icon = '🥩';
                else if (item.type === 'leather') icon = '🎒';
                else if (item.type === 'gold') icon = '🪙';

                slot.itemText.text = `${icon}\n${item.type}`;
                slot.countBadge.visible = true;
                slot.countText.text = item.count.toString();
            } else {
                slot.itemText.text = '';
                slot.countBadge.visible = false;
                slot.countText.text = '';
            }
        }
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
        if (this.inventoryButton) {
            this.inventoryButton.x = this.app.screen.width - 70;
            this.inventoryButton.y = this.app.screen.height - SLOT_SIZE - 90;
        }
        if (this.inventoryModal) {
            this.inventoryOverlay.clear();
            this.inventoryOverlay.rect(0, 0, this.app.screen.width, this.app.screen.height);
            this.inventoryOverlay.fill({ color: 0x000000, alpha: 0.7 });
            this.inventoryBox.x = this.app.screen.width / 2;
            this.inventoryBox.y = this.app.screen.height / 2;
        }
        if (this.helpModal) {
            this.helpOverlay.clear();
            this.helpOverlay.rect(0, 0, this.app.screen.width, this.app.screen.height);
            this.helpOverlay.fill({ color: 0x000000, alpha: 0.8 });
            this.helpBox.x = this.app.screen.width / 2;
            this.helpBox.y = this.app.screen.height / 2;
        }
    }
}
