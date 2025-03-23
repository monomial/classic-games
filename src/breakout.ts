import { Ball, Paddle } from './gameObjects';

class Brick {
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
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Breakout {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ball: Ball;
    private paddle: Paddle;
    private bricks: Brick[];
    private score: number;
    private lives: number;
    private keys: { [key: string]: boolean };
    private lastTime: number;
    private gameOver: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Initialize game objects
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 100);
        this.ball.dy = -Math.abs(this.ball.dy); // Ensure ball starts moving upward
        this.paddle = new Paddle(this.canvas.width / 2, this.canvas.height - 20);
        this.bricks = this.initializeBricks();
        this.score = 0;
        this.lives = 3;
        this.keys = {};
        this.lastTime = 0;
        this.gameOver = false;

        // Event listeners
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Start game loop
        this.gameLoop(0);
    }

    private initializeBricks(): Brick[] {
        const bricks: Brick[] = [];
        const rows = 5;
        const cols = 8;
        const brickWidth = 80;
        const brickHeight = 20;
        const padding = 10;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                bricks.push(new Brick(
                    j * (brickWidth + padding) + padding,
                    i * (brickHeight + padding) + padding + 50,
                    brickWidth,
                    brickHeight
                ));
            }
        }

        return bricks;
    }

    private update(deltaTime: number): void {
        if (this.gameOver) return;

        // Update paddle
        if (this.keys['ArrowLeft'] && this.paddle.x > this.paddle.width / 2) {
            this.paddle.moveLeft(deltaTime);
        }
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width / 2) {
            this.paddle.moveRight(deltaTime);
        }

        // Update ball
        this.ball.update(deltaTime);

        // Ball collision with walls
        if (this.ball.x <= this.ball.radius) {
            this.ball.x = this.ball.radius;
            this.ball.dx = Math.abs(this.ball.dx);
        } else if (this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.x = this.canvas.width - this.ball.radius;
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        // Ball collision with top
        if (this.ball.y <= this.ball.radius) {
            this.ball.y = this.ball.radius;
            this.ball.dy = Math.abs(this.ball.dy);
        }

        // Ball collision with paddle
        if (this.ball.y >= this.paddle.y - this.ball.radius &&
            this.ball.x >= this.paddle.x - this.paddle.width / 2 &&
            this.ball.x <= this.paddle.x + this.paddle.width / 2) {
            // Ensure the ball stays above the paddle
            this.ball.y = this.paddle.y - this.ball.radius;
            
            // Calculate angle based on where the ball hits the paddle
            const hitPosition = (this.ball.x - (this.paddle.x - this.paddle.width / 2)) / this.paddle.width;
            
            // Limit the angle to prevent extreme angles
            const maxBounceAngle = Math.PI / 3; // 60 degrees
            const bounceAngle = (hitPosition - 0.5) * maxBounceAngle;
            
            // Set new velocity based on angle while maintaining consistent speed
            const speed = this.ball.baseSpeed;
            this.ball.dx = speed * Math.sin(bounceAngle);
            this.ball.dy = -speed * Math.cos(bounceAngle);
        }

        // Ball collision with bricks
        this.bricks = this.bricks.filter(brick => {
            if (this.ball.x >= brick.x && this.ball.x <= brick.x + brick.width &&
                this.ball.y >= brick.y && this.ball.y <= brick.y + brick.height) {
                this.ball.dy *= -1;
                this.score += 10;
                return false;
            }
            return true;
        });

        // Check for game over
        if (this.ball.y >= this.canvas.height) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver = true;
            } else {
                this.resetBall();
            }
        }
    }

    private draw(): void {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw score and lives
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 100, 30);

        // Draw game objects
        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.bricks.forEach(brick => brick.draw(this.ctx));

        // Draw game over message
        if (this.gameOver) {
            this.ctx.font = '48px Arial';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
        }
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private resetBall(): void {
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 100);
        this.ball.dy = -Math.abs(this.ball.dy); // Ensure ball starts moving upward
    }
}

export { Breakout }; 