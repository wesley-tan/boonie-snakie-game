/**
 * Game State Manager - Handles overall game state, level progression, and scoring
 */
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.totalHearts = 0;
        this.gamePhase = 'playing'; // 'playing', 'level_complete', 'game_over', 'paused'
        this.timeElapsed = 0;
        this.gameStartTime = Date.now();
        
        // Game objects references
        this.bunny = null;
        this.snake = null;
        this.level = null;
        
        // Systems references
        this.inputManager = null;
        this.collisionManager = null;
        this.terrainManager = null;
        
        // UI elements
        this.scoreElement = null;
        this.levelElement = null;
        this.statusElement = null;
    }
    
    // Initialize with required systems and UI elements
    initialize(bunny, snake, level, systems, uiElements) {
        this.bunny = bunny;
        this.snake = snake;
        this.level = level;
        
        this.inputManager = systems.inputManager;
        this.collisionManager = systems.collisionManager;
        this.terrainManager = systems.terrainManager;
        
        this.scoreElement = uiElements.scoreElement;
        this.levelElement = uiElements.levelElement;
        this.statusElement = uiElements.statusElement;
        
        this.updateUI();
    }
    
    // Main update loop
    update(deltaTime) {
        if (this.gamePhase !== 'playing') return;
        
        this.timeElapsed += deltaTime;
        
        // Update game objects
        if (this.bunny) this.bunny.update(deltaTime);
        if (this.snake) this.snake.update(deltaTime);
        
        // Check for level completion
        this.checkLevelCompletion();
    }
    
    // Check if required hearts have been collected
    checkLevelCompletion() {
        if (!this.level || !this.level.hearts) return;
        
        const collectedHearts = this.level.hearts.filter(heart => heart.collected).length;
        const requiredHearts = this.level.requiredHearts || this.level.hearts.length;
        
        if (collectedHearts >= requiredHearts && this.gamePhase === 'playing') {
            this.levelComplete();
        }
    }
    
    // Handle level completion
    levelComplete() {
        this.gamePhase = 'level_complete';
        const collectedHearts = this.level.hearts.filter(heart => heart.collected).length;
        const requiredHearts = this.level.requiredHearts || this.level.hearts.length;
        const totalHearts = this.level.hearts.length;
        
        let message = `🎉 Level ${this.currentLevel} Complete! `;
        if (collectedHearts > requiredHearts) {
            message += `Perfect score: ${collectedHearts}/${totalHearts} hearts! `;
        } else {
            message += `${collectedHearts}/${requiredHearts} hearts collected! `;
        }
        message += 'Press R to continue';
        
        this.updateStatusMessage(message, 'success');
    }
    
    // Progress to next level
    nextLevel() {
        this.currentLevel++;
        this.gamePhase = 'playing';
        this.updateUI();
        
        // Dispatch custom event for level change
        const event = new CustomEvent('levelChange', { 
            detail: { level: this.currentLevel }
        });
        document.dispatchEvent(event);
    }
    
    // Collect a heart (called by bunny)
    collectHeart() {
        this.score++;
        this.updateScoreDisplay();
        
        // Visual/audio feedback could be triggered here
        this.dispatchEvent('heartCollected', { score: this.score });
        
        // Force UI refresh to ensure score updates immediately
        this.updateUI();
    }
    
    // Update UI elements
    updateUI() {
        this.updateScoreDisplay();
        this.updateLevelDisplay();
        this.updateStatusMessage(`Level ${this.currentLevel} - Snake: Press SPACE to bridge, then WASD to extend! 🐍💕`, 'info');
    }
    
    updateScoreDisplay() {
        if (this.scoreElement && this.level) {
            const collectedHearts = this.level.hearts.filter(heart => heart.collected).length;
            const requiredHearts = this.level.requiredHearts || this.level.hearts.length;
            const totalHearts = this.level.hearts.length;
            
            // Display as "collected/required" or "collected/total" if they're the same
            if (requiredHearts === totalHearts) {
                this.scoreElement.textContent = `${collectedHearts}/${totalHearts}`;
            } else {
                this.scoreElement.textContent = `${collectedHearts}/${requiredHearts} (${totalHearts} total)`;
            }
        }
    }
    
    updateLevelDisplay() {
        if (this.levelElement) {
            this.levelElement.textContent = this.currentLevel;
        }
    }
    
    updateStatusMessage(message, type = 'info') {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `game-status ${type}`;
        }
    }
    
    // Reset game state for new game
    resetGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.gamePhase = 'playing';
        this.timeElapsed = 0;
        this.gameStartTime = Date.now();
        this.updateUI();
    }
    
    // Pause/unpause game
    togglePause() {
        if (this.gamePhase === 'playing') {
            this.gamePhase = 'paused';
            this.updateStatusMessage('Game Paused - Press P to resume', 'info');
        } else if (this.gamePhase === 'paused') {
            this.gamePhase = 'playing';
            this.updateStatusMessage(`Level ${this.currentLevel} - Work together to collect all hearts! 💕`, 'info');
        }
    }
    
    // Event system for game events
    dispatchEvent(eventType, data) {
        const event = new CustomEvent(eventType, { detail: data });
        document.dispatchEvent(event);
    }
    
    // Get current game statistics
    getGameStats() {
        return {
            level: this.currentLevel,
            score: this.score,
            timeElapsed: this.timeElapsed,
            phase: this.gamePhase
        };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
} 