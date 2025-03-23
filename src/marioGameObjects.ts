export class Mario {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    isJumping: boolean;
    speed: number;
    jumpForce: number;
    gravity: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.speed = 200;
        this.jumpForce = -400;
        this.gravity = 800;
    }

    update(deltaTime: number): void {
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    jump(): void {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }

    moveLeft(deltaTime: number): void {
        this.velocityX = -this.speed;
    }

    moveRight(deltaTime: number): void {
        this.velocityX = this.speed;
    }

    stopMoving(): void {
        this.velocityX = 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Body (red rectangle)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Face (white circle for eye)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 24, this.y + 12, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Hat (red rectangle)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y - 8, this.width, 8);
        
        // Mustache (brown rectangle)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 16, this.y + 16, 12, 4);
    }
}

export class Platform {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Draw platform with a gradient for depth
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#8B4513');  // Top color
        gradient.addColorStop(1, '#654321');  // Bottom color
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(mario: Mario): boolean {
        return mario.x < this.x + this.width &&
               mario.x + mario.width > this.x &&
               mario.y < this.y + this.height &&
               mario.y + mario.height > this.y;
    }
} 