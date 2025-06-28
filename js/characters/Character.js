/**
 * Base Character Class - Common functionality for Bunny and Snake
 */
class Character {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'bunny' or 'snake'
        
        // Movement properties
        this.speed = 2;
        this.lastPosition = { x: x, y: y };
        
        // Animation properties
        this.animationTime = 0;
        this.state = 'idle'; // 'idle', 'moving', 'blocked'
        
        // Systems references (to be set by game)
        this.collisionManager = null;
        this.terrainManager = null;
        this.gameState = null;
    }
    
    // Set system references
    setSystems(collisionManager, terrainManager, gameState) {
        this.collisionManager = collisionManager;
        this.terrainManager = terrainManager;
        this.gameState = gameState;
    }
    
    // Get bounding rectangle for collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Update position and save last position
    updatePosition(newX, newY) {
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        this.x = newX;
        this.y = newY;
    }
    
    // Revert to last valid position
    revertPosition() {
        this.x = this.lastPosition.x;
        this.y = this.lastPosition.y;
    }
    
    // Check if position is within canvas bounds
    isWithinBounds(x, y) {
        return x >= 0 && y >= 0 && 
               x + this.width <= this.terrainManager.canvasWidth && 
               y + this.height <= this.terrainManager.canvasHeight;
    }
    
    // Update animation timer
    updateAnimation(deltaTime) {
        this.animationTime += deltaTime * 0.005; // Slow down animation
    }
    
    // Abstract methods to be implemented by subclasses
    update(deltaTime) {
        throw new Error('update() must be implemented by subclass');
    }
    
    render(ctx) {
        throw new Error('render() must be implemented by subclass');
    }
    
    // Utility method for smooth color transitions
    interpolateColor(color1, color2, factor) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Convert hex color to RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Character;
} 