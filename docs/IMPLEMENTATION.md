# 🐰🐍 Boonie Snakie Carrot Adventure - Implementation Document

## 📋 Project Overview
**Game**: Boonie Snakie Carrot Adventure - Cooperative Puzzle Platformer  
**Perspective**: Top-down 2D  
**Technology**: HTML5 Canvas + JavaScript ES6  
**Players**: 2 (Local Co-op)  

---

## 🎯 Core Game Mechanics Specification

### **Character Specifications**

#### 🐰 Bunny Character
```javascript
class Bunny {
    // Properties
    position: { x: number, y: number }
    size: { width: 25, height: 25 }
    speed: 2.5
    state: 'idle' | 'moving' | 'blocked' | 'collecting'
    
    // Restrictions
    canEnterWater: false
    canCollectHearts: true
    canWalkOnSnake: true
    
    // Movement Rules
    - 4-directional movement (arrow keys)
    - Blocked by water boundaries (hard stop)
    - Can walk on snake segments as solid ground
    - Smooth movement with collision detection
}
```

#### 🐍 Snake Character
```javascript
class Snake {
    // Properties
    segments: Array<{x: number, y: number}> // Max 8-10 segments
    maxLength: 8
    segmentSize: { width: 18, height: 18 }
    speed: 2
    bridgeMode: boolean
    
    // Abilities
    canEnterWater: true
    canEnterLand: true
    canCollectHearts: false
    
    // Movement Rules
    - Only moves when bridgeMode = true
    - WASD controls when active
    - Segments follow head with smooth trailing
    - Limited length enforces strategic planning
}
```

### **Environmental System**

#### Terrain Types
```javascript
const TERRAIN_TYPES = {
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
}
```

---

## 🏗️ Technical Architecture

### **File Structure**
```
boonie-snakie-carrot/
├── index.html          # Main game HTML
├── style.css           # Game styling
├── js/
│   ├── game.js         # Main game loop
│   ├── characters/
│   │   ├── Bunny.js    # Bunny class
│   │   └── Snake.js    # Snake class
│   ├── systems/
│   │   ├── Input.js    # Input handling
│   │   ├── Collision.js # Collision detection
│   │   ├── Terrain.js  # Terrain management
│   │   └── Audio.js    # Sound effects
│   ├── levels/
│   │   └── LevelManager.js # Level loading/progression
│   └── utils/
│       ├── Vector2D.js # 2D vector operations
│       └── Animation.js # Animation helpers
├── assets/
│   ├── sounds/         # Audio files
│   └── textures/       # Sprite sheets (if needed)
└── levels/
    ├── level1.json     # Level data
    ├── level2.json
    └── ...
```

### **Core Systems Design**

#### 1. Input System
```javascript
class InputManager {
    constructor() {
        this.keys = new Set();
        this.preventBrowserDefault = true;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            // Prevent browser scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            this.keys.add(e.key);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.key);
        });
    }
    
    isKeyPressed(key) {
        return this.keys.has(key);
    }
}
```

#### 2. Collision System
```javascript
class CollisionManager {
    checkTerrainCollision(character, position) {
        const terrain = this.getTerrainAt(position);
        const rules = TERRAIN_TYPES[terrain];
        
        if (character instanceof Bunny) {
            return rules.bunnyPassable;
        } else if (character instanceof Snake) {
            return rules.snakePassable;
        }
    }
    
    checkSnakeBridgeCollision(bunny, snake) {
        if (!snake.bridgeMode) return false;
        
        for (let segment of snake.segments) {
            if (this.rectanglesOverlap(bunny.getBounds(), segment.getBounds())) {
                return true; // Bunny can walk on snake
            }
        }
        return false;
    }
}
```

#### 3. Game State Management
```javascript
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.gamePhase = 'playing'; // 'playing', 'level_complete', 'game_over'
        this.bunny = null;
        this.snake = null;
        this.level = null;
    }
    
    update(deltaTime) {
        this.bunny.update(deltaTime);
        this.snake.update(deltaTime);
        this.checkCollisions();
        this.checkLevelCompletion();
    }
}
```

---

## 🔧 Implementation Steps

### **Phase 1: Core Infrastructure (2-3 hours)**
1. **Set up improved file structure**
2. **Implement InputManager with browser prevention**
3. **Create base Character class with proper collision bounds**
4. **Set up GameState management system**

### **Phase 2: Character Implementation (3-4 hours)**
1. **Enhanced Bunny Class**
   ```javascript
   // Key features to implement:
   - Smooth 4-directional movement
   - Water boundary collision (hard stop)
   - Snake segment walking detection
   - Visual state indicators (blocked, moving, collecting)
   - Heart collection with animation
   ```

2. **Enhanced Snake Class**
   ```javascript
   // Key features to implement:
   - Limited segment system (8 segments max)
   - Bridge mode toggle with visual feedback
   - Smooth serpentine movement
   - Water/land traversal
   - Segment following algorithm
   ```

### **Phase 3: Environmental Systems (2-3 hours)**
1. **Terrain Management**
   - Water obstacle rendering with animation
   - Land area definition
   - Terrain collision mapping
   
2. **Level Design System**
   ```javascript
   // Level structure:
   {
     "id": 1,
     "name": "First Steps",
     "bunnyStart": [50, 50],
     "snakeStart": [100, 100],
     "water": [
       {"x": 200, "y": 150, "width": 150, "height": 80}
     ],
     "hearts": [
       {"x": 300, "y": 160}
     ],
     "requiredHearts": 1
   }
   ```

### **Phase 4: Advanced Features (2-3 hours)**
1. **Visual Enhancements**
   - Snake segment counter UI
   - Movement indicators
   - Terrain boundary highlighting
   - Particle effects for heart collection

2. **Audio Integration**
   - Movement sounds
   - Heart collection chimes
   - Background ambient audio
   - UI feedback sounds

### **Phase 5: Level Design & Balancing (2-3 hours)**
1. **Progressive Difficulty Levels**
   - Level 1: Single water gap tutorial
   - Level 2: Multiple repositioning required
   - Level 3: Complex snake management
   - Level 4+: Multi-stage puzzles

2. **Playtesting & Iteration**

---

## 🎮 Detailed Gameplay Logic

### **Movement Algorithm**
```javascript
// Bunny Movement with Water Blocking
bunnyMove(direction) {
    const newPosition = this.calculateNewPosition(direction);
    const terrain = this.terrainManager.getTerrainAt(newPosition);
    
    if (terrain === 'WATER') {
        // Check if snake provides bridge
        if (this.snake.bridgeMode && this.collisionManager.checkSnakeBridge(newPosition)) {
            this.position = newPosition; // Allow movement on snake
        } else {
            // Block movement with visual feedback
            this.showBlockedIndicator();
            return false;
        }
    } else {
        this.position = newPosition; // Normal land movement
    }
    return true;
}
```

### **Snake Bridge Logic**
```javascript
// Snake Extension with Length Limit
snakeMove(direction) {
    if (!this.bridgeMode) return;
    
    const newHead = this.calculateNewHead(direction);
    this.segments.unshift(newHead);
    
    // Enforce length limit
    if (this.segments.length > this.maxLength) {
        this.segments.pop(); // Remove tail
    }
    
    this.updateSegmentConnections();
}
```

### **Level Completion Logic**
```javascript
checkLevelCompletion() {
    const allHeartsCollected = this.level.hearts.every(heart => heart.collected);
    
    if (allHeartsCollected) {
        this.gamePhase = 'level_complete';
        this.showLevelCompleteUI();
    }
}
```

---

## 🎨 Visual Design Specifications

### **Character Rendering**
```javascript
// Bunny Rendering with States
renderBunny() {
    const baseColor = this.state === 'blocked' ? '#ffaaaa' : '#ffb3ba';
    
    // Body (circular)
    this.drawCircle(this.position, this.size.width/2, baseColor);
    
    // Ears with animation
    const earBob = Math.sin(this.animationTime) * 2;
    this.drawEars(earBob);
    
    // Expression based on state
    this.drawExpression(this.state);
}

// Snake Rendering with Bridge Indication
renderSnake() {
    for (let i = 0; i < this.segments.length; i++) {
        const segment = this.segments[i];
        const color = this.bridgeMode ? '#8bc34a' : '#7cb342';
        
        if (i === 0) {
            this.drawSnakeHead(segment, color);
        } else {
            this.drawSnakeSegment(segment, color, this.bridgeMode);
        }
    }
}
```

### **UI Elements**
```javascript
// HUD Components
const HUD_ELEMENTS = {
    snakeCounter: {
        position: [20, 20],
        text: `Snake Length: ${snake.segments.length}/${snake.maxLength}`,
        color: snake.segments.length >= snake.maxLength ? '#ff4444' : '#333'
    },
    levelInfo: {
        position: [20, 50],
        text: `Level ${gameState.level} - Hearts: ${gameState.score}/${level.requiredHearts}`
    },
    controls: {
        position: [20, canvas.height - 100],
        bunnyControls: "🐰 Arrow Keys",
        snakeControls: "🐍 SPACE + WASD"
    }
}
```

---

## 🧪 Testing Strategy

### **Unit Tests**
- Collision detection accuracy
- Snake length limiting
- Water boundary enforcement
- Heart collection logic

### **Integration Tests**
- Character interaction (bunny on snake)
- Level progression
- Input handling
- Performance benchmarks

### **Playtesting Checklist**
- [ ] Bunny cannot enter water without snake
- [ ] Snake length is properly limited
- [ ] Controls feel responsive
- [ ] Levels require cooperation
- [ ] Visual feedback is clear
- [ ] No browser scrolling interference

---

## 📊 Performance Considerations

### **Optimization Targets**
- **Frame Rate**: Maintain 60 FPS
- **Memory**: < 50MB total usage
- **Startup Time**: < 2 seconds to first playable frame

### **Optimization Techniques**
- Object pooling for particles
- Efficient collision detection (spatial partitioning)
- Canvas optimization (dirty rectangle updates)
- Asset preloading

---

## 🚀 Deployment & Distribution

### **Build Process**
1. Minify JavaScript files
2. Optimize image assets
3. Generate single-file distribution
4. Test across browsers (Chrome, Firefox, Safari, Edge)

### **Browser Compatibility**
- Modern ES6+ features
- Canvas 2D API
- Web Audio API (optional)
- Local Storage for save data

---

## 📈 Future Enhancements

### **Potential Features**
- **Multiplayer**: Online co-op with WebRTC
- **Level Editor**: Community-created levels
- **Power-ups**: Temporary abilities
- **Achievements**: Progress tracking
- **Mobile Support**: Touch controls

### **Technical Debt Considerations**
- Modular architecture allows easy feature addition
- Separation of concerns enables independent testing
- Event-driven design supports multiplayer expansion

---

**Implementation Timeline**: 10-15 hours total development time  
**Complexity Level**: Intermediate  
**Key Success Metrics**: Engaging cooperative gameplay, smooth performance, intuitive controls 