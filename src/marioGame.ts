import { Mario, Platform, QuestionBlock, Mushroom, Goomba } from './marioGameObjects';
import { DebugPanel } from './debugPanel';

export class MarioGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mario: Mario;
    private platforms: Platform[];
    private questionBlocks: QuestionBlock[];
    private mushrooms: Mushroom[];
    private goombas: Goomba[];
    private keys: Set<string>;
    private lastTime: number;
    private cameraX: number;
    private debugPanel: DebugPanel;
    private lives: number;
    private initialMarioPosition: { x: number, y: number };
    private deathScreenTimer: number;
    private readonly DEATH_SCREEN_DURATION = 2; // Duration in seconds

    constructor(canvas: HTMLCanvasElement, debugPanel: DebugPanel) {
        this.canvas = canvas;
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = canvas.getContext('2d')!;
        this.debugPanel = debugPanel;
        
        // Create platforms first so we can reference the ground height
        this.platforms = [];
        const groundY = this.canvas.height - 40;  // Ground is 40px tall
        this.platforms.push(new Platform(0, groundY, 800, 40));  // Ground
        this.platforms.push(new Platform(300, groundY - 120, 200, 20));  // Platform 1
        this.platforms.push(new Platform(600, groundY - 200, 200, 20));  // Platform 2

        // Create question blocks with different power-ups
        // Position blocks above the first platform with proper spacing
        const questionBlockY = groundY - 220; // Higher than the platform
        const blockSpacing = 48; // 1.5x block width for better spacing
        const startX = 320; // Start slightly after platform begins
        this.questionBlocks = [
            new QuestionBlock(startX, questionBlockY, 'coin'),
            new QuestionBlock(startX + blockSpacing, questionBlockY, 'mushroom'),
            new QuestionBlock(startX + blockSpacing * 2, questionBlockY, 'flower')
        ];

        // Initialize mushrooms array
        this.mushrooms = [];

        // Initialize goombas array and add one Goomba
        this.goombas = [];
        // Place Goomba on the first platform
        const firstPlatform = this.platforms[1]; // Index 1 is the first elevated platform
        this.goombas.push(new Goomba(
            firstPlatform.x + firstPlatform.width/2, // Start in middle of platform
            firstPlatform.y - 32 // Place on top of platform
        ));

        // Store initial Mario position for reset
        this.initialMarioPosition = { x: 100, y: groundY - 50 };
        
        // Create Mario above the ground
        this.mario = new Mario(this.initialMarioPosition.x, this.initialMarioPosition.y);
        
        this.keys = new Set();
        this.lastTime = 0;
        this.cameraX = 0;
        this.lives = 3;
        this.deathScreenTimer = 0;

        // Set up event listeners
        window.addEventListener('keydown', (e) => this.keys.add(e.key));
        window.addEventListener('keyup', (e) => this.keys.delete(e.key));

        // Add keyboard event listeners
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.mario.moveLeft(0);
                    break;
                case 'ArrowRight':
                    this.mario.moveRight(0);
                    break;
                case 'ArrowUp':
                case ' ':  // Space bar
                    this.mario.jump();
                    break;
                case 'ArrowDown':
                    this.mario.duck();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    if (this.mario.velocityX < 0) {
                        this.mario.stopMoving();
                    }
                    break;
                case 'ArrowRight':
                    if (this.mario.velocityX > 0) {
                        this.mario.stopMoving();
                    }
                    break;
                case 'ArrowDown':
                    this.mario.standUp();
                    break;
            }
        });
    }

    private resetMario(): void {
        this.mario.x = this.initialMarioPosition.x;
        this.mario.y = this.initialMarioPosition.y;
        this.mario.velocityX = 0;
        this.mario.velocityY = 0;
        this.mario.isJumping = false;
        this.mario.shrink(); // Reset to small size
        this.cameraX = 0;
        this.deathScreenTimer = this.DEATH_SCREEN_DURATION;

        // Reset Goombas
        this.goombas.forEach(goomba => {
            if (!goomba.isActive || goomba.isSquished) {
                const firstPlatform = this.platforms[1];
                goomba.x = firstPlatform.x + firstPlatform.width/2;
                goomba.y = firstPlatform.y - 32;
                goomba.isActive = true;
                goomba.isSquished = false;
                goomba.height = 32;
                goomba.velocityX = -50;
                goomba.squishTimer = 0;
            }
        });
    }

    update(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Update death screen timer if active
        if (this.deathScreenTimer > 0) {
            this.deathScreenTimer -= deltaTime;
            return; // Skip game updates while death screen is showing
        }

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

        // Update question blocks
        for (const block of this.questionBlocks) {
            block.update(deltaTime);
        }

        // Update mushrooms and handle platform collisions for them
        for (const mushroom of this.mushrooms) {
            mushroom.update(deltaTime);
            
            // Check platform collisions for mushrooms
            for (const platform of this.platforms) {
                if (platform.checkCollision(mushroom)) {
                    mushroom.y = platform.y - mushroom.height;
                    mushroom.velocityY = 0;
                }
            }

            // Check question block collisions for mushrooms
            for (const block of this.questionBlocks) {
                const collision = block.checkCollision(mushroom);
                if (collision.collided) {
                    // Bounce off blocks
                    mushroom.velocityX *= -1;
                }
            }
        }

        // Update Goombas
        for (const goomba of this.goombas) {
            if (!goomba.isActive) continue;

            goomba.update(deltaTime);
            
            // Handle platform collisions for Goombas
            for (const platform of this.platforms) {
                goomba.handlePlatformCollision(platform);
            }

            // Check collision with Mario
            const collisionResult = goomba.checkCollisionWithMario(this.mario);
            if (collisionResult === 'squish') {
                goomba.squish();
                // Make Mario bounce a bit
                this.mario.velocityY = -200;
            } else if (collisionResult === 'hit') {
                this.lives--;
                if (this.lives <= 0) {
                    this.lives = 3;
                }
                this.resetMario();
                break;
            }
        }

        // Check if Mario fell off the screen
        if (this.mario.y > this.canvas.height) {
            this.lives--;
            if (this.lives <= 0) {
                // Game over - reset everything
                this.lives = 3;
                this.resetMario();
            } else {
                // Lose a life and reset position
                this.resetMario();
            }
        }

        // Check platform collisions
        let isOnGround = false;
        for (const platform of this.platforms) {
            if (platform.checkCollision(this.mario)) {
                // Simple collision resolution - just stop falling
                this.mario.y = platform.y - this.mario.height;
                this.mario.velocityY = 0;
                this.mario.isJumping = false;
                isOnGround = true;
            }
        }

        // Check question block collisions
        for (const block of this.questionBlocks) {
            const collision = block.checkCollision(this.mario);
            if (collision.collided) {
                if (collision.fromBelow) {
                    // Mario hit block from below
                    const powerUp = block.activate(this.mario);
                    if (powerUp) {
                        if (powerUp.type === 'mushroom') {
                            // Spawn mushroom
                            this.mushrooms.push(new Mushroom(block.x, block.y - block.height));
                        } else if (powerUp.type === 'coin') {
                            // TODO: Add coin animation and score
                        } else if (powerUp.type === 'flower') {
                            // TODO: Add flower power-up
                        }
                    }
                } else if (!collision.fromBelow) {
                    // Mario hit block from sides or top
                    if (this.mario.y < block.y) {
                        // From above
                        this.mario.y = block.y - this.mario.height;
                        this.mario.velocityY = 0;
                        this.mario.isJumping = false;
                    } else {
                        // From sides
                        if (this.mario.x < block.x) {
                            this.mario.x = block.x - this.mario.width;
                        } else {
                            this.mario.x = block.x + block.width;
                        }
                        this.mario.velocityX = 0;
                    }
                }
            }
        }

        // Check mushroom collisions
        for (let i = this.mushrooms.length - 1; i >= 0; i--) {
            const mushroom = this.mushrooms[i];
            if (mushroom.isActive && mushroom.checkCollision(this.mario)) {
                if (!this.mario.isBig) {
                    this.mario.grow();
                }
                mushroom.collect();
                this.mushrooms.splice(i, 1);
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

        // Draw question blocks
        for (const block of this.questionBlocks) {
            block.draw(this.ctx);
        }

        // Draw mushrooms
        for (const mushroom of this.mushrooms) {
            mushroom.draw(this.ctx);
        }

        // Draw Goombas
        for (const goomba of this.goombas) {
            goomba.draw(this.ctx);
        }

        // Draw Mario
        this.mario.draw(this.ctx);

        // Restore the context state
        this.ctx.restore();

        // Draw lives counter
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 30);

        // Draw death screen if timer is active
        if (this.deathScreenTimer > 0) {
            // Draw semi-transparent black background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw death message
            this.ctx.font = '48px Arial';
            this.ctx.fillStyle = '#fff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Lives Left:', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.font = '72px Arial';
            this.ctx.fillText(this.lives.toString(), this.canvas.width / 2, this.canvas.height / 2 + 30);
            this.ctx.textAlign = 'left';
        }
    }

    gameLoop(currentTime: number): void {
        this.update(currentTime);
        this.draw();

        // Get the first goomba for debugging
        const goomba = this.goombas[0];
        const firstPlatform = this.platforms[1];

        // Update debug panel
        this.debugPanel.updateFPS();
        this.debugPanel.updateGameInfo({
            'Mario Position': `(${Math.round(this.mario.x)}, ${Math.round(this.mario.y)})`,
            'Mario Velocity': `(${Math.round(this.mario.velocityX)}, ${Math.round(this.mario.velocityY)})`,
            'Camera X': Math.round(this.cameraX),
            'Jumping': this.mario.isJumping ? 'Yes' : 'No',
            'Active Keys': Array.from(this.keys).join(', ') || 'None',
            'Lives': this.lives,
            'Mario Size': this.mario.isBig ? 'Big' : 'Small',
            'Active Mushrooms': this.mushrooms.length,
            'Active Goombas': this.goombas.filter(g => g.isActive && !g.isSquished).length,
            'Goomba Position': `(${Math.round(goomba.x)}, ${Math.round(goomba.y)})`,
            'Goomba Velocity': `(${Math.round(goomba.velocityX)}, ${Math.round(goomba.velocityY)})`,
            'Platform Edge': `Left: ${firstPlatform.x}, Right: ${firstPlatform.x + firstPlatform.width}`,
            'On Platform': `${Math.abs(goomba.y + goomba.height - firstPlatform.y) < 2}`,
            'Within X Bounds': `${goomba.x > firstPlatform.x && goomba.x + goomba.width < firstPlatform.x + firstPlatform.width}`,
            'Block States': this.questionBlocks.map((block, i) => 
                `Block ${i + 1}: ${block.isActive ? block.powerUpType : 'used'}`
            ).join(', '),
            'Mario Collision Box': `x: ${Math.round(this.mario.x)}-${Math.round(this.mario.x + this.mario.width)}, y: ${Math.round(this.mario.y)}-${Math.round(this.mario.y + this.mario.height)}`
        });

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    start(): void {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
} 