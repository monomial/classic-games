export class Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    baseSpeed: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseSpeed = 300; // Base speed that will be randomly modified
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.baseSpeed;
        this.dy = (Math.random() * 2 - 1) * this.baseSpeed;
        this.radius = 10;
    }

    update(deltaTime: number): void {
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
    }

    // New method to handle paddle collisions with random speed changes
    handlePaddleCollision(): void {
        // Randomly change speed between 80% and 120% of base speed
        const speedMultiplier = 0.8 + Math.random() * 0.4;
        const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        const newSpeed = this.baseSpeed * speedMultiplier;
        
        // Maintain the same direction but with new speed
        const directionX = this.dx / currentSpeed;
        const directionY = this.dy / currentSpeed;
        
        this.dx = directionX * newSpeed;
        this.dy = directionY * newSpeed;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
}

export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 100;
        this.speed = 300; // Adjusted for delta time
    }

    moveUp(deltaTime: number): void {
        this.y -= this.speed * deltaTime;
    }

    moveDown(deltaTime: number): void {
        this.y += this.speed * deltaTime;
    }

    moveLeft(deltaTime: number): void {
        this.x -= this.speed * deltaTime;
    }

    moveRight(deltaTime: number): void {
        this.x += this.speed * deltaTime;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
} 