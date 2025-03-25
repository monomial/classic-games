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
    animationFrame: number;
    lastAnimationUpdate: number;
    animationSpeed: number;
    facingLeft: boolean;
    isBig: boolean;
    isDucking: boolean;
    normalHeight: number;
    normalY: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.normalHeight = 32;
        this.normalY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.speed = 200;
        this.jumpForce = -400;
        this.gravity = 800;
        this.animationFrame = 0;
        this.lastAnimationUpdate = 0;
        this.animationSpeed = 0.1;
        this.facingLeft = false;
        this.isBig = false;
        this.isDucking = false;
    }

    grow(): void {
        if (!this.isBig) {
            this.isBig = true;
            this.normalHeight = 64;
            this.height = this.isDucking ? 32 : 64;
            this.normalY = this.y;
            this.y -= 32;
        }
    }

    shrink(): void {
        if (this.isBig) {
            this.isBig = false;
            this.normalHeight = 32;
            this.height = this.isDucking ? 24 : 32;
            this.y = this.normalY;
        }
    }

    duck(): void {
        if (!this.isDucking) {
            this.isDucking = true;
            // Slow down horizontal movement when ducking
            if (this.velocityX !== 0) {
                this.velocityX *= 0.5;
            }
            if (this.isBig) {
                // When big Mario ducks, he becomes half height
                this.y += this.normalHeight / 2;
                this.height = this.normalHeight / 2;
            } else {
                // When small Mario ducks, he becomes 75% of normal height
                this.y += this.normalHeight * 0.25;
                this.height = this.normalHeight * 0.75;
            }
        }
    }

    standUp(): void {
        if (this.isDucking) {
            this.isDucking = false;
            // Restore normal speed when standing up
            if (this.velocityX !== 0) {
                this.velocityX *= 2;
            }
            if (this.isBig) {
                this.y -= this.normalHeight / 2;
                this.height = this.normalHeight;
            } else {
                this.y -= this.normalHeight * 0.25;
                this.height = this.normalHeight;
            }
        }
    }

    update(deltaTime: number): void {
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Update facing direction when moving
        if (this.velocityX < 0) {
            this.facingLeft = true;
        } else if (this.velocityX > 0) {
            this.facingLeft = false;
        }

        // Update animation frame if moving and not ducking
        if (Math.abs(this.velocityX) > 0 && !this.isDucking) {
            this.lastAnimationUpdate += deltaTime;
            if (this.lastAnimationUpdate >= this.animationSpeed) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.lastAnimationUpdate = 0;
            }
        } else {
            this.animationFrame = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const faceOffset = this.facingLeft ? -4 : 4;
        
        if (this.isBig) {
            if (this.isDucking) {
                // Ducking Big Mario
                // Torso (compressed)
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 6, this.y + 8, 20, 16);
                
                // Arms (tucked in)
                ctx.fillRect(this.x + 4, this.y + 10, 4, 8);  // Left arm
                ctx.fillRect(this.x + 24, this.y + 10, 4, 8); // Right arm
                
                // Face (lowered)
                ctx.fillStyle = '#FFA07A';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + 8, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(this.x + 12 + faceOffset, this.y + 7, 1.5, 0, Math.PI * 2);
                ctx.arc(this.x + 20 + faceOffset, this.y + 7, 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Mustache
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 12 + faceOffset, this.y + 10, 8, 2);
                
                // Hat
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 6, this.y, 20, 4);   // Main hat part
                ctx.fillRect(this.x + 4, this.y + 4, 24, 2);   // Hat brim
                
                // Legs (bent)
                ctx.fillStyle = '#0000FF';
                ctx.fillRect(this.x + 8, this.y + 24, 7, 8);  // Left leg
                ctx.fillRect(this.x + 17, this.y + 24, 7, 8); // Right leg
            } else {
                // Normal Big Mario (existing drawing code)
                // Torso
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 6, this.y + 16, 20, 32);
                
                // Arms
                ctx.fillRect(this.x + 2, this.y + 20, 4, 16);  // Left arm
                ctx.fillRect(this.x + 26, this.y + 20, 4, 16); // Right arm
                
                // Face
                ctx.fillStyle = '#FFA07A';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + 12, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(this.x + 12 + faceOffset, this.y + 10, 1.5, 0, Math.PI * 2);
                ctx.arc(this.x + 20 + faceOffset, this.y + 10, 1.5, 0, Math.PI * 2);
                ctx.fill();
                
                // Mustache
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 12 + faceOffset, this.y + 14, 8, 2);
                
                // Hat
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 6, this.y + 2, 20, 6);   // Main hat part
                ctx.fillRect(this.x + 4, this.y + 6, 24, 2);   // Hat brim
                
                // Legs
                ctx.fillStyle = '#0000FF';
                const leftLegX = this.x + 8;
                const rightLegX = this.x + 17;
                const legWidth = 7;
                const legHeight = 14;
                const legY = this.y + 48;

                if (Math.abs(this.velocityX) > 0) {
                    // Moving animation
                    const legOffset = Math.sin(this.animationFrame * Math.PI / 2) * 4;
                    ctx.fillRect(leftLegX, legY - legOffset, legWidth, legHeight + legOffset);
                    ctx.fillRect(rightLegX, legY + legOffset, legWidth, legHeight - legOffset);
                } else {
                    // Standing position
                    ctx.fillRect(leftLegX, legY, legWidth, legHeight);
                    ctx.fillRect(rightLegX, legY, legWidth, legHeight);
                }
            }
        } else {
            if (this.isDucking) {
                // Ducking Small Mario
                // Torso (slightly compressed)
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 8, this.y + 4, 16, 16);
                
                // Arms (tucked in)
                ctx.fillRect(this.x + 4, this.y + 6, 4, 8);   // Left arm
                ctx.fillRect(this.x + 24, this.y + 6, 4, 8);  // Right arm
                
                // Face
                ctx.fillStyle = '#FFA07A';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + 6, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(this.x + 14 + faceOffset, this.y + 5, 1, 0, Math.PI * 2);
                ctx.arc(this.x + 18 + faceOffset, this.y + 5, 1, 0, Math.PI * 2);
                ctx.fill();
                
                // Mustache
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 14 + faceOffset, this.y + 7, 6, 1);
                
                // Hat
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 8, this.y - 2, 16, 3);  // Main hat part
                ctx.fillRect(this.x + 6, this.y, 20, 2);  // Hat brim
                
                // Legs (bent)
                ctx.fillStyle = '#0000FF';
                ctx.fillRect(this.x + 10, this.y + 20, 5, 4);  // Left leg
                ctx.fillRect(this.x + 17, this.y + 20, 5, 4);  // Right leg
            } else {
                // Normal Small Mario (existing drawing code)
                // Torso
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 8, this.y + 4, 16, 20);
                
                // Arms
                ctx.fillRect(this.x + 4, this.y + 8, 4, 12);   // Left arm
                ctx.fillRect(this.x + 24, this.y + 8, 4, 12);  // Right arm
                
                // Face
                ctx.fillStyle = '#FFA07A';
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + 6, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(this.x + 14 + faceOffset, this.y + 5, 1, 0, Math.PI * 2);
                ctx.arc(this.x + 18 + faceOffset, this.y + 5, 1, 0, Math.PI * 2);
                ctx.fill();
                
                // Mustache
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 14 + faceOffset, this.y + 7, 6, 1);
                
                // Hat
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(this.x + 8, this.y - 4, 16, 4);  // Main hat part
                ctx.fillRect(this.x + 6, this.y - 2, 20, 2);  // Hat brim
                
                // Legs
                ctx.fillStyle = '#0000FF';
                const leftLegX = this.x + 10;
                const rightLegX = this.x + 17;
                const legWidth = 5;
                const legHeight = 8;
                const legY = this.y + 24;

                if (Math.abs(this.velocityX) > 0) {
                    // Moving animation
                    const legOffset = Math.sin(this.animationFrame * Math.PI / 2) * 3;
                    ctx.fillRect(leftLegX, legY - legOffset, legWidth, legHeight + legOffset);
                    ctx.fillRect(rightLegX, legY + legOffset, legWidth, legHeight - legOffset);
                } else {
                    // Standing position
                    ctx.fillRect(leftLegX, legY, legWidth, legHeight);
                    ctx.fillRect(rightLegX, legY, legWidth, legHeight);
                }
            }
        }
    }

    jump(): void {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }

    moveLeft(deltaTime: number): void {
        // Move slower when ducking
        const currentSpeed = this.isDucking ? this.speed * 0.5 : this.speed;
        this.velocityX = -currentSpeed;
    }

    moveRight(deltaTime: number): void {
        // Move slower when ducking
        const currentSpeed = this.isDucking ? this.speed * 0.5 : this.speed;
        this.velocityX = currentSpeed;
    }

    stopMoving(): void {
        this.velocityX = 0;
    }
}

export interface GameEntity {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY?: number;
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

    checkCollision(entity: GameEntity): boolean {
        return entity.x < this.x + this.width &&
               entity.x + entity.width > this.x &&
               entity.y < this.y + this.height &&
               entity.y + entity.height > this.y;
    }
}

export class QuestionBlock {
    x: number;
    y: number;
    width: number;
    height: number;
    isActive: boolean;
    animationFrame: number;
    lastAnimationUpdate: number;
    animationSpeed: number;
    powerUpType: 'coin' | 'mushroom' | 'flower';

    constructor(x: number, y: number, powerUpType: 'coin' | 'mushroom' | 'flower' = 'coin') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32; // Make it square like classic Mario blocks
        this.isActive = true;
        this.animationFrame = 0;
        this.lastAnimationUpdate = 0;
        this.animationSpeed = 0.2;
        this.powerUpType = powerUpType;
    }

    update(deltaTime: number): void {
        if (this.isActive) {
            this.lastAnimationUpdate += deltaTime;
            if (this.lastAnimationUpdate >= this.animationSpeed) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.lastAnimationUpdate = 0;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // Draw block background
        if (this.isActive) {
            ctx.fillStyle = '#FFD700';  // Gold color for active blocks
        } else {
            ctx.fillStyle = '#808080';  // Gray color for used blocks
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add a border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (this.isActive) {
            // Draw question mark
            ctx.fillStyle = '#000000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Make question mark bounce slightly based on animation frame
            const bounceOffset = Math.sin(this.animationFrame * Math.PI / 2) * 2;
            ctx.fillText('?', this.x + this.width/2, this.y + this.height/2 + bounceOffset);
            
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
        }
    }

    checkCollision(entity: GameEntity): { collided: boolean; fromBelow: boolean } {
        // Calculate the overlap on each axis
        const overlapX = Math.min(entity.x + entity.width, this.x + this.width) - Math.max(entity.x, this.x);
        const overlapY = Math.min(entity.y + entity.height, this.y + this.height) - Math.max(entity.y, this.y);

        const collision = overlapX > 0 && overlapY > 0;

        // Check if hitting from below (more forgiving)
        const fromBelow = collision && 
                         entity.velocityY !== undefined &&
                         ((entity.velocityY < 0 && // Moving upward
                           entity.y < this.y + this.height && // Some vertical overlap
                           overlapX > entity.width * 0.2) || // Only need 20% horizontal overlap
                          (entity.y <= this.y + this.height && // Very close to bottom of block
                           entity.y + entity.height >= this.y + this.height * 0.8 && // Within bottom 20% of block
                           overlapX > entity.width * 0.4)); // Need more horizontal overlap for bottom hits

        // If there's a collision but it's not from below, we need to prevent passing through
        if (collision && !fromBelow && entity.velocityY !== undefined) {
            // Hitting from above
            if (entity.velocityY > 0 && entity.y < this.y) {
                entity.y = this.y - entity.height;
                if ('velocityY' in entity) {
                    entity.velocityY = 0;
                }
            }
            // Hitting from sides
            else if (entity.y + entity.height > this.y + 4) { // Small tolerance to prevent getting stuck
                if (entity.x < this.x) {
                    entity.x = this.x - entity.width;
                } else {
                    entity.x = this.x + this.width;
                }
            }
        }

        return { collided: collision, fromBelow };
    }

    activate(mario: Mario): { type: 'coin' | 'mushroom' | 'flower' } | null {
        if (this.isActive) {
            this.isActive = false;
            
            // If Mario is big and this is a mushroom block, give a flower instead
            if (this.powerUpType === 'mushroom' && mario.isBig) {
                return { type: 'flower' };
            }
            
            return { type: this.powerUpType };
        }
        return null;
    }
}

export class Mushroom {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    gravity: number;
    isActive: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 100;  // Move right initially
        this.velocityY = -200;  // Pop up initially
        this.gravity = 800;
        this.isActive = true;
    }

    update(deltaTime: number): void {
        if (!this.isActive) return;

        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    // Add method to handle wall collisions
    handleWallCollision(wall: Platform): boolean {
        if (this.x < wall.x + wall.width &&
            this.x + this.width > wall.x &&
            this.y < wall.y + wall.height &&
            this.y + this.height > wall.y) {
            
            // If hitting wall from sides, reverse direction
            if (this.velocityX > 0 && this.x < wall.x) {
                this.x = wall.x - this.width;
                this.velocityX *= -1;
                return true;
            } else if (this.velocityX < 0 && this.x + this.width > wall.x + wall.width) {
                this.x = wall.x + wall.width;
                this.velocityX *= -1;
                return true;
            }
            
            // If hitting from top, stop vertical movement
            if (this.velocityY > 0 && this.y < wall.y) {
                this.y = wall.y - this.height;
                this.velocityY = 0;
                return true;
            }
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        // Draw mushroom cap
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y, this.width, this.height/2);

        // Draw mushroom stem
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + this.width/4, this.y + this.height/2, this.width/2, this.height/2);
    }

    checkCollision(mario: Mario): boolean {
        return mario.x < this.x + this.width &&
               mario.x + mario.width > this.x &&
               mario.y < this.y + this.height &&
               mario.y + mario.height > this.y;
    }

    collect(): void {
        this.isActive = false;
    }
}

export class Goomba implements GameEntity {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    gravity: number;
    isActive: boolean;
    isSquished: boolean;
    squishTimer: number;
    readonly SQUISH_DURATION: number = 0.5; // Duration in seconds before disappearing

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = -100; // Increased speed from -50 to -100
        this.velocityY = 0;
        this.gravity = 800;
        this.isActive = true;
        this.isSquished = false;
        this.squishTimer = 0;
    }

    update(deltaTime: number): void {
        if (!this.isActive) return;

        if (this.isSquished) {
            this.squishTimer += deltaTime;
            if (this.squishTimer >= this.SQUISH_DURATION) {
                this.isActive = false;
            }
            return;
        }

        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        
        // Update position
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        if (this.isSquished) {
            // Draw squished Goomba (flattened)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y + this.height - 8, this.width, 8);
            return;
        }

        // Draw body (brown circle)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();

        // Draw feet (darker brown)
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 4, this.y + this.height - 8, 10, 8); // Left foot
        ctx.fillRect(this.x + this.width - 14, this.y + this.height - 8, 10, 8); // Right foot

        // Draw eyes (white with black pupils)
        const eyeY = this.y + this.height/3;
        
        // Left eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + this.width/3, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(this.x + (this.width * 2/3), eyeY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + this.width/3, eyeY, 2, 0, Math.PI * 2);
        ctx.arc(this.x + (this.width * 2/3), eyeY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    handlePlatformCollision(platform: Platform): boolean {
        // First check if we're within the platform's x bounds
        const withinXBounds = this.x < platform.x + platform.width &&
                             this.x + this.width > platform.x;
        
        // Then check if we're within the platform's y bounds
        const withinYBounds = this.y < platform.y + platform.height &&
                             this.y + this.height > platform.y;

        // If we're within both bounds, we have a collision
        if (withinXBounds && withinYBounds) {
            // If hitting platform from above, stop falling
            if (this.velocityY > 0 && this.y < platform.y) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                return true;
            }
        }

        // Check if we're walking on this platform (slightly above it)
        const onPlatform = withinXBounds && 
                          Math.abs(this.y + this.height - platform.y) < 2;

        if (onPlatform) {
            // Check for edges by looking ahead
            const lookAheadDistance = 32; // Full width of Goomba
            
            // Moving left
            if (this.velocityX < 0) {
                // If we're about to walk off the left edge
                if (this.x <= platform.x + 2) {
                    this.velocityX = Math.abs(this.velocityX); // Turn right
                    this.x = platform.x + 2; // Move slightly away from edge
                    return true;
                }
            }
            // Moving right
            else if (this.velocityX > 0) {
                // If we're about to walk off the right edge
                if (this.x + this.width >= platform.x + platform.width - 2) {
                    this.velocityX = -Math.abs(this.velocityX); // Turn left
                    this.x = platform.x + platform.width - this.width - 2; // Move slightly away from edge
                    return true;
                }
            }

            return true; // We're on the platform
        }

        return false;
    }

    checkCollisionWithMario(mario: Mario): 'squish' | 'hit' | null {
        if (!this.isActive || this.isSquished) return null;

        const marioBottom = mario.y + mario.height;
        const goombaTop = this.y;
        const marioVelocityY = mario.velocityY;

        if (mario.x < this.x + this.width &&
            mario.x + mario.width > this.x &&
            mario.y < this.y + this.height &&
            marioBottom > this.y) {
            
            // If Mario is falling and hits the Goomba from above
            if (marioVelocityY > 0 && marioBottom < this.y + this.height/2) {
                return 'squish';
            }
            // Otherwise, Mario gets hit
            return 'hit';
        }
        return null;
    }

    squish(): void {
        this.isSquished = true;
        this.height = 8; // Flatten the Goomba
        this.y += 24; // Adjust Y position to account for new height
    }
} 