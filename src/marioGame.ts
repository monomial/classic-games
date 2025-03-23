import { Mario, Platform } from './marioGameObjects';

export class MarioGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mario: Mario;
    private platforms: Platform[];
    private keys: Set<string>;
    private lastTime: number;
    private cameraX: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = canvas.getContext('2d')!;
        
        // Create platforms first so we can reference the ground height
        this.platforms = [];
        const groundY = this.canvas.height - 40;  // Ground is 40px tall
        this.platforms.push(new Platform(0, groundY, 800, 40));  // Ground
        this.platforms.push(new Platform(300, groundY - 100, 200, 20));  // Platform 1
        this.platforms.push(new Platform(600, groundY - 200, 200, 20));  // Platform 2

        // Create Mario above the ground
        this.mario = new Mario(100, groundY - 50);  // Position Mario 50px above the ground
        
        this.keys = new Set();
        this.lastTime = 0;
        this.cameraX = 0;

        // Set up event listeners
        window.addEventListener('keydown', (e) => this.keys.add(e.key));
        window.addEventListener('keyup', (e) => this.keys.delete(e.key));
    }

    update(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Handle input
        if (this.keys.has('ArrowLeft')) {
            this.mario.moveLeft(deltaTime);
        } else if (this.keys.has('ArrowRight')) {
            this.mario.moveRight(deltaTime);
        } else {
            this.mario.stopMoving();
        }

        if (this.keys.has('ArrowUp') || this.keys.has(' ')) {
            this.mario.jump();
        }

        // Update Mario
        this.mario.update(deltaTime);

        // Check platform collisions
        for (const platform of this.platforms) {
            if (platform.checkCollision(this.mario)) {
                // Simple collision resolution - just stop falling
                this.mario.y = platform.y - this.mario.height;
                this.mario.velocityY = 0;
                this.mario.isJumping = false;
            }
        }

        // Update camera to follow Mario
        this.cameraX = this.mario.x - this.canvas.width / 2;
    }

    draw(): void {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';  // Sky blue background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save the current context state
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.cameraX, 0);

        // Draw platforms
        for (const platform of this.platforms) {
            platform.draw(this.ctx);
        }

        // Draw Mario
        this.mario.draw(this.ctx);

        // Restore the context state
        this.ctx.restore();
    }

    gameLoop(currentTime: number): void {
        this.update(currentTime);
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start(): void {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
} 