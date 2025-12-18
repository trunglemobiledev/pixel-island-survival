import { Entity } from './Entity';
import { TILE_SIZE, ENTITY_TYPE } from '../utils/Constants';

export class Player extends Entity {
    constructor(x, y) {
        super(ENTITY_TYPE.PLAYER, x, y);
        this.speed = 4; // pixels per frame
        this.targetX = this.x;
        this.targetY = this.y;
        this.isMoving = false;
        this.isInputMoving = false;
        this.inputVx = 0;
        this.inputVy = 0;
        this.isAttacking = false;
        this.attackTimer = 0;

        // Player Stats
        this.maxHp = 100;
        this.hp = 100;
        this.maxMp = 100;
        this.mp = 100;

        // Inventory
        this.inventory = [];
    }

    draw() {
        const g = this.graphics;
        g.clear();

        // Draw a cute pixel character (Boy)
        const centerX = TILE_SIZE / 2;
        const bottomY = TILE_SIZE - 2;

        // Enhanced Shadow with gradient effect
        g.ellipse(centerX, bottomY, 10, 4);
        g.fill({ color: 0x000000, alpha: 0.4 });

        // Backpack (Detailed) - Drawn behind body
        g.rect(centerX - 7, bottomY - 18, 14, 11);
        g.fill(0x8B4513); // Brown
        // Backpack straps
        g.rect(centerX - 4, bottomY - 18, 2, 8);
        g.rect(centerX + 2, bottomY - 18, 2, 8);
        g.fill(0x654321); // Darker brown
        // Backpack pocket detail
        g.rect(centerX - 5, bottomY - 14, 10, 6);
        g.fill(0x654321);
        g.rect(centerX - 4, bottomY - 13, 8, 4);
        g.fill(0x8B4513);

        // Legs (Detailed Blue Jeans)
        g.rect(centerX - 4, bottomY - 8, 3, 8); // Left Leg
        g.rect(centerX + 1, bottomY - 8, 3, 8); // Right Leg
        g.fill(0x3355AA); // Brighter blue
        // Jean pockets
        g.rect(centerX - 3, bottomY - 6, 2, 2);
        g.rect(centerX + 2, bottomY - 6, 2, 2);
        g.fill(0x2244AA);
        
        // Shoes (Detailed Sneakers)
        g.rect(centerX - 5, bottomY - 2, 4, 3); // Left shoe
        g.rect(centerX + 1, bottomY - 2, 4, 3); // Right shoe
        g.fill(0x222222);
        // Shoe soles
        g.rect(centerX - 5, bottomY, 4, 1);
        g.rect(centerX + 1, bottomY, 4, 1);
        g.fill(0x555555);
        // Shoe laces
        g.rect(centerX - 3, bottomY - 2, 1, 1);
        g.rect(centerX + 3, bottomY - 2, 1, 1);
        g.fill(0xFFFFFF);

        // Body (Detailed Red Hoodie)
        g.rect(centerX - 6, bottomY - 17, 12, 10);
        g.fill(0xFF5555); // Bright red
        // Hoodie stripe
        g.rect(centerX - 6, bottomY - 13, 12, 2);
        g.fill(0xDD2222);
        // Hood outline
        g.rect(centerX - 5, bottomY - 17, 10, 2);
        g.fill(0xFF7777);
        // Hoodie pocket
        g.rect(centerX - 4, bottomY - 11, 8, 3);
        g.fill(0xCC3333);
        
        // Arms
        g.rect(centerX - 7, bottomY - 14, 2, 6); // Left arm
        g.rect(centerX + 5, bottomY - 14, 2, 6); // Right arm
        g.fill(0xFF5555);
        // Hands
        g.rect(centerX - 7, bottomY - 8, 2, 2);
        g.rect(centerX + 5, bottomY - 8, 2, 2);
        g.fill(0xFFCCAA);

        // Head (Detailed Skin)
        g.rect(centerX - 5, bottomY - 25, 10, 10);
        g.fill(0xFFCCAA);
        // Neck
        g.rect(centerX - 2, bottomY - 16, 4, 2);
        g.fill(0xFFCCAA);
        // Blush
        g.rect(centerX - 4, bottomY - 19, 2, 2);
        g.rect(centerX + 2, bottomY - 19, 2, 2);
        g.fill({ color: 0xFF9999, alpha: 0.6 });

        // Hair (Detailed Brown Hair)
        g.rect(centerX - 6, bottomY - 27, 12, 5); // Top
        g.fill(0x664422);
        g.rect(centerX - 6, bottomY - 25, 2, 7);  // Left side
        g.rect(centerX + 4, bottomY - 25, 2, 7);  // Right side
        g.fill(0x553311);
        // Bangs
        g.rect(centerX - 4, bottomY - 23, 2, 3);
        g.rect(centerX - 1, bottomY - 23, 2, 2);
        g.rect(centerX + 2, bottomY - 23, 2, 3);
        g.fill(0x664422);
        // Cowlick/Ahoge
        g.rect(centerX - 1, bottomY - 28, 2, 2);
        g.fill(0x775533);

        // Eyes (Detailed)
        g.rect(centerX - 3, bottomY - 21, 2, 3); // Left eye white
        g.rect(centerX + 1, bottomY - 21, 2, 3); // Right eye white
        g.fill(0xFFFFFF);
        g.rect(centerX - 2, bottomY - 20, 1, 2); // Left pupil
        g.rect(centerX + 2, bottomY - 20, 1, 2); // Right pupil
        g.fill(0x000000);
        // Eye shine
        g.rect(centerX - 2, bottomY - 21, 1, 1);
        g.rect(centerX + 2, bottomY - 21, 1, 1);
        g.fill(0xFFFFFF);
        
        // Smile
        g.rect(centerX - 2, bottomY - 18, 4, 1);
        g.fill(0x885555);

        // Attack Effect (Sword Swing)
        if (this.isAttacking) {
            const swingProgress = this.attackTimer / 20; // 0 to 1
            const angle = (swingProgress - 0.5) * Math.PI; // -PI/2 to PI/2

            const swordLen = 20;
            const handX = centerX + (this.visual.scale.x > 0 ? 5 : -5);
            const handY = bottomY - 12;

            const tipX = handX + Math.cos(angle) * swordLen * this.visual.scale.x;
            const tipY = handY + Math.sin(angle) * swordLen;

            g.moveTo(handX, handY);
            g.lineTo(tipX, tipY);
            g.stroke({ width: 3, color: 0xFFFFFF }); // White trail

            // Sword Blade
            g.moveTo(handX, handY);
            g.lineTo(tipX, tipY);
            g.stroke({ width: 2, color: 0xCCCCCC });
        }
    }

    attack(targetX, targetY) {
        // Face the target
        const dx = targetX - this.x;
        this.setFacing(dx);

        // Trigger attack animation
        this.isAttacking = true;
        this.attackTimer = 0;
    }

    moveTo(gridX, gridY) {
        this.targetX = gridX * TILE_SIZE;
        this.targetY = gridY * TILE_SIZE;
        this.isMoving = true;
        this.isInputMoving = false; // Disable input if click-moving

        // Determine direction
        const dx = this.targetX - this.x;
        this.setFacing(dx);
    }

    setInput(vx, vy) {
        this.inputVx = vx;
        this.inputVy = vy;
        this.isInputMoving = (vx !== 0 || vy !== 0);
        if (this.isInputMoving) {
            this.isMoving = false; // Cancel click-move
        }
    }

    update(delta) {
        // Attack Animation
        if (this.isAttacking) {
            this.attackTimer += delta;
            if (this.attackTimer > 20) {
                this.isAttacking = false;
            }
            this.draw(); // Redraw to show swing
        }

        // Input Movement (Joystick or Keyboard)
        if (this.isInputMoving) {
            const newX = this.x + this.inputVx * this.speed * delta;
            const newY = this.y + this.inputVy * this.speed * delta;

            // Clamp to map bounds
            const maxX = (60 - 1) * TILE_SIZE; // MAP_WIDTH - 1
            const maxY = (60 - 1) * TILE_SIZE; // MAP_HEIGHT - 1
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));

            // Walking animation
            this.animTimer += delta * 0.3;
            this.visual.y = Math.abs(Math.sin(this.animTimer)) * -3;

            if (Math.abs(this.inputVx) > 0.1) {
                this.setFacing(this.inputVx);
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
            const newX = this.x + Math.cos(angle) * this.speed * delta;
            const newY = this.y + Math.sin(angle) * this.speed * delta;

            // Clamp to map bounds
            const maxX = (60 - 1) * TILE_SIZE; // MAP_WIDTH - 1
            const maxY = (60 - 1) * TILE_SIZE; // MAP_HEIGHT - 1
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));

            // Update facing while moving
            if (Math.abs(dx) > 0.1) {
                this.setFacing(dx);
            }
        }
    }
}
