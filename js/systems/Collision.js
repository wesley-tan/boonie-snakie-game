/**
 * Collision Manager - Handles all collision detection and terrain rules
 */
class CollisionManager {
    constructor(terrainManager) {
        this.terrainManager = terrainManager;
    }
    
    // Basic rectangle collision detection
    rectanglesOverlap(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Check if a character can move to a specific position
    checkTerrainCollision(character, newPosition) {
        const bounds = {
            x: newPosition.x,
            y: newPosition.y,
            width: character.width,
            height: character.height
        };
        
        const terrain = this.terrainManager.getTerrainAt(bounds);
        
        // Apply terrain rules based on character type
        if (character.type === 'bunny') {
            return terrain !== 'WATER'; // Bunny cannot enter water
        } else if (character.type === 'snake') {
            return true; // Snake can go anywhere
        }
        
        return true;
    }
    
    // Check if bunny can walk on snake segments
    checkSnakeBridgeCollision(bunny, snake) {
        if (!snake || !snake.bridgeMode) {
            return false;
        }
        
        const bunnyBounds = bunny.getBounds ? bunny.getBounds() : bunny;
        
        for (let segment of snake.segments) {
            const segmentBounds = {
                x: segment.x,
                y: segment.y,
                width: snake.width,
                height: snake.height
            };
            
            if (this.rectanglesOverlap(bunnyBounds, segmentBounds)) {
                return true; // Bunny can walk on snake
            }
        }
        
        return false;
    }
    
    // Check collision between two game objects
    checkObjectCollision(obj1, obj2) {
        try {
            if (!obj1 || !obj2) return false;
            
            const bounds1 = obj1.getBounds ? obj1.getBounds() : obj1;
            const bounds2 = obj2.getBounds ? obj2.getBounds() : obj2;
            
            return this.rectanglesOverlap(bounds1, bounds2);
        } catch (error) {
            console.error('Error in object collision check:', error);
            return false;
        }
    }
    
    // Check if position is within canvas bounds
    isWithinBounds(position, width, height, canvasWidth, canvasHeight) {
        return position.x >= 0 && 
               position.y >= 0 && 
               position.x + width <= canvasWidth && 
               position.y + height <= canvasHeight;
    }
    
    // Get all water obstacles that overlap with a rectangle
    getWaterCollisions(bounds, waterObstacles) {
        if (!bounds || !waterObstacles || !Array.isArray(waterObstacles)) {
            return [];
        }
        
        return waterObstacles.filter(water => {
            try {
                const waterBounds = water.getBounds ? water.getBounds() : water;
                return this.rectanglesOverlap(bounds, waterBounds);
            } catch (error) {
                console.error('Error checking water collision:', error);
                return false;
            }
        });
    }
    
    // Check if bunny can move to position (considering snake bridge)
    canBunnyMoveTo(bunny, newPosition, snake, waterObstacles) {
        const newBounds = {
            x: newPosition.x,
            y: newPosition.y,
            width: bunny.width,
            height: bunny.height
        };
        
        // Get current bunny position
        const currentBounds = bunny.getBounds();
        
        // Check if bunny is currently in water
        const currentWaterCollisions = this.getWaterCollisions(currentBounds, waterObstacles);
        const newWaterCollisions = this.getWaterCollisions(newBounds, waterObstacles);
        
        // If bunny is moving from water to land, always allow (escape route)
        if (currentWaterCollisions.length > 0 && newWaterCollisions.length === 0) {
            return true;
        }
        
        // If bunny is trying to enter water
        if (newWaterCollisions.length > 0) {
            if (!snake || !snake.bridgeMode) {
                return false;
            }
            
            // Check if snake provides bridge
            const tempBunny = { ...bunny, x: newPosition.x, y: newPosition.y };
            return this.checkSnakeBridgeCollision(tempBunny, snake);
        }
        
        return true; // No water collision, movement allowed
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionManager;
} 