/**
 * Boonie Snakie Carrot Adventure - Main Game File
 * Enhanced cooperative puzzle-platformer with strategic snake mechanics
 */

// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const statusElement = document.getElementById('gameStatus');

// Game Systems - These will be initialized when the modules load
let inputManager = null;
let terrainManager = null;
let collisionManager = null;
let gameState = null;
let levelManager = null;
let tutorialManager = null;
let storyManager = null;

// Game Objects
let bunny = null;
let snake = null;

// Game Loop Variables
let lastTime = 0;
let gameRunning = false;

/**
 * Initialize Game - Set up all systems and start the game
 */
async function initializeGame() {
    try {
        // Initialize core systems
        inputManager = new InputManager();
        terrainManager = new TerrainManager();
        collisionManager = new CollisionManager(terrainManager);
        gameState = new GameState();
        levelManager = new LevelManager();
        tutorialManager = new TutorialManager();
        storyManager = new StoryManager();
        
        // Set up responsive canvas dimensions
        setupCanvasDimensions();
        terrainManager.setCanvasDimensions(canvas.width, canvas.height);
        
        // Set up level change listener (only once)
        document.addEventListener('levelChange', handleLevelChange);
        
        // Start with story introduction
        if (storyManager) {
            storyManager.start();
        }
        
        // Add resize listener for responsive design
        window.addEventListener('resize', handleResize);
        
        // Start game loop
        gameRunning = true;
        requestAnimationFrame(gameLoop);
        
        console.log('🐰🐍 Boonie Snakie Carrot Adventure initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError('Game failed to start. Please refresh the page.');
    }
}

/**
 * Load a specific level
 */
async function loadLevel(levelId) {
    try {
        console.log(`🎮 Attempting to load level ${levelId}...`);
        
        // Load level data
        const level = await levelManager.loadLevel(levelId);
        if (!level) {
            throw new Error(`Could not load level ${levelId}`);
        }
        
        console.log(`📊 Level ${levelId} data loaded:`, {
            name: level.name,
            heartsCount: level.hearts.length,
            requiredHearts: level.requiredHearts,
            waterObstacles: level.waterObstacles.length
        });
        
        // Set up terrain with level data
        terrainManager.loadWaterObstacles(level.waterObstacles);
        
        // Create characters at starting positions
        bunny = new Bunny(level.bunnyStart.x, level.bunnyStart.y);
        snake = new Snake(level.snakeStart.x, level.snakeStart.y);
        
        // Set up system references for characters
        const systems = { inputManager, collisionManager, terrainManager };
        const uiElements = { scoreElement, levelElement, statusElement };
        
        bunny.setSystems(collisionManager, terrainManager, gameState);
        snake.setSystems(collisionManager, terrainManager, gameState);
        
        // Initialize game state
        gameState.initialize(bunny, snake, level, systems, uiElements);
        
        console.log(`✅ Level ${levelId} loaded successfully: ${level.name}`);
    } catch (error) {
        console.error('❌ Failed to load level:', error);
        showError(`Failed to load level ${levelId}`);
    }
}

/**
 * Handle level progression
 */
async function handleLevelChange(event) {
    if (!event || !event.detail || !event.detail.level) {
        console.error('Invalid level change event');
        return;
    }
    
    const newLevelId = event.detail.level;
    console.log(`🔄 Level change requested: ${newLevelId}`);
    
    try {
        // Check if the requested level exists
        if (newLevelId <= levelManager.maxLevels) {
            console.log(`✅ Loading level ${newLevelId}...`);
            await loadLevel(newLevelId);
        } else {
            // Game completed!
            console.log('🎉 All levels completed!');
            gameState.gamePhase = 'game_complete';
            gameState.updateStatusMessage('🏆 CONGRATULATIONS! 🏆 You completed all levels! Press R to play again from Level 1! 💕', 'success');
            console.log('🎉 Game completed! All levels finished!');
        }
    } catch (error) {
        console.error('Error during level change:', error);
        gameState.updateStatusMessage('❌ Error loading next level. Try resetting with R.', 'error');
    }
}

/**
 * Main Game Loop
 */
function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Update game systems
    update(deltaTime);
    
    // Render everything
    render();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

/**
 * Update all game systems
 */
function update(deltaTime) {
    try {
        // Validate delta time to prevent issues
        if (deltaTime > 100 || deltaTime < 0) {
            deltaTime = 16; // Fallback to ~60fps
        }
        
        // Update game state (this updates characters and checks level completion)
        if (gameState) gameState.update(deltaTime);
        
        // Update level objects (hearts, etc.)
        if (levelManager) levelManager.updateLevel(deltaTime);
        
        // Update story system
        if (storyManager && storyManager.isActive()) {
            storyManager.update(deltaTime);
        } else if (!gameState.level) {
            // Load first level after story completes
            loadLevel(1).then(() => {
                if (tutorialManager) {
                    tutorialManager.start();
                }
            });
        }
        
        // Update tutorial system
        if (tutorialManager) tutorialManager.update(deltaTime, gameState);
        
        // Handle additional input (pause, reset, etc.)
        handleGlobalInput();
    } catch (error) {
        console.error('Error in game update:', error);
        // Try to continue running instead of crashing
    }
}

/**
 * Handle global input (pause, reset, etc.)
 */
function handleGlobalInput() {
    if (!inputManager) return;
    
    // Pause functionality
    if (inputManager.isKeyPressed('p') || inputManager.isKeyPressed('P')) {
        gameState.togglePause();
    }
    
    // Reset level functionality
    if (inputManager.isKeyPressed('r') && gameState.gamePhase === 'playing') {
        resetCurrentLevel();
    }
    
    // Level progression when level is complete
    if (inputManager.isKeyPressed('r') && gameState.gamePhase === 'level_complete') {
        gameState.nextLevel();
    }
    
    // Restart game when all levels complete
    if (inputManager.isKeyPressed('r') && gameState.gamePhase === 'game_complete') {
        restartGame();
    }
    
    // Handle story input (takes priority)
    if (storyManager && storyManager.isActive()) {
        storyManager.handleInput(inputManager);
    } else if (tutorialManager) {
        // Handle tutorial input only after story is complete
        tutorialManager.handleInput(inputManager);
    }
}

/**
 * Restart entire game from level 1
 */
async function restartGame() {
    try {
        console.log('🔄 Restarting game from Level 1...');
        
        // Reset game state
        gameState.currentLevel = 1;
        gameState.score = 0;
        gameState.gamePhase = 'playing';
        gameState.timeElapsed = 0;
        gameState.gameStartTime = Date.now();
        
        // Reload level 1
        await loadLevel(1);
        
        // Don't restart tutorial on game restart, just start playing
        
        console.log('✅ Game restarted successfully!');
    } catch (error) {
        console.error('Error restarting game:', error);
        gameState.updateStatusMessage('❌ Error restarting game. Please refresh the page.', 'error');
    }
}

/**
 * Reset current level
 */
function resetCurrentLevel() {
    if (levelManager.currentLevel) {
        // Reset level objects
        levelManager.resetCurrentLevel();
        
        // Reset character positions
        const level = levelManager.currentLevel;
        bunny.x = level.bunnyStart.x;
        bunny.y = level.bunnyStart.y;
        snake.x = level.snakeStart.x;
        snake.y = level.snakeStart.y;
        
        // Reset snake segments
        snake.segments = [
            { x: snake.x, y: snake.y },
            { x: snake.x - 20, y: snake.y },
            { x: snake.x - 40, y: snake.y }
        ];
        snake.bridgeMode = false;
        
        // Reset game state
        gameState.score = 0;
        gameState.updateUI();
        
        console.log('Level reset');
    }
}

/**
 * Render everything
 */
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render terrain (background and water)
    terrainManager.render(ctx);
    
    // Render level objects (hearts)
    levelManager.renderLevel(ctx);
    
    // Render characters
    if (snake) snake.render(ctx);
    if (bunny) bunny.render(ctx);
    
    // Render UI overlays
    renderUI();
    
    // Render story overlay (takes priority over tutorial)
    if (storyManager && storyManager.isActive()) {
        storyManager.render(ctx, canvas.width, canvas.height);
    } else if (tutorialManager) {
        // Render tutorial overlay only after story is complete
        tutorialManager.render(ctx, canvas.width, canvas.height);
    }
}

/**
 * Setup canvas dimensions with responsive design
 */
function setupCanvasDimensions() {
    try {
        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate available space more accurately
        const maxWidth = Math.min(800, window.innerWidth - 80, containerRect.width - 40);
        const maxHeight = Math.min(600, window.innerHeight - 300);
        
        // Maintain aspect ratio (4:3)
        const aspectRatio = 4 / 3;
        let canvasWidth = maxWidth;
        let canvasHeight = maxWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
        }
        
        // Ensure minimum playable size
        canvasWidth = Math.max(canvasWidth, 400);
        canvasHeight = Math.max(canvasHeight, 300);
        
        // Set internal canvas dimensions (affects coordinate system)
        canvas.width = Math.round(canvasWidth);
        canvas.height = Math.round(canvasHeight);
        
        // Set display dimensions to match (prevents scaling artifacts)
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
        
        // Update terrain manager with new dimensions
        if (terrainManager) {
            terrainManager.setCanvasDimensions(canvas.width, canvas.height);
        }
        
        console.log(`📏 Canvas dimensions: ${canvas.width}x${canvas.height} (display: ${canvas.style.width} x ${canvas.style.height})`);
        
    } catch (error) {
        console.warn('Error setting up canvas dimensions, using fallback:', error);
        // Fallback to standard dimensions
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.width = '800px';
        canvas.style.height = '600px';
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    // Add small delay to handle rapid resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        setupCanvasDimensions();
        
        // Update all systems that depend on canvas dimensions
        if (terrainManager) {
            terrainManager.setCanvasDimensions(canvas.width, canvas.height);
        }
        
        console.log('🔄 Window resized, canvas updated');
    }, 100);
}

/**
 * Draw rounded rectangle with fallback for older browsers
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        // Fallback for browsers without roundRect support
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
    }
}

/**
 * Render UI overlays
 */
function renderUI() {
    // Snake length indicator
    if (snake) {
        renderSnakeLengthIndicator();
    }
    
    // Bridge mode indicator
    if (snake && snake.bridgeMode) {
        renderBridgeModeIndicator();
    } else {
        renderInstructionIndicator();
    }
    
    // Level tips (show briefly at level start)
    renderLevelTips();
}

/**
 * Render snake length indicator
 */
function renderSnakeLengthIndicator() {
    const segmentCount = snake.getSegmentCount();
    const maxLength = snake.getMaxLength();
    const isAtMax = segmentCount >= maxLength;
    
    // Dynamic box height based on content
    const boxHeight = isAtMax ? 50 : 35;
    const boxWidth = 200;
    const boxX = canvas.width - boxWidth - 10;
    const boxY = 10;
    
    // Background with gradient
    const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = gradient;
    
    // Rounded rectangle background
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = isAtMax ? '#ff4444' : '#4caf50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.stroke();
    
    // Main text with better positioning
    ctx.fillStyle = isAtMax ? '#ff6666' : '#fff';
    ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    try {
        ctx.fillText(`🐍 Snake: ${segmentCount}/${maxLength}`, boxX + 10, boxY + 22);
        
        // Warning if at max (with better positioning)
        if (isAtMax) {
            ctx.fillStyle = '#ffaa44';
            ctx.font = 'bold 11px Arial, Helvetica, sans-serif';
            ctx.fillText('⚠️ Maximum length reached!', boxX + 10, boxY + 40);
        }
    } catch (error) {
        console.warn('Error rendering snake length indicator:', error);
    }
}

/**
 * Render bridge mode indicator
 */
function renderBridgeModeIndicator() {
    const boxWidth = 240;
    const boxHeight = 50;
    const boxX = 10;
    const boxY = 10;
    
    // Animated background with pulse effect
    const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.9;
    const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    gradient.addColorStop(0, `rgba(76, 175, 80, ${pulse})`);
    gradient.addColorStop(1, `rgba(56, 142, 60, ${pulse})`);
    ctx.fillStyle = gradient;
    
    // Rounded rectangle background
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.fill();
    
    // Border with glow effect
    ctx.strokeStyle = '#81c784';
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.stroke();
    
    // Title text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    try {
        ctx.fillText('🌉 Bridge Mode Active!', boxX + 10, boxY + 22);
        
        // Instruction text
        ctx.font = '12px Arial, Helvetica, sans-serif';
        ctx.fillStyle = '#e8f5e8';
        ctx.fillText('Use WASD to extend bridge', boxX + 10, boxY + 38);
    } catch (error) {
        console.warn('Error rendering bridge mode indicator:', error);
    }
}

/**
 * Render instruction indicator
 */
function renderInstructionIndicator() {
    const boxWidth = 240;
    const boxHeight = 35;
    const boxX = 10;
    const boxY = 10;
    
    // Animated background with subtle pulse
    const pulse = Math.sin(Date.now() * 0.002) * 0.1 + 0.9;
    const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    gradient.addColorStop(0, `rgba(255, 193, 7, ${pulse})`);
    gradient.addColorStop(1, `rgba(255, 152, 0, ${pulse})`);
    ctx.fillStyle = gradient;
    
    // Rounded rectangle background
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#ffb74d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 8);
    ctx.stroke();
    
    // Instruction text
    ctx.fillStyle = '#3e2723';
    ctx.font = 'bold 13px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    try {
        ctx.fillText('⌨️ Press SPACE to activate Snakie', boxX + 10, boxY + 23);
    } catch (error) {
        console.warn('Error rendering instruction indicator:', error);
    }
}

/**
 * Render level tips (could be expanded for tutorial system)
 */
function renderLevelTips() {
    // This could show tips at the start of each level
    // For now, tips are shown in the status area
}

/**
 * Show error message
 */
function showError(message) {
    if (statusElement) {
        statusElement.textContent = `❌ ${message}`;
        statusElement.className = 'game-status error';
    }
    console.error(message);
}

/**
 * Window load event - Start the game when everything is ready
 */
window.addEventListener('load', () => {
    console.log('🎮 Starting Boonie Snakie Carrot Adventure...');
    initializeGame();
});

/**
 * Handle browser visibility change (pause when tab is hidden)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameRunning) {
        // Auto-pause when tab becomes hidden
        if (gameState && gameState.gamePhase === 'playing') {
            gameState.togglePause();
        }
    }
});

/**
 * Export for debugging (development only)
 */
if (typeof window !== 'undefined') {
    window.debugGame = {
        gameState,
        bunny,
        snake,
        levelManager,
        inputManager,
        resetLevel: resetCurrentLevel,
        loadLevel: loadLevel,
        restartGame: restartGame
    };
} 