import { Container, Text, TextStyle } from 'pixi.js';
import { MapSystem } from '../systems/MapSystem';
import { UISystem } from '../systems/UISystem';
import { Player } from '../objects/Player';
import { Tree } from '../objects/Tree';
import { Stone } from '../objects/Stone';
import { Mineral } from '../objects/Mineral';
import { NPC } from '../objects/NPC';
import { GuideNPC } from '../objects/GuideNPC';
import { Enemy } from '../objects/Enemy';
import { Bird } from '../objects/Bird';
import { Boar } from '../objects/Boar';
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
        this.player = new Player(10, 10); // Start at grid 10,10
        this.entityContainer.addChild(this.player);
        this.entities.push(this.player);

        // UI System
        this.uiSystem = new UISystem(this.app, this.player);
        this.addChild(this.uiSystem);

        // Spawn Guide NPC
        const guide = new GuideNPC(12, 12);
        this.entityContainer.addChild(guide);
        this.entities.push(guide);
        this.guideNPC = guide;

        // Spawn Resources (Trees, Stones, Minerals)
        for (let i = 0; i < 50; i++) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * MAP_WIDTH);

            const rand = Math.random();
            let entity;
            if (rand < 0.6) entity = new Tree(x, y);
            else if (rand < 0.8) entity = new Stone(x, y);
            else entity = new Mineral(x, y);

            this.objectContainer.addChild(entity);
            this.entities.push(entity);
        }

        // Spawn Animals (Birds, Boars)
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * MAP_WIDTH);

            const rand = Math.random();
            let entity;
            if (rand < 0.5) entity = new Bird(x, y);
            else entity = new Boar(x, y);

            this.entityContainer.addChild(entity);
            this.entities.push(entity);
        }

        // Spawn Enemies
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * MAP_WIDTH);
            const enemy = new Enemy(x, y);
            this.entityContainer.addChild(enemy);
            this.entities.push(enemy);
        }

        // Spawn Random Weapon Drop
        this.spawnItemDrop(15, 15, ITEM_TYPE.WEAPON_SWORD);

        // Input handling
        this.backgroundContainer.eventMode = 'static';
        this.backgroundContainer.on('pointerdown', this.onPointerDown.bind(this));

        // Zoom handling
        this.app.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Resize handling
        window.addEventListener('resize', () => {
            if (this.uiSystem) this.uiSystem.resize();
        });

        // Keyboard handling (WASD + Arrows + Action)
        this.keys = {
            w: false, a: false, s: false, d: false,
            arrowup: false, arrowleft: false, arrowdown: false, arrowright: false,
            k: false
        };
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(e) {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = true;

            if (key === 'k') {
                this.performDirectionalAttack();
            } else {
                this.updatePlayerInput();
            }
        }
    }

    onKeyUp(e) {
        const key = e.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = false;
            this.updatePlayerInput();
        }
    }

    updatePlayerInput() {
        let vx = 0;
        let vy = 0;

        if (this.keys.a || this.keys.arrowleft) vx -= 1;
        if (this.keys.d || this.keys.arrowright) vx += 1;
        if (this.keys.w || this.keys.arrowup) vy -= 1;
        if (this.keys.s || this.keys.arrowdown) vy += 1;

        // Normalize diagonal
        if (vx !== 0 && vy !== 0) {
            const len = Math.sqrt(vx * vx + vy * vy);
            vx /= len;
            vy /= len;
        }

        this.player.setInput(vx, vy);
    }

    onWheel(event) {
        event.preventDefault();
        const zoomSensitivity = 0.001;
        this.targetZoom -= event.deltaY * zoomSensitivity;

        // Clamp zoom (0.5x to 3x)
        this.targetZoom = Math.max(0.5, Math.min(this.targetZoom, 3.0));
    }

    spawnItemDrop(x, y, type) {
        // x, y are grid coords here
        const item = new ItemDrop(x * TILE_SIZE, y * TILE_SIZE, type);
        this.entityContainer.addChild(item);
        this.items.push(item);
    }

    onPointerDown(event) {
        const globalPos = event.global;
        const localPos = this.mapSystem.toLocal(globalPos);

        // Attack towards the click
        this.player.attack(localPos.x, localPos.y);
        this.checkAttackHit(localPos.x, localPos.y);
    }

    performDirectionalAttack() {
        // Attack in front of player
        const range = 40;
        const targetX = this.player.x + this.player.facing * range;
        const targetY = this.player.y; // Center Y

        this.player.attack(targetX, targetY);
        this.checkAttackHit(targetX, targetY, true); // true = use hitbox area
    }

    checkAttackHit(targetX, targetY, isArea = false) {
        // Check if we hit an entity
        let hitEntity = null;

        if (isArea) {
            // Check entities within a box in front of player
            const hitBoxSize = 40;
            const halfSize = hitBoxSize / 2;

            // Simple AABB check
            for (const entity of this.entities) {
                if (entity === this.player) continue;

                // Entity center (approx)
                const ex = entity.x + TILE_SIZE / 2;
                const ey = entity.y + TILE_SIZE / 2;

                if (Math.abs(ex - targetX) < halfSize && Math.abs(ey - targetY) < halfSize) {
                    hitEntity = entity;
                    break; // Hit first found
                }
            }
        } else {
            // Precise click check
            for (const entity of this.entities) {
                if (entity === this.player) continue;
                const dx = entity.x - targetX;
                const dy = entity.y - targetY;
                // Simple hitbox check (click must be inside tile)
                if (dx <= 0 && dx > -TILE_SIZE && dy <= 0 && dy > -TILE_SIZE) {
                    hitEntity = entity;
                    break;
                }
            }
        }

        if (hitEntity) {
            this.handleEntityInteraction(hitEntity);
        } else if (!isArea) {
            // Only splash if clicking specifically on water and missed entity
            const tile = this.mapSystem.getTileAt(targetX, targetY);
            if (tile && tile.type === 1) {
                console.log("Splash!");
            }
        }
    }

    handleEntityInteraction(entity) {
        // Check distance (Melee range)
        const dist = Math.sqrt(Math.pow(this.player.x - entity.x, 2) + Math.pow(this.player.y - entity.y, 2));
        if (dist > TILE_SIZE * 3) { // Increased range slightly
            return;
        }

        if (entity instanceof GuideNPC) {
            const text = entity.interact();
            this.uiSystem.updateQuest(text);
            return;
        }
        if (entity instanceof Tree) {
            console.log("Chopped tree!");
            this.spawnItemDrop(entity.gridX, entity.gridY, ITEM_TYPE.WOOD);
            entity.visual.x = (Math.random() - 0.5) * 5;
            setTimeout(() => entity.visual.x = 0, 100);
            return;
        }
        if (entity instanceof Stone) {
            console.log("Mined stone!");
            this.spawnItemDrop(entity.gridX, entity.gridY, ITEM_TYPE.STONE);
            entity.visual.alpha = 0.5;
            setTimeout(() => entity.visual.alpha = 1, 100);
            return;
        }
        if (entity instanceof Mineral) {
            console.log("Mined mineral!");
            this.spawnItemDrop(entity.gridX, entity.gridY, ITEM_TYPE.GOLD);
            entity.visual.alpha = 0.5;
            setTimeout(() => entity.visual.alpha = 1, 100);
            return;
        }
        if (entity instanceof Bird || entity instanceof Boar || entity instanceof Enemy) {
            console.log("Attacked animal!");
            entity.graphics.tint = 0xFF0000;
            setTimeout(() => entity.graphics.tint = 0xFFFFFF, 200);

            const angle = Math.atan2(entity.y - this.player.y, entity.x - this.player.x);
            entity.x += Math.cos(angle) * 20;
            entity.y += Math.sin(angle) * 20;
            return;
        }
    }

    update(delta) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) entity.update(delta);
        });

        // Check Guide NPC Proximity
        if (this.guideNPC) {
            const dx = this.player.x - this.guideNPC.x;
            const dy = this.player.y - this.guideNPC.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < TILE_SIZE * 3) { // Within 3 tiles
                this.uiSystem.updateQuest(this.guideNPC.getCurrentDialogue());
            }
        }

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
