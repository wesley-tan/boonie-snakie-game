/**
 * Tutorial Manager - Provides clear instructions and guidance for new players
 */
class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.tutorialActive = true;
        this.tutorialSteps = [
            {
                id: 'welcome',
                title: 'Welcome to Boonie Snakie Carrot Adventure! 💕',
                message: 'Meet Boonie the bunny! Use ARROW KEYS to help her move around.',
                highlight: 'bunny',
                duration: 5000
            },
            {
                id: 'collect_hearts',
                title: 'Collect the Hearts! ❤️',
                message: 'Guide Boonie to collect the glowing heart carrots. She loves them!',
                highlight: 'hearts',
                duration: 4000
            },
            {
                id: 'water_problem',
                title: 'Oh No! Water Blocks the Way! 💧',
                message: 'Boonie cannot swim! She needs help to cross the water.',
                highlight: 'water',
                duration: 4000
            },
            {
                id: 'meet_snakie',
                title: 'Meet Snakie the Helper Snake! 🐍',
                message: 'Snakie is friendly and wants to help! Press SPACE to activate bridge mode.',
                highlight: 'snake',
                duration: 5000
            },
            {
                id: 'bridge_mode',
                title: 'Bridge Mode Activated! 🌉',
                message: 'Now use WASD keys to move Snakie and create a bridge for Boonie!',
                highlight: 'snake',
                duration: 5000
            },
            {
                id: 'cooperation',
                title: 'Work Together! 🤝',
                message: 'Snakie can only extend 8 segments. Plan your path carefully!',
                highlight: 'both',
                duration: 4000
            },
            {
                id: 'level_complete',
                title: 'Level Complete! 🎉',
                message: 'Collect the required hearts to finish the level. Press R to continue!',
                highlight: 'ui',
                duration: 3000
            }
        ];
        
        this.currentMessage = null;
        this.messageStartTime = 0;
        this.showingMessage = false;
        
        // Tutorial completion tracking
        this.hasMovedBunny = false;
        this.hasActivatedSnake = false;
        this.hasMovedSnake = false;
        this.hasCollectedHeart = false;
    }

    // Initialize tutorial
    start() {
        this.currentStep = 0;
        this.tutorialActive = true;
        this.showNextStep();
    }

    // Update tutorial state
    update(deltaTime, gameState) {
        if (!this.tutorialActive) return;

        // Check for player actions to advance tutorial
        this.checkPlayerProgress(gameState);

        // Update current message timing
        if (this.showingMessage) {
            const elapsed = Date.now() - this.messageStartTime;
            const currentTutorialStep = this.tutorialSteps[this.currentStep];
            
            if (elapsed > currentTutorialStep.duration) {
                this.advanceStep();
            }
        }
    }

    // Check player progress and advance tutorial accordingly
    checkPlayerProgress(gameState) {
        if (!gameState || !gameState.bunny || !gameState.snake) return;

        const bunny = gameState.bunny;
        const snake = gameState.snake;
        const inputManager = gameState.inputManager;

        // Track bunny movement
        if (inputManager && inputManager.isBunnyMoving()) {
            this.hasMovedBunny = true;
            if (this.currentStep === 0) { // Welcome step
                this.advanceStep();
            }
        }

        // Track snake activation
        if (snake.bridgeMode && !this.hasActivatedSnake) {
            this.hasActivatedSnake = true;
            if (this.currentStep === 3) { // Meet Snakie step
                this.advanceStep();
            }
        }

        // Track snake movement
        if (inputManager && inputManager.isSnakeMoving() && snake.bridgeMode) {
            this.hasMovedSnake = true;
            if (this.currentStep === 4) { // Bridge mode step
                this.advanceStep();
            }
        }

        // Track heart collection
        if (gameState.level && gameState.level.hearts) {
            const collectedHearts = gameState.level.hearts.filter(h => h.collected).length;
            if (collectedHearts > 0 && !this.hasCollectedHeart) {
                this.hasCollectedHeart = true;
                if (this.currentStep === 1) { // Collect hearts step
                    this.advanceStep();
                }
            }
        }

        // Auto-advance water problem step when near water
        if (this.currentStep === 2) {
            // Check if bunny is near water (simplified check)
            setTimeout(() => this.advanceStep(), 3000);
        }
    }

    // Show next tutorial step
    showNextStep() {
        if (this.currentStep >= this.tutorialSteps.length) {
            this.completeTutorial();
            return;
        }

        const step = this.tutorialSteps[this.currentStep];
        this.currentMessage = step;
        this.messageStartTime = Date.now();
        this.showingMessage = true;
    }

    // Advance to next tutorial step
    advanceStep() {
        this.currentStep++;
        this.showingMessage = false;
        
        // Small delay before showing next step
        setTimeout(() => {
            this.showNextStep();
        }, 500);
    }

    // Complete tutorial
    completeTutorial() {
        this.tutorialActive = false;
        this.showingMessage = false;
        this.currentMessage = null;
    }

    // Skip tutorial
    skip() {
        this.completeTutorial();
    }

    // Render tutorial overlay
    render(ctx, canvasWidth, canvasHeight) {
        if (!this.tutorialActive || !this.showingMessage || !this.currentMessage) return;

        const step = this.currentMessage;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Tutorial box
        const boxWidth = 500;
        const boxHeight = 120;
        const boxX = (canvasWidth - boxWidth) / 2;
        const boxY = canvasHeight - boxHeight - 50;

        // Box background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 15, true);

        // Box border
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 3;
        this.drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 15, false);
        ctx.stroke();

        // Title
        ctx.fillStyle = '#2e7d32';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(step.title, boxX + boxWidth/2, boxY + 30);

        // Message
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        const words = step.message.split(' ');
        let line = '';
        let y = boxY + 55;
        const maxWidth = boxWidth - 40;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, boxX + boxWidth/2, y);
                line = words[i] + ' ';
                y += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, boxX + boxWidth/2, y);

        // Skip button
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Press ESC to skip tutorial', boxX + boxWidth - 20, boxY + boxHeight - 10);

        // Progress indicator
        const progressWidth = 200;
        const progressX = boxX + (boxWidth - progressWidth) / 2;
        const progressY = boxY - 25;

        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(progressX, progressY, progressWidth, 6);

        const progress = (this.currentStep + 1) / this.tutorialSteps.length;
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(progressX, progressY, progressWidth * progress, 6);

        // Step counter
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Step ${this.currentStep + 1} of ${this.tutorialSteps.length}`, 
                    progressX + progressWidth/2, progressY - 8);
    }

    // Check if tutorial is active
    isActive() {
        return this.tutorialActive;
    }

    // Draw rounded rectangle (fallback for browsers without roundRect)
    drawRoundedRect(ctx, x, y, width, height, radius, fill = true) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        
        if (fill) {
            ctx.fill();
        }
    }

    // Handle input for tutorial control
    handleInput(inputManager) {
        if (!this.tutorialActive) return;

        // Skip tutorial with ESC
        if (inputManager.isKeyPressed('Escape')) {
            this.skip();
        }

        // Advance with Enter/Space (but not during snake bridge mode instructions)
        if ((inputManager.isKeyPressed('Enter') || 
             (inputManager.isKeyPressed(' ') && this.currentStep !== 3 && this.currentStep !== 4)) 
            && this.showingMessage) {
            this.advanceStep();
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialManager;
} 