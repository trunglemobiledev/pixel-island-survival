import { Container, Graphics } from 'pixi.js';
import { TILE_SIZE } from '../utils/Constants';

export class Entity extends Container {
    constructor(type, x, y) {
        super();
        this.type = type;
        this.gridX = x;
        this.gridY = y;

        // Set pixel position based on grid
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;

        // Visual container for flipping/animating
        this.visual = new Container();
        this.addChild(this.visual);

        this.graphics = new Graphics();
        this.visual.addChild(this.graphics);

        // Stats
        this.maxHp = 100;
        this.hp = this.maxHp;

        this.facing = 1; // 1: Right, -1: Left
        this.animTimer = 0;

        this.draw();
    }

    draw() {
        // Override in subclasses
        this.graphics.rect(0, 0, TILE_SIZE, TILE_SIZE);
        this.graphics.fill(0xFFFFFF);
    }

    update(delta) {
        // Override in subclasses
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        this.drawHealthBar();
        return this.hp <= 0;
    }

    drawHealthBar() {
        // Remove old bar if exists (simple way, or just redraw on top)
        // Ideally we have a separate container for UI elements attached to entity
        if (!this.hpBar) {
            this.hpBar = new Graphics();
            this.addChild(this.hpBar);
        }

        this.hpBar.clear();
        if (this.hp < this.maxHp) {
            const width = TILE_SIZE;
            const height = 4;
            const y = -8;

            // Background
            this.hpBar.rect(0, y, width, height);
            this.hpBar.fill(0x000000);

            // Health
            const pct = this.hp / this.maxHp;
            this.hpBar.rect(0, y, width * pct, height);
            this.hpBar.fill(0x00FF00);
        }
    }

    setFacing(dir) {
        if (dir !== 0) {
            this.facing = dir > 0 ? 1 : -1;
            this.visual.scale.x = this.facing;
            // Fix position when flipped (since pivot is 0,0 usually)
            if (this.facing === -1) {
                this.visual.x = TILE_SIZE;
            } else {
                this.visual.x = 0;
            }
        }
    }
}
