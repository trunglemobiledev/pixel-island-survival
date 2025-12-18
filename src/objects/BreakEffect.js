import { Container, Graphics } from 'pixi.js';

export class BreakEffect extends Container {
    constructor(x, y, color) {
        super();
        this.x = x;
        this.y = y;
        this.particles = [];
        this.lifetime = 60; // frames
        this.age = 0;

        // Create particles
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI * 2 * i) / numParticles;
            const speed = 2 + Math.random() * 2;
            
            const particle = {
                g: new Graphics(),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1, // Slight upward bias
                x: 0,
                y: 0,
                size: 3 + Math.random() * 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3
            };

            // Draw particle
            particle.g.rect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            particle.g.fill(color);
            
            this.addChild(particle.g);
            this.particles.push(particle);
        }
    }

    update(delta) {
        this.age += delta;

        const fadeProgress = this.age / this.lifetime;
        
        for (const particle of this.particles) {
            // Update position
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.vy += 0.2 * delta; // Gravity
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * delta;
            
            // Apply to graphics
            particle.g.x = particle.x;
            particle.g.y = particle.y;
            particle.g.rotation = particle.rotation;
            
            // Fade out
            particle.g.alpha = 1 - fadeProgress;
        }

        return this.age >= this.lifetime; // Return true when done
    }
}
