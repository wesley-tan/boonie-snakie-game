/**
 * Bunny Character - Arrow key controlled, collects hearts, blocked by water
 */
class Bunny extends Character {
    constructor(x, y) {
        super(x, y, 25, 25, 'bunny');
        this.speed = 2.5;
        
        // Bunny-specific properties
        this.canEnterWater = false;
        this.canCollectHearts = true;
        this.canWalkOnSnake = true;
        
        // Visual state management
        this.blockedIndicatorTime = 0;
        this.collectingAnimation = 0;
        
        // Movement smoothing
        this.targetPosition = { x: x, y: y };
        this.moveSmoothing = 0.3;
    }
    
    update(deltaTime) {
        this.updateAnimation(deltaTime);
        this.updateMovement(deltaTime);
        this.updateVisualEffects(deltaTime);
    }
    
    updateMovement(deltaTime) {
        if (!this.gameState || !this.gameState.inputManager) return;
        
        const input = this.gameState.inputManager;
        const direction = input.getBunnyDirection();
        
        // Check if bunny is trying to move
        if (direction.x !== 0 || direction.y !== 0) {
            const newX = this.x + direction.x * this.speed;
            const newY = this.y + direction.y * this.speed;
            
            // Check bounds first
            if (!this.isWithinBounds(newX, newY)) {
                this.state = 'blocked';
                this.showBlockedIndicator();
                return;
            }
            
            // Check if movement is allowed
            if (this.canMoveTo(newX, newY)) {
                this.updatePosition(newX, newY);
                this.state = 'moving';
            } else {
                // Only show blocked indicator if not already blocked
                if (this.state !== 'blocked') {
                    this.state = 'blocked';
                    this.showBlockedIndicator();
                }
            }
        } else {
            this.state = 'idle';
        }
        
        // Check for heart collection
        this.checkHeartCollection();
    }
    
    canMoveTo(newX, newY) {
        const newPosition = { x: newX, y: newY };
        
        // Get snake reference from game state
        const snake = this.gameState ? this.gameState.snake : null;
        const waterObstacles = this.terrainManager ? this.terrainManager.getWaterObstacles() : [];
        
        // Use collision manager to check if movement is allowed
        if (this.collisionManager) {
            const canMove = this.collisionManager.canBunnyMoveTo(this, newPosition, snake, waterObstacles);
            
            // Safety check: if bunny is currently in water, prioritize getting out
            if (!canMove) {
                const currentBounds = this.getBounds();
                const currentWaterCollisions = this.collisionManager.getWaterCollisions(currentBounds, waterObstacles);
                
                if (currentWaterCollisions.length > 0) {
                    // Bunny is in water - check if this move gets it closer to land
                    const newBounds = { x: newX, y: newY, width: this.width, height: this.height };
                    const newWaterCollisions = this.collisionManager.getWaterCollisions(newBounds, waterObstacles);
                    
                    // If moving reduces water overlap, allow it
                    return newWaterCollisions.length < currentWaterCollisions.length;
                }
            }
            
            return canMove;
        }
        
        return true; // Fallback
    }
    
    checkHeartCollection() {
        if (!this.gameState || !this.gameState.level) return;
        
        // Prevent rapid collection during animation
        if (this.collectingAnimation > 0) return;
        
        const bunnyBounds = this.getBounds();
        
        for (let heart of this.gameState.level.hearts) {
            if (!heart.collected && !heart.beingCollected && 
                this.collisionManager.checkObjectCollision(this, heart)) {
                
                // Mark as being collected to prevent double-collection
                heart.beingCollected = true;
                heart.collected = true;
                heart.collectionAnimation = 1.0;
                
                this.gameState.collectHeart();
                this.triggerCollectionAnimation();
                
                // Reset collection flag after animation
                setTimeout(() => {
                    heart.beingCollected = false;
                }, 100);
                
                // Only collect one heart per frame
                break;
            }
        }
    }
    
    triggerCollectionAnimation() {
        this.collectingAnimation = 1.0; // Start collection animation
        this.state = 'collecting';
    }
    
    showBlockedIndicator() {
        this.blockedIndicatorTime = 0.5; // Show blocked indicator for 0.5 seconds
    }
    
    updateVisualEffects(deltaTime) {
        // Update blocked indicator
        if (this.blockedIndicatorTime > 0) {
            this.blockedIndicatorTime -= deltaTime;
        }
        
        // Update collection animation
        if (this.collectingAnimation > 0) {
            this.collectingAnimation -= deltaTime * 2; // Fade out over 0.5 seconds
            if (this.collectingAnimation <= 0) {
                this.state = this.state === 'collecting' ? 'idle' : this.state;
            }
        }
    }
    
    render(ctx) {
        // Determine colors and effects based on state
        let bodyColor = '#ffb3d4';  // Softer pink
        let bellyColor = '#ffc8dd'; // Light pink belly
        let earColor = '#ff9bb5';   // Coordinated ear color
        let earInnerColor = '#ffd1dc'; // Inner ear color
        
        if (this.state === 'blocked' && this.blockedIndicatorTime > 0) {
            bodyColor = '#ff9bb5'; // Slightly darker when blocked
            earColor = '#ff7799';
            bellyColor = '#ffb3c6';
        } else if (this.state === 'collecting') {
            const glowFactor = Math.sin(this.animationTime * 10) * 0.3 + 0.7;
            bodyColor = this.interpolateColor('#ffb3d4', '#ffdd77', glowFactor);
            bellyColor = this.interpolateColor('#ffc8dd', '#fff4aa', glowFactor);
        }
        
        // Movement animation
        const bounce = this.state === 'moving' ? Math.sin(this.animationTime * 8) * 1.5 : 0;
        const currentY = this.y + bounce;
        
        // Draw bunny shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height - 2, 
                   this.width/2 - 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bunny body (oval-shaped)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, currentY + this.height/2 + 2, 
                   this.width/2 - 1, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw belly
        ctx.fillStyle = bellyColor;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, currentY + this.height/2 + 4, 
                   this.width/3, this.height/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bunny ears with enhanced animation
        const earBob = Math.sin(this.animationTime * 3) * 1.5 + bounce * 0.5;
        const earTilt = this.state === 'moving' ? Math.sin(this.animationTime * 6) * 0.1 : 0;
        
        // Left ear
        ctx.save();
        ctx.translate(this.x + 7, currentY + 6 + earBob);
        ctx.rotate(-0.2 + earTilt);
        
        ctx.fillStyle = earColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = earInnerColor;
        ctx.beginPath();
        ctx.ellipse(0, 1, 2, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Right ear
        ctx.save();
        ctx.translate(this.x + 18, currentY + 6 + earBob);
        ctx.rotate(0.2 - earTilt);
        
        ctx.fillStyle = earColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = earInnerColor;
        ctx.beginPath();
        ctx.ellipse(0, 1, 2, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Draw enhanced eyes with expression
        const eyeBlink = Math.sin(this.animationTime * 0.5) > 0.95 ? 0.3 : 1;
        const eyeHeight = 3 * eyeBlink;
        
        // Eye whites
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(this.x + 9, currentY + 12, 2.5, eyeHeight, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 16, currentY + 12, 2.5, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(this.x + 9, currentY + 12, 1.5, eyeHeight * 0.8, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 16, currentY + 12, 1.5, eyeHeight * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye shine
        if (eyeBlink > 0.5) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x + 10, currentY + 11, 0.5, 0, Math.PI * 2);
            ctx.arc(this.x + 17, currentY + 11, 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw cute nose
        ctx.fillStyle = '#ff6b8a';
        ctx.beginPath();
        ctx.moveTo(this.x + 12.5, currentY + 15);
        ctx.lineTo(this.x + 11.5, currentY + 17);
        ctx.lineTo(this.x + 13.5, currentY + 17);
        ctx.closePath();
        ctx.fill();
        
        // Draw whiskers
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Left whiskers
        ctx.moveTo(this.x + 5, currentY + 15);
        ctx.lineTo(this.x + 9, currentY + 15.5);
        ctx.moveTo(this.x + 5, currentY + 17);
        ctx.lineTo(this.x + 9, currentY + 17);
        // Right whiskers
        ctx.moveTo(this.x + 16, currentY + 15.5);
        ctx.lineTo(this.x + 20, currentY + 15);
        ctx.moveTo(this.x + 16, currentY + 17);
        ctx.lineTo(this.x + 20, currentY + 17);
        ctx.stroke();
        
        // Draw cute little paws
        ctx.fillStyle = '#ff9bb5';
        ctx.beginPath();
        ctx.arc(this.x + 6, currentY + this.height - 3, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 19, currentY + this.height - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw blocked indicator
        if (this.blockedIndicatorTime > 0) {
            this.drawBlockedIndicator(ctx);
        }
        
        // Draw collection animation
        if (this.collectingAnimation > 0) {
            this.drawCollectionEffect(ctx);
        }
    }
    
    drawBlockedIndicator(ctx) {
        const alpha = this.blockedIndicatorTime * 2; // Fade out
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw "X" symbol above bunny
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const centerX = this.x + this.width/2;
        const centerY = this.y - 10;
        ctx.moveTo(centerX - 5, centerY - 5);
        ctx.lineTo(centerX + 5, centerY + 5);
        ctx.moveTo(centerX + 5, centerY - 5);
        ctx.lineTo(centerX - 5, centerY + 5);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawCollectionEffect(ctx) {
        const alpha = this.collectingAnimation;
        const scale = 1 + (1 - this.collectingAnimation) * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw sparkle effect
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        
        ctx.fillStyle = '#ffdd44';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 15 * scale;
            const sparkleX = centerX + Math.cos(angle) * distance;
            const sparkleY = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 2 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bunny;
} 