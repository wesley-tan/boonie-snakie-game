/**
 * Input Manager - Handles all user input with browser prevention
 */
class InputManager {
    constructor() {
        this.keys = new Set();
        this.preventBrowserDefault = true;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            try {
                // Prevent browser scrolling for game keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                    e.preventDefault();
                }
                this.keys.add(e.key);
            } catch (error) {
                console.error('Error handling keydown:', error);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            try {
                this.keys.delete(e.key);
            } catch (error) {
                console.error('Error handling keyup:', error);
            }
        });
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    isKeyPressed(key) {
        try {
            return this.keys.has(key);
        } catch (error) {
            console.error('Error checking key press:', error);
            return false;
        }
    }
    
    // Helper methods for common key checks
    isBunnyMoving() {
        return this.isKeyPressed('ArrowUp') || 
               this.isKeyPressed('ArrowDown') || 
               this.isKeyPressed('ArrowLeft') || 
               this.isKeyPressed('ArrowRight');
    }
    
    isSnakeMoving() {
        return this.isKeyPressed('w') || this.isKeyPressed('W') ||
               this.isKeyPressed('a') || this.isKeyPressed('A') ||
               this.isKeyPressed('s') || this.isKeyPressed('S') ||
               this.isKeyPressed('d') || this.isKeyPressed('D');
    }
    
    getBunnyDirection() {
        if (this.isKeyPressed('ArrowUp')) return { x: 0, y: -1 };
        if (this.isKeyPressed('ArrowDown')) return { x: 0, y: 1 };
        if (this.isKeyPressed('ArrowLeft')) return { x: -1, y: 0 };
        if (this.isKeyPressed('ArrowRight')) return { x: 1, y: 0 };
        return { x: 0, y: 0 };
    }
    
    getSnakeDirection() {
        if (this.isKeyPressed('w') || this.isKeyPressed('W')) return { x: 0, y: -1 };
        if (this.isKeyPressed('s') || this.isKeyPressed('S')) return { x: 0, y: 1 };
        if (this.isKeyPressed('a') || this.isKeyPressed('A')) return { x: -1, y: 0 };
        if (this.isKeyPressed('d') || this.isKeyPressed('D')) return { x: 1, y: 0 };
        return { x: 0, y: 0 };
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
} 