import { Ball, Paddle } from './gameObjects';

class Pong {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ball: Ball;
    private leftPaddle: Paddle;
    private rightPaddle: Paddle;
    private score: { left: number; right: number };
    private keys: { [key: string]: boolean };
    private lastTime: number;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Initialize game objects
        this.ball = new Ball(this.canvas.width / 2, this.canvas.height / 2);
        this.leftPaddle = new Paddle(50, this.canvas.height / 2 - 50);
        this.rightPaddle = new Paddle(this.canvas.width - 50, this.canvas.height / 2 - 50);
        this.score = { left: 0, right: 0 };
        this.keys = {};
        this.lastTime = 0;

        // Event listeners
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Start game loop
        this.gameLoop(0);
    }

    private update(deltaTime: number): void {
        // Update paddles with delta time
        if (this.keys['w'] && this.leftPaddle.y > 0) {
            this.leftPaddle.moveUp(deltaTime);
        }
        if (this.keys['s'] && this.leftPaddle.y < this.canvas.height - this.leftPaddle.height) {
            this.leftPaddle.moveDown(deltaTime);
        }
        if (this.keys['ArrowUp'] && this.rightPaddle.y > 0) {
            this.rightPaddle.moveUp(deltaTime);
        }
        if (this.keys['ArrowDown'] && this.rightPaddle.y < this.canvas.height - this.rightPaddle.height) {
            this.rightPaddle.moveDown(deltaTime);
        }

        // Update ball with delta time
        this.ball.update(deltaTime);

        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (this.ball.x <= this.leftPaddle.x + this.leftPaddle.width &&
            this.ball.y >= this.leftPaddle.y &&
            this.ball.y <= this.leftPaddle.y + this.leftPaddle.height) {
            this.ball.handlePaddleCollision();
            this.ball.dx = Math.abs(this.ball.dx);
        }

        if (this.ball.x >= this.rightPaddle.x &&
            this.ball.y >= this.rightPaddle.y &&
            this.ball.y <= this.rightPaddle.y + this.rightPaddle.height) {
            this.ball.handlePaddleCollision();
            this.ball.dx = -Math.abs(this.ball.dx);
        }

        // Score points
        if (this.ball.x <= 0) {
            this.score.right++;
            this.resetBall();
        }
        if (this.ball.x >= this.canvas.width) {
            this.score.left++;
            this.resetBall();
        }
    }

    private resetBall(): void {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 300; // Adjusted for delta time
        this.ball.dy = (Math.random() * 2 - 1) * 300; // Adjusted for delta time
    }

    private draw(): void {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();

        // Draw score
        this.ctx.font = '48px Arial';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(this.score.left.toString(), this.canvas.width / 4, 50);
        this.ctx.fillText(this.score.right.toString(), 3 * this.canvas.width / 4, 50);

        // Draw game objects
        this.ball.draw(this.ctx);
        this.leftPaddle.draw(this.ctx);
        this.rightPaddle.draw(this.ctx);
    }

    private gameLoop(currentTime: number): void {
        // Calculate delta time in seconds
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

export { Pong }; 