/**
 * Level Manager - Handles loading and managing game levels
 */
class LevelManager {
    constructor() {
        this.levels = {};
        this.currentLevel = null;
        this.currentLevelId = 1;
        this.maxLevels = 4; // We have 4 levels currently
    }
    
    // Load a level by ID
    async loadLevel(levelId) {
        try {
            // In a real implementation, this would fetch from server
            // For now, we'll simulate level data
            const levelData = this.getLevelData(levelId);
            
            if (!levelData) {
                throw new Error(`Level ${levelId} not found`);
            }
            
            this.currentLevel = this.createLevelFromData(levelData);
            this.currentLevelId = levelId;
            
            return this.currentLevel;
        } catch (error) {
            console.error('Failed to load level:', error);
            return null;
        }
    }
    
    // Get level data (simulated JSON loading)
    getLevelData(levelId) {
        console.log(`🔍 LevelManager: Requesting level ${levelId}`);
        
        const levelDataMap = {
            1: {
                id: 1,
                name: "First Steps",
                description: "Learn to work together! Snake creates bridges for bunny.",
                bunnyStart: [50, 50],
                snakeStart: [100, 100],
                water: [
                    { x: 200, y: 150, width: 150, height: 80 },
                    { x: 450, y: 300, width: 120, height: 100 }
                ],
                hearts: [
                    { x: 280, y: 160 },
                    { x: 500, y: 320 },
                    { x: 650, y: 500 }
                ],
                requiredHearts: 3,
                tips: [
                    "🐍 Press SPACE to activate bridge mode",
                    "🐰 Bunny cannot enter water alone",
                    "🤝 Work together to reach all hearts!"
                ]
            },
            2: {
                id: 2,
                name: "Strategic Thinking",
                description: "Plan your moves! Snake length is limited.",
                bunnyStart: [30, 30],
                snakeStart: [80, 80],
                water: [
                    { x: 150, y: 100, width: 100, height: 150 },
                    { x: 300, y: 200, width: 80, height: 80 },
                    { x: 500, y: 100, width: 120, height: 200 },
                    { x: 200, y: 400, width: 300, height: 80 }
                ],
                hearts: [
                    { x: 180, y: 120 },
                    { x: 420, y: 150 },
                    { x: 650, y: 200 },
                    { x: 350, y: 420 },
                    { x: 700, y: 50 }
                ],
                requiredHearts: 5,
                tips: [
                    "⚠️ Snake has limited length!",
                    "🧠 Plan your bridge path carefully",
                    "🔄 Snake can reposition by moving backward"
                ]
            },
            3: {
                id: 3,
                name: "Master Challenge",
                description: "The ultimate test of cooperation and strategy!",
                bunnyStart: [40, 300],
                snakeStart: [40, 200],
                water: [
                    { x: 100, y: 100, width: 200, height: 60 },
                    { x: 200, y: 200, width: 60, height: 200 },
                    { x: 350, y: 150, width: 180, height: 100 },
                    { x: 580, y: 300, width: 100, height: 200 },
                    { x: 100, y: 450, width: 400, height: 60 }
                ],
                hearts: [
                    { x: 180, y: 110 },
                    { x: 220, y: 250 },
                    { x: 420, y: 170 },
                    { x: 620, y: 350 },
                    { x: 280, y: 470 },
                    { x: 750, y: 100 }
                ],
                requiredHearts: 4,
                tips: [
                    "🎯 Only 4 hearts needed out of 6!",
                    "🤔 Choose your path wisely",
                    "🐍 Snake management is crucial"
                ]
            },
            4: {
                id: 4,
                name: "The Great Flood",
                description: "Pure water challenge - Snakie must bridge everything!",
                bunnyStart: [50, 250],
                snakeStart: [100, 280],
                water: [
                    { x: 120, y: 0, width: 680, height: 600 },
                    { x: 0, y: 0, width: 800, height: 120 },
                    { x: 0, y: 480, width: 800, height: 120 }
                ],
                hearts: [
                    { x: 200, y: 200 },
                    { x: 400, y: 350 },
                    { x: 600, y: 150 },
                    { x: 750, y: 300 }
                ],
                requiredHearts: 3,
                tips: [
                    "🌊 Everything is flooded!",
                    "🐍 Snake must bridge ALL movements",
                    "💡 Plan your 8-segment snake path carefully!",
                    "🎯 Only 3 hearts needed out of 4"
                ]
            }
        };
        
        const result = levelDataMap[levelId] || null;
        console.log(`📁 LevelManager: Level ${levelId} data ${result ? 'found' : 'NOT FOUND'}`);
        if (result) {
            console.log(`📋 Level ${levelId} info:`, {
                name: result.name,
                hearts: result.hearts.length,
                water: result.water.length
            });
        }
        
        return result;
    }
    
    // Create level object from JSON data
    createLevelFromData(data) {
        const level = {
            id: data.id,
            name: data.name,
            description: data.description,
            bunnyStart: { x: data.bunnyStart[0], y: data.bunnyStart[1] },
            snakeStart: { x: data.snakeStart[0], y: data.snakeStart[1] },
            waterObstacles: data.water || [],
            hearts: [],
            requiredHearts: data.requiredHearts || data.hearts.length,
            tips: data.tips || []
        };
        
        // Create HeartCarrot objects
        for (let heartData of data.hearts) {
            const heart = new HeartCarrot(heartData.x, heartData.y);
            level.hearts.push(heart);
        }
        
        return level;
    }
    
    // Get current level
    getCurrentLevel() {
        return this.currentLevel;
    }
    
    // Get current level ID
    getCurrentLevelId() {
        return this.currentLevelId;
    }
    
    // Check if there's a next level
    hasNextLevel() {
        return this.currentLevelId < this.maxLevels;
    }
    
    // Load next level
    async loadNextLevel() {
        if (this.hasNextLevel()) {
            return await this.loadLevel(this.currentLevelId + 1);
        }
        return null;
    }
    
    // Get level completion statistics
    getLevelStats() {
        if (!this.currentLevel) return null;
        
        const collectedHearts = this.currentLevel.hearts.filter(heart => heart.collected).length;
        const totalHearts = this.currentLevel.hearts.length;
        const isComplete = collectedHearts >= this.currentLevel.requiredHearts;
        
        return {
            levelId: this.currentLevelId,
            levelName: this.currentLevel.name,
            collectedHearts,
            totalHearts,
            requiredHearts: this.currentLevel.requiredHearts,
            isComplete,
            completionPercentage: (collectedHearts / totalHearts) * 100
        };
    }
    
    // Reset current level
    resetCurrentLevel() {
        if (this.currentLevel) {
            // Reset all hearts
            for (let heart of this.currentLevel.hearts) {
                heart.collected = false;
                heart.collectionAnimation = 0;
            }
        }
    }
    
    // Get level tips for UI display
    getCurrentLevelTips() {
        return this.currentLevel ? this.currentLevel.tips : [];
    }
    
    // Update level objects (hearts, etc.)
    updateLevel(deltaTime) {
        if (!this.currentLevel) return;
        
        // Update all hearts
        for (let heart of this.currentLevel.hearts) {
            heart.update(deltaTime);
        }
    }
    
    // Render level objects
    renderLevel(ctx) {
        if (!this.currentLevel) return;
        
        // Render all hearts
        for (let heart of this.currentLevel.hearts) {
            heart.render(ctx);
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelManager;
} 