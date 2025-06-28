/**
 * Story Manager - Handles game narrative and intro sequence
 */
class StoryManager {
    constructor() {
        this.showingIntro = true;
        this.introStartTime = 0;
        this.currentPage = 0;
        this.autoAdvanceDelay = 4000; // Auto-advance every 4 seconds
        
        this.storyPages = [
            {
                title: "🌸 Boonie Snakie Carrot Adventure 🌸",
                text: "In a magical garden where love blooms eternal...",
                image: "garden",
                duration: 3000
            },
            {
                title: "🐰 Meet Boonie! 💕",
                text: "Boonie the bunny was having the most wonderful day, hopping through her favorite garden with a basket full of delicious heart-shaped carrots!",
                image: "boonie",
                duration: 4000
            },
            {
                title: "😱 Oh No! 💔",
                text: "But then... TRIP! Boonie stumbled over a root and all her precious heart carrots scattered across the garden!",
                image: "accident",
                duration: 4000
            },
            {
                title: "💧 The Problem 🚧",
                text: "The carrots landed everywhere - even across the streams! Boonie can't swim and needs help to collect them all.",
                image: "water",
                duration: 4000
            },
            {
                title: "🐍 A Friendly Helper! 🤝",
                text: "Luckily, Snakie the kind snake heard Boonie's distress. 'Don't worry!' said Snakie, 'I can help you reach those carrots!'",
                image: "snakie",
                duration: 4000
            },
            {
                title: "🌉 The Solution! ✨",
                text: "Snakie can stretch across the water to create bridges for Boonie! Together, they can recover all the heart carrots!",
                image: "teamwork",
                duration: 4000
            },
            {
                title: "🎯 Your Mission! 🎮",
                text: "Help Boonie and Snakie work together to collect all the heart carrots. Remember: teamwork makes the dream work!",
                image: "mission",
                duration: 5000
            }
        ];
    }

    // Start the intro sequence
    start() {
        this.showingIntro = true;
        this.currentPage = 0;
        this.introStartTime = Date.now();
    }

    // Update story state
    update(deltaTime) {
        if (!this.showingIntro) return;

        const elapsed = Date.now() - this.introStartTime;
        const currentPageData = this.storyPages[this.currentPage];
        
        if (elapsed > currentPageData.duration) {
            this.nextPage();
        }
    }

    // Go to next story page
    nextPage() {
        this.currentPage++;
        
        if (this.currentPage >= this.storyPages.length) {
            this.completeIntro();
        } else {
            this.introStartTime = Date.now();
        }
    }

    // Go to previous story page
    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.introStartTime = Date.now();
        }
    }

    // Complete intro and start game
    completeIntro() {
        this.showingIntro = false;
        this.currentPage = 0;
    }

    // Skip intro entirely
    skip() {
        this.completeIntro();
    }

    // Handle input for story navigation
    handleInput(inputManager) {
        if (!this.showingIntro) return;

        // Skip intro with ESC
        if (inputManager.isKeyPressed('Escape')) {
            this.skip();
        }

        // Next page with Space, Enter, or Right Arrow
        if (inputManager.isKeyPressed(' ') || 
            inputManager.isKeyPressed('Enter') || 
            inputManager.isKeyPressed('ArrowRight')) {
            this.nextPage();
        }

        // Previous page with Left Arrow
        if (inputManager.isKeyPressed('ArrowLeft')) {
            this.previousPage();
        }
    }

    // Render story screen
    render(ctx, canvasWidth, canvasHeight) {
        if (!this.showingIntro) return;

        const page = this.storyPages[this.currentPage];
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, '#e8f5e8');
        gradient.addColorStop(0.5, '#f1f8e9');
        gradient.addColorStop(1, '#e8f5e8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Decorative border
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

        // Inner decorative border
        ctx.strokeStyle = '#81c784';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

        // Story illustration area
        const illustrationY = 80;
        const illustrationHeight = 200;
        this.drawIllustration(ctx, page.image, canvasWidth, illustrationY, illustrationHeight);

        // Title
        ctx.fillStyle = '#2e7d32';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(page.title, canvasWidth / 2, 60);

        // Story text
        ctx.fillStyle = '#1b5e20';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        
        // Word wrap the text
        const words = page.text.split(' ');
        let line = '';
        let y = illustrationY + illustrationHeight + 60;
        const maxWidth = canvasWidth - 100;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, canvasWidth / 2, y);
                line = words[i] + ' ';
                y += 25;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvasWidth / 2, y);

        // Progress indicator
        const progressY = canvasHeight - 100;
        const progressWidth = 300;
        const progressX = (canvasWidth - progressWidth) / 2;

        // Progress bar background
        ctx.fillStyle = '#c8e6c9';
        ctx.fillRect(progressX, progressY, progressWidth, 8);

        // Progress bar fill
        const progress = (this.currentPage + 1) / this.storyPages.length;
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(progressX, progressY, progressWidth * progress, 8);

        // Page indicator
        ctx.fillStyle = '#2e7d32';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.currentPage + 1} of ${this.storyPages.length}`, 
                    canvasWidth / 2, progressY + 25);

        // Controls
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPACE: Next • LEFT/RIGHT: Navigate • ESC: Skip', 
                    canvasWidth / 2, canvasHeight - 30);

        // Auto-advance indicator
        const elapsed = Date.now() - this.introStartTime;
        const remaining = Math.max(0, page.duration - elapsed);
        if (remaining > 0) {
            ctx.fillStyle = '#888';
            ctx.font = '12px Arial';
            ctx.fillText(`Auto-advancing in ${Math.ceil(remaining / 1000)}s...`, 
                        canvasWidth / 2, canvasHeight - 10);
        }
    }

    // Draw illustration for story page
    drawIllustration(ctx, imageType, canvasWidth, y, height) {
        const centerX = canvasWidth / 2;
        const centerY = y + height / 2;

        ctx.save();

        switch (imageType) {
            case 'garden':
                this.drawGardenScene(ctx, centerX, centerY, height);
                break;
            case 'boonie':
                this.drawBoonieScene(ctx, centerX, centerY, height);
                break;
            case 'accident':
                this.drawAccidentScene(ctx, centerX, centerY, height);
                break;
            case 'water':
                this.drawWaterScene(ctx, centerX, centerY, height);
                break;
            case 'snakie':
                this.drawSnakieScene(ctx, centerX, centerY, height);
                break;
            case 'teamwork':
                this.drawTeamworkScene(ctx, centerX, centerY, height);
                break;
            case 'mission':
                this.drawMissionScene(ctx, centerX, centerY, height);
                break;
        }

        ctx.restore();
    }

    // Individual scene drawing methods
    drawGardenScene(ctx, centerX, centerY, height) {
        // Simple garden with flowers
        const scale = height / 200;
        
        // Grass
        ctx.fillStyle = '#81c784';
        ctx.fillRect(centerX - 150 * scale, centerY + 40 * scale, 300 * scale, 60 * scale);
        
        // Flowers
        for (let i = 0; i < 5; i++) {
            const x = centerX - 120 * scale + i * 60 * scale;
            ctx.fillStyle = ['#e91e63', '#9c27b0', '#ff5722', '#ffc107', '#f44336'][i];
            ctx.beginPath();
            ctx.arc(x, centerY, 15 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBoonieScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Happy Boonie with basket
        ctx.fillStyle = '#ffb3d4';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears
        ctx.fillStyle = '#ff9bb5';
        ctx.beginPath();
        ctx.arc(centerX - 15 * scale, centerY - 20 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 15 * scale, centerY - 20 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Basket
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(centerX + 40 * scale, centerY - 10 * scale, 20 * scale, 15 * scale);
        
        // Hearts in basket
        ctx.fillStyle = '#e91e63';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(centerX + 45 * scale + i * 5 * scale, centerY - 5 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawAccidentScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Sad Boonie
        ctx.fillStyle = '#ffb3d4';
        ctx.beginPath();
        ctx.arc(centerX - 30 * scale, centerY, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Scattered hearts
        const heartPositions = [
            [centerX + 20 * scale, centerY - 30 * scale],
            [centerX + 50 * scale, centerY + 10 * scale],
            [centerX + 80 * scale, centerY - 10 * scale],
            [centerX + 30 * scale, centerY + 40 * scale]
        ];
        
        ctx.fillStyle = '#e91e63';
        heartPositions.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Overturned basket
        ctx.fillStyle = '#8d6e63';
        ctx.save();
        ctx.translate(centerX + 40 * scale, centerY + 20 * scale);
        ctx.rotate(0.5);
        ctx.fillRect(-10 * scale, -8 * scale, 20 * scale, 15 * scale);
        ctx.restore();
    }

    drawWaterScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Water
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(centerX - 80 * scale, centerY - 20 * scale, 160 * scale, 40 * scale);
        
        // Hearts across water
        ctx.fillStyle = '#e91e63';
        ctx.beginPath();
        ctx.arc(centerX - 40 * scale, centerY, 8 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 40 * scale, centerY, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Sad Boonie on one side
        ctx.fillStyle = '#ffb3d4';
        ctx.beginPath();
        ctx.arc(centerX - 120 * scale, centerY, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSnakieScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Friendly Snakie
        ctx.fillStyle = '#4caf50';
        
        // Snake body segments
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX - 40 * scale + i * 20 * scale, centerY, 12 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Snake head with smile
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(centerX + 40 * scale, centerY, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(centerX + 35 * scale, centerY - 5 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.arc(centerX + 45 * scale, centerY - 5 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTeamworkScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Snakie as bridge
        ctx.fillStyle = '#4caf50';
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.arc(centerX - 60 * scale + i * 20 * scale, centerY, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Boonie crossing on Snakie
        ctx.fillStyle = '#ffb3d4';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart being collected
        ctx.fillStyle = '#e91e63';
        ctx.beginPath();
        ctx.arc(centerX + 80 * scale, centerY, 8 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMissionScene(ctx, centerX, centerY, height) {
        const scale = height / 200;
        
        // Game elements preview
        // Boonie
        ctx.fillStyle = '#ffb3d4';
        ctx.beginPath();
        ctx.arc(centerX - 60 * scale, centerY, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Snakie
        ctx.fillStyle = '#4caf50';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(centerX - 20 * scale + i * 15 * scale, centerY, 8 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Target hearts
        ctx.fillStyle = '#e91e63';
        const targets = [
            [centerX + 40 * scale, centerY - 30 * scale],
            [centerX + 70 * scale, centerY + 20 * scale],
            [centerX + 30 * scale, centerY + 40 * scale]
        ];
        
        targets.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Check if intro is active
    isActive() {
        return this.showingIntro;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryManager;
} 