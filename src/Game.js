import { Application } from 'pixi.js';
import { GameScene } from './scenes/GameScene';

export class Game {
    constructor() {
        this.app = new Application();
    }

    async init() {
        // Initialize Pixi Application
        await this.app.init({
            resizeTo: window,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: false, // Pixel art style
        });

        // Append canvas to DOM
        document.body.appendChild(this.app.canvas);

        // Create and add Game Scene
        this.currentScene = new GameScene(this.app);
        this.app.stage.addChild(this.currentScene);

        // Add update loop
        this.app.ticker.add((ticker) => {
            if (this.currentScene && this.currentScene.update) {
                this.currentScene.update(ticker.deltaTime);
            }
        });
    }
}
