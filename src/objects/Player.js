import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Player extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.PLAYER, x, y);
        this.speed = 3; // pixels per frame
        this.targetX = this.x;
        this.targetY = this.y;
        this.isMoving = false;
        this.isJoystickMoving = false;
        this.joystickVx = 0;
        this.joystickVy = 0;
    }

    draw() {
        const g = this.graphics;
        g.clear();

        // Draw a cute pixel character (Boy)
        // Scale: TILE_SIZE is 32. Character is approx 16x24 centered.

        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Shadow
        g.ellipse(centerX, bottomY, 8, 3);
        g.fill({ color: 0x000000, alpha: 0.3 });

        // Backpack (Brown) - Drawn behind body (first)
        g.rect(centerX - 7, bottomY - 18, 14, 10);
        g.fill(0x8B4513);

        // Legs (Dark Blue Pants)
        g.rect(centerX - 4, bottomY - 8, 3, 8); // Left Leg
        g.rect(centerX + 1, bottomY - 8, 3, 8); // Right Leg
        g.fill(0x222255);
        // Shoes
        g.rect(centerX - 4, bottomY - 2, 3, 2);
        g.rect(centerX + 1, bottomY - 2, 3, 2);
        g.fill(0x111111);

        // Body (Red Shirt)
        g.rect(centerX - 5, bottomY - 16, 10, 9);
        g.fill(0xFF4444);
        // Shirt Detail (Stripe)
        g.rect(centerX - 5, bottomY - 12, 10, 2);
        g.fill(0xCC0000);

        // Head (Skin)
        g.rect(centerX - 5, bottomY - 24, 10, 9);
        g.fill(0xFFCCAA);
        // Blush
        g.rect(centerX - 4, bottomY - 19, 2, 1);
        g.rect(centerX + 2, bottomY - 19, 2, 1);
        g.fill({ color: 0xFFAAAA, alpha: 0.5 });

        // Hair (Brown)
        g.rect(centerX - 6, bottomY - 26, 12, 4); // Top
        g.rect(centerX - 6, bottomY - 24, 2, 6);  // Side L
        g.rect(centerX + 4, bottomY - 24, 2, 6);  // Side R
        g.rect(centerX - 2, bottomY - 26, 4, 2);  // Cowlick
        g.fill(0x553311);

        // Eyes
        g.rect(centerX - 2, bottomY - 20, 2, 2);
        g.rect(centerX + 2, bottomY - 20, 2, 2);
        g.fill(0x000000);
    }

    moveTo(gridX, gridY) {
        this.targetX = gridX * TILE_SIZE;
        this.targetY = gridY * TILE_SIZE;
        this.isMoving = true;
        this.isJoystickMoving = false; // Disable joystick if click-moving

        // Determine direction
        const dx = this.targetX - this.x;
        this.setFacing(dx);
    }

    setJoystickInput(vx, vy) {
        this.joystickVx = vx;
        this.joystickVy = vy;
        this.isJoystickMoving = (vx !== 0 || vy !== 0);
        if (this.isJoystickMoving) {
            this.isMoving = false; // Cancel click-move
        }
    }

    update(delta) {
        // Joystick Movement
        if (this.isJoystickMoving) {
            this.x += this.joystickVx * this.speed * delta;
            this.y += this.joystickVy * this.speed * delta;

            // Walking animation
            this.animTimer += delta * 0.3;
            this.visual.y = Math.abs(Math.sin(this.animTimer)) * -3;

            if (Math.abs(this.joystickVx) > 0.1) {
                this.setFacing(this.joystickVx);
            }
            return;
        }

        if (!this.isMoving) {
            // Idle animation (breathing)
            this.animTimer += delta * 0.05;
            this.visual.y = Math.sin(this.animTimer) * 1;
            return;
        }

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Walking animation (bobbing)
        this.animTimer += delta * 0.3;
        this.visual.y = Math.abs(Math.sin(this.animTimer)) * -3; // Bounce up

        if (distance < this.speed * delta) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            this.visual.y = 0; // Reset height
        } else {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed * delta;
            this.y += Math.sin(angle) * this.speed * delta;

            // Update facing while moving
            if (Math.abs(dx) > 0.1) {
                this.setFacing(dx);
            }
        }
    }
}
