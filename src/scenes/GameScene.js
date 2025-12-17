import { Container, Text, TextStyle } from 'pixi.js';
import { MapSystem } from '../systems/MapSystem';
import { UISystem } from '../systems/UISystem';
import { Player } from '../objects/Player';
import { Tree } from '../objects/Tree';
import { NPC } from '../objects/NPC';
import { GuideNPC } from '../objects/GuideNPC';
import { Enemy } from '../objects/Enemy';
import { ItemDrop } from '../objects/ItemDrop';
import { TILE_SIZE, MAP_WIDTH, ITEM_TYPE } from '../utils/Constants';

export class GameScene extends Container {
    constructor(app) {
        super();
        this.app = app;

        // World Container (for camera and zoom)
        this.worldContainer = new Container();
        this.addChild(this.worldContainer);

        // Layers (added to worldContainer)
        this.backgroundContainer = new Container();
        this.objectContainer = new Container();
        this.entityContainer = new Container();

        this.worldContainer.addChild(this.backgroundContainer);
        this.worldContainer.addChild(this.objectContainer);
        this.worldContainer.addChild(this.entityContainer);

        this.entities = [];
        this.items = []; // Track items separately
        this.targetZoom = 1;

        this.init();
    }

    init() {
        // Map
        this.mapSystem = new MapSystem();
        this.backgroundContainer.addChild(this.mapSystem);

        // Player
        this.player = new Player(5, 5); // Start at grid 5,5
        this.entityContainer.addChild(this.player);
        this.entities.push(this.player);

        // UI System
        this.uiSystem = new UISystem(this.app, this.player);
        this.addChild(this.uiSystem);

        // Spawn Guide NPC
        const guide = new GuideNPC(6, 6);
        this.entityContainer.addChild(guide);
        this.entities.push(guide);

        // Spawn some Trees
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * 20); // Top zone
            const tree = new Tree(x, y);
            this.objectContainer.addChild(tree);
            this.entities.push(tree); // Add to entities for click check
        }

        // Spawn NPC
        const npc = new NPC(8, 8);
        this.entityContainer.addChild(npc);
        this.entities.push(npc);

        // Spawn Enemies
        for (let i = 0; i < 5; i++) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * 20 + 20); // Garden/Forest zone
            const enemy = new Enemy(x, y);
            this.entityContainer.addChild(enemy);
            this.entities.push(enemy);
        }

        // Input handling
        this.backgroundContainer.eventMode = 'static';
        this.backgroundContainer.on('pointerdown', this.onPointerDown.bind(this));

        // Zoom handling
        this.app.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Resize handling
        window.addEventListener('resize', () => {
            if (this.uiSystem) this.uiSystem.resize();
        });
    }

    onWheel(event) {
        event.preventDefault();
        const zoomSensitivity = 0.001;
        this.targetZoom -= event.deltaY * zoomSensitivity;

        // Clamp zoom (0.5x to 3x)
        this.targetZoom = Math.max(0.5, Math.min(this.targetZoom, 3.0));
    }

    spawnItemDrop(x, y, type) {
        const item = new ItemDrop(x, y, type);
        this.entityContainer.addChild(item);
        this.items.push(item);
    }

    onPointerDown(event) {
        const globalPos = event.global;
        const localPos = this.mapSystem.toLocal(globalPos);

        // Check if clicked on an entity
        let clickedEntity = null;
        for (const entity of this.entities) {
            const dx = entity.x - localPos.x;
            const dy = entity.y - localPos.y;
            // Simple hitbox check
            if (dx >= 0 && dx < TILE_SIZE && dy >= 0 && dy < TILE_SIZE) {
                clickedEntity = entity;
                break;
            }
        }

        if (clickedEntity) {
            if (clickedEntity instanceof GuideNPC) {
                const text = clickedEntity.interact();
                this.uiSystem.updateQuest(text);
                return;
            }
            if (clickedEntity instanceof Tree) {
                // Chop tree (Test: Drop wood)
                console.log("Chopped tree!");
                this.spawnItemDrop(clickedEntity.gridX, clickedEntity.gridY + 1, ITEM_TYPE.WOOD);
                // Don't remove tree yet, just spawn item for testing
                return;
            }
        }

        const tile = this.mapSystem.getTileAt(localPos.x, localPos.y);
        if (tile) {
            console.log(`Clicked tile: ${tile.x}, ${tile.y} Type: ${tile.type}`);
            this.player.moveTo(tile.x, tile.y);
        }
    }

    update(delta) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) entity.update(delta);
        });

        // Update items and check pickup
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.update(delta);

            // Check distance to player
            const dx = this.player.x - item.x;
            const dy = this.player.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < item.pickupRange) {
                // Pick up!
                console.log(`Picked up ${item.itemType}`);
                this.entityContainer.removeChild(item);
                this.items.splice(i, 1);
                // TODO: Add to inventory
            }
        }

        // Smooth Zoom
        const zoomSpeed = 0.1;
        this.worldContainer.scale.x += (this.targetZoom - this.worldContainer.scale.x) * zoomSpeed;
        this.worldContainer.scale.y += (this.targetZoom - this.worldContainer.scale.y) * zoomSpeed;

        // Camera follow player
        const screenCenterX = this.app.screen.width / 2;
        const screenCenterY = this.app.screen.height / 2;

        const targetX = screenCenterX - this.player.x * this.worldContainer.scale.x;
        const targetY = screenCenterY - this.player.y * this.worldContainer.scale.y;

        this.worldContainer.x += (targetX - this.worldContainer.x) * 0.1;
        this.worldContainer.y += (targetY - this.worldContainer.y) * 0.1;
    }
}
