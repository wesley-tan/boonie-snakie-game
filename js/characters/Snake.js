/**
 * Snake Character - WASD controlled when in bridge mode, limited length, can traverse water
 */
class Snake extends Character {
    constructor(x, y) {
        super(x, y, 18, 18, 'snake');
        this.speed = 2;
        
        // Snake-specific properties
        this.canEnterWater = true;
        this.canEnterLand = true;
        this.canCollectHearts = false;
        
        // Bridge mechanics
        this.bridgeMode = false;
        this.maxLength = 8; // Limited segments for strategy
        this.segments = [
            { x: x, y: y },
            { x: x - 20, y: y },
            { x: x - 40, y: y }
        ]; // Start with 3 segments
        
        // Input handling
        this.spacePressed = false;
        this.lastMoveTime = 0;
        this.moveDelay = 100; // Milliseconds between moves for smooth snake movement
        
        // Visual effects
        this.bridgeActivationAnimation = 0;
        this.segmentPulse = 0;
    }
    
    update(deltaTime) {
        this.updateAnimation(deltaTime);
        this.updateBridgeMode(deltaTime);
        this.updateMovement(deltaTime);
        this.updateVisualEffects(deltaTime);
    }
    
    updateBridgeMode(deltaTime) {
        if (!this.gameState || !this.gameState.inputManager) return;
        
        const input = this.gameState.inputManager;
        
        // Toggle bridge mode with spacebar
        if (input.isKeyPressed(' ')) {
            if (!this.spacePressed) {
                this.bridgeMode = !this.bridgeMode;
                this.triggerBridgeActivation();
                this.spacePressed = true;
            }
        } else {
            this.spacePressed = false;
        }
    }
    
    updateMovement(deltaTime) {
        if (!this.bridgeMode || !this.gameState || !this.gameState.inputManager) return;
        
        // Add move delay for smoother snake movement
        this.lastMoveTime += deltaTime;
        if (this.lastMoveTime < this.moveDelay) return;
        
        const input = this.gameState.inputManager;
        const direction = input.getSnakeDirection();
        
        // Only move if there's input and we're in bridge mode
        if (direction.x !== 0 || direction.y !== 0) {
            this.moveSnake(direction);
            this.lastMoveTime = 0;
            this.state = 'moving';
        } else {
            this.state = 'idle';
        }
    }
    
    moveSnake(direction) {
        const head = this.segments[0];
        const newHead = {
            x: head.x + direction.x * this.speed * 8, // Larger steps for snake
            y: head.y + direction.y * this.speed * 8
        };
        
        // Check bounds
        if (!this.isWithinBounds(newHead.x, newHead.y)) {
            return; // Don't move if out of bounds
        }
        
        // Add new head
        this.segments.unshift(newHead);
        
        // Limit snake length - this is the key strategic element!
        if (this.segments.length > this.maxLength) {
            this.segments.pop(); // Remove tail
        }
        
        // Update main position for collision detection
        this.updatePosition(newHead.x, newHead.y);
    }
    
    triggerBridgeActivation() {
        this.bridgeActivationAnimation = 1.0; // Start activation animation
    }
    
    updateVisualEffects(deltaTime) {
        // Update bridge activation animation
        if (this.bridgeActivationAnimation > 0) {
            this.bridgeActivationAnimation -= deltaTime * 2;
        }
        
        // Update segment pulse for bridge mode
        if (this.bridgeMode) {
            this.segmentPulse += deltaTime * 0.003;
        }
    }
    
    render(ctx) {
        // Draw snake segments
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.renderSegment(ctx, segment, i);
        }
        
        // Draw bridge activation effect
        if (this.bridgeActivationAnimation > 0) {
            this.drawBridgeActivationEffect(ctx);
        }
    }
    
    renderSegment(ctx, segment, index) {
        const isHead = index === 0;
        let baseColor = isHead ? '#2e7d32' : '#4caf50';
        let accentColor = isHead ? '#4caf50' : '#66bb6a';
        let highlightColor = '#81c784';
        
        // Enhanced colors when in bridge mode
        if (this.bridgeMode) {
            baseColor = isHead ? '#1b5e20' : '#2e7d32';
            accentColor = isHead ? '#4caf50' : '#66bb6a';
            highlightColor = '#a5d6a7';
            
            // Add pulsing effect for bridge segments
            const pulse = Math.sin(this.segmentPulse + index * 0.5) * 0.3 + 0.7;
            const rgb = this.hexToRgb(baseColor);
            if (rgb) {
                const pulseR = Math.round(rgb.r * pulse);
                const pulseG = Math.round(rgb.g * pulse);
                const pulseB = Math.round(rgb.b * pulse);
                baseColor = `rgb(${pulseR}, ${pulseG}, ${pulseB})`;
            }
        }
        
        const radius = isHead ? this.width/2 : (this.width/2) - 1;
        const centerX = segment.x + this.width/2;
        const centerY = segment.y + this.height/2;
        
        // Draw segment shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(centerX + 1, centerY + 2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw segment body with gradient effect
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw scale pattern
        if (!isHead) {
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(centerX - 3, centerY - 3, 2, 0, Math.PI * 2);
            ctx.arc(centerX + 3, centerY - 3, 2, 0, Math.PI * 2);
            ctx.arc(centerX, centerY + 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw highlight
        ctx.fillStyle = highlightColor;
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY - 2, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw head features
        if (isHead) {
            this.drawEnhancedSnakeHead(ctx, segment);
        }
        
        // Draw bridge indicator on segments
        if (this.bridgeMode && !isHead) {
            // Bridge mode outline
            ctx.strokeStyle = '#ffeb3b';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Bridge stability indicator
            const stability = Math.sin(this.segmentPulse + index) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 235, 59, ${stability * 0.3})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw segment connections
        if (index < this.segments.length - 1) {
            this.drawSegmentConnection(ctx, segment, this.segments[index + 1]);
        }
    }
    
    drawEnhancedSnakeHead(ctx, headSegment) {
        const centerX = headSegment.x + this.width/2;
        const centerY = headSegment.y + this.height/2;
        
        // Draw enhanced eyes with whites
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(headSegment.x + 6, headSegment.y + 6, 3, 2.5, 0, 0, Math.PI * 2);
        ctx.ellipse(headSegment.x + 12, headSegment.y + 6, 3, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(headSegment.x + 6, headSegment.y + 6, 2, 1.8, 0, 0, Math.PI * 2);
        ctx.ellipse(headSegment.x + 12, headSegment.y + 6, 2, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(headSegment.x + 7, headSegment.y + 5.5, 0.5, 0, Math.PI * 2);
        ctx.arc(headSegment.x + 13, headSegment.y + 5.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nostrils
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath();
        ctx.arc(headSegment.x + 8, headSegment.y + 10, 0.5, 0, Math.PI * 2);
        ctx.arc(headSegment.x + 10, headSegment.y + 10, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw enhanced forked tongue with more realistic animation
        const tongueFlicker = Math.sin(this.animationTime * 6) > 0.6;
        const tongueLength = Math.sin(this.animationTime * 6) * 2 + 3;
        
        if (tongueFlicker) {
            ctx.strokeStyle = '#ff5722';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            
            // Main tongue
            ctx.beginPath();
            ctx.moveTo(centerX, headSegment.y + this.height - 1);
            ctx.lineTo(centerX, headSegment.y + this.height + tongueLength);
            ctx.stroke();
            
            // Forked tips
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(centerX, headSegment.y + this.height + tongueLength);
            ctx.lineTo(centerX - 2, headSegment.y + this.height + tongueLength + 2);
            ctx.moveTo(centerX, headSegment.y + this.height + tongueLength);
            ctx.lineTo(centerX + 2, headSegment.y + this.height + tongueLength + 2);
            ctx.stroke();
        }
        
        // Draw friendly expression when in bridge mode
        if (this.bridgeMode) {
            // Draw happy expression lines
            ctx.strokeStyle = '#2e7d32';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Smile lines near eyes
            ctx.arc(headSegment.x + 4, headSegment.y + 8, 2, 0, Math.PI * 0.5);
            ctx.arc(headSegment.x + 14, headSegment.y + 8, 2, Math.PI * 0.5, Math.PI);
            ctx.stroke();
        }
    }
    
    drawSegmentConnection(ctx, segment1, segment2) {
        if (!this.bridgeMode) return;
        
        // Draw subtle connection line between segments
        ctx.strokeStyle = '#66bb6a';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(segment1.x + this.width/2, segment1.y + this.height/2);
        ctx.lineTo(segment2.x + this.width/2, segment2.y + this.height/2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }
    
    drawBridgeActivationEffect(ctx) {
        const alpha = this.bridgeActivationAnimation;
        const scale = 1 + (1 - this.bridgeActivationAnimation) * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Draw expanding circle effect around snake
        for (let segment of this.segments) {
            ctx.strokeStyle = '#4caf50';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(segment.x + this.width/2, segment.y + this.height/2, 
                   (this.width/2 + 10) * scale, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // Override getBounds to include all segments
    getBounds() {
        if (this.segments.length === 0) return super.getBounds();
        
        let minX = this.segments[0].x;
        let minY = this.segments[0].y;
        let maxX = this.segments[0].x + this.width;
        let maxY = this.segments[0].y + this.height;
        
        for (let segment of this.segments) {
            minX = Math.min(minX, segment.x);
            minY = Math.min(minY, segment.y);
            maxX = Math.max(maxX, segment.x + this.width);
            maxY = Math.max(maxY, segment.y + this.height);
        }
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    // Get individual segment bounds for collision detection
    getSegmentBounds() {
        return this.segments.map(segment => ({
            x: segment.x,
            y: segment.y,
            width: this.width,
            height: this.height
        }));
    }
    
    // Check if bunny can walk on this snake
    canSupportBunny(bunnyBounds) {
        if (!this.bridgeMode) {
            return false;
        }
        
        for (let segment of this.segments) {
            const segmentBounds = {
                x: segment.x,
                y: segment.y,
                width: this.width,
                height: this.height
            };
            
            if (this.collisionManager && this.collisionManager.rectanglesOverlap(bunnyBounds, segmentBounds)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Get current segment count for UI display
    getSegmentCount() {
        return this.segments.length;
    }
    
    // Get max length for UI display
    getMaxLength() {
        return this.maxLength;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Snake;
} 