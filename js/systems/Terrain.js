/**
 * Terrain Manager - Handles terrain types, water obstacles, and terrain rules
 */
class TerrainManager {
    constructor() {
        this.TERRAIN_TYPES = {
            LAND: {
                bunnyPassable: true,
                snakePassable: true,
                color: '#81c784',
                texture: 'grass'
            },
            WATER: {
                bunnyPassable: false,
                snakePassable: true,
                color: '#4fc3f7',
                texture: 'animated_waves'
            },
            SNAKE_BRIDGE: {
                bunnyPassable: true,
                snakePassable: true,
                dynamic: true
            }
        };
        
        this.waterObstacles = [];
        this.canvasWidth = 800;
        this.canvasHeight = 600;
    }
    
    // Set canvas dimensions
    setCanvasDimensions(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
    
    // Add water obstacles from level data
    loadWaterObstacles(waterData) {
        this.waterObstacles = waterData.map(water => ({
            x: water.x,
            y: water.y,
            width: water.width,
            height: water.height,
            type: 'water',
            getBounds() {
                return { x: this.x, y: this.y, width: this.width, height: this.height };
            }
        }));
    }
    
    // Get terrain type at a specific position/bounds
    getTerrainAt(bounds) {
        // Check if position overlaps with any water obstacle
        for (let water of this.waterObstacles) {
            if (this.boundsOverlap(bounds, water)) {
                return 'WATER';
            }
        }
        return 'LAND'; // Default to land
    }
    
    // Check if two bounds overlap
    boundsOverlap(bounds1, bounds2) {
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }
    
    // Render terrain (grass background and water obstacles)
    render(ctx) {
        // Draw grass background
        ctx.fillStyle = this.TERRAIN_TYPES.LAND.color;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Add grass texture
        ctx.fillStyle = '#66bb6a';
        for (let x = 0; x < this.canvasWidth; x += 40) {
            for (let y = 0; y < this.canvasHeight; y += 40) {
                // Random grass blades
                const offsetX = Math.random() * 5;
                const offsetY = Math.random() * 5;
                ctx.fillRect(x + offsetX, y + offsetY, 3, 8);
                ctx.fillRect(x + 15 + offsetX, y + 20 + offsetY, 3, 8);
            }
        }
        
        // Draw water obstacles
        this.renderWaterObstacles(ctx);
    }
    
    // Render animated water obstacles
    renderWaterObstacles(ctx) {
        const time = Date.now() * 0.003; // Animation timer
        
        for (let water of this.waterObstacles) {
            // Main water body
            ctx.fillStyle = this.TERRAIN_TYPES.WATER.color;
            ctx.fillRect(water.x, water.y, water.width, water.height);
            
            // Animated wave effect
            ctx.fillStyle = '#29b6f6';
            for (let i = 0; i < water.width; i += 20) {
                const waveOffset = Math.sin((i * 0.1) + time) * 2;
                ctx.fillRect(water.x + i, water.y + 5 + waveOffset, 15, 3);
                ctx.fillRect(water.x + i + 10, water.y + water.height - 8 - waveOffset, 15, 3);
            }
            
            // Water border effect
            ctx.strokeStyle = '#0288d1';
            ctx.lineWidth = 2;
            ctx.strokeRect(water.x, water.y, water.width, water.height);
        }
    }
    
    // Get all water obstacles (for collision detection)
    getWaterObstacles() {
        return this.waterObstacles;
    }
    
    // Check if a position is valid (within canvas bounds)
    isValidPosition(x, y, width = 0, height = 0) {
        return x >= 0 && y >= 0 && 
               x + width <= this.canvasWidth && 
               y + height <= this.canvasHeight;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerrainManager;
} 