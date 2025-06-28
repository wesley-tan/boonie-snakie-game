# 🐰 Love Garden Adventure 🐍

A delightful cooperative puzzle-platformer where Boonie the bunny and Snakie the snake work together to collect heart-shaped carrots! Features an engaging story, interactive tutorial, and strategic gameplay.

![Game Preview](https://img.shields.io/badge/Game-Ready%20to%20Play-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 **QUICK START GUIDE**

### **Option 1: Local Development Server (Recommended)**

1. **Download/Clone the game files**
   ```bash
   # If using git
   git clone [your-repo-url]
   cd boonie-snakie-carrot
   
   # Or simply download and extract the ZIP file
   ```

2. **Start a local server**
   
   **Python (Recommended - Works on Mac/Linux/Windows):**
   ```bash
   # Navigate to the game folder
   cd boonie-snakie-carrot
   
   # Start server
   python3 -m http.server 8000
   
   # For older Python versions
   python -m SimpleHTTPServer 8000
   ```
   
   **Node.js (Alternative):**
   ```bash
   # Install http-server globally
   npm install -g http-server
   
   # Start server
   http-server -p 8000
   ```
   
   **PHP (Alternative):**
   ```bash
   php -S localhost:8000
   ```

3. **Open your browser**
   - Go to: `http://localhost:8000`
   - The game should load automatically!

### **Option 2: Direct File Opening (Limited)**
- Simply double-click `index.html`
- ⚠️ **Note**: Some features may not work due to browser security restrictions

---

## 🌐 **HOSTING OPTIONS**

### **Free Hosting Platforms**

#### **1. GitHub Pages (Recommended)**
```bash
# Push your code to GitHub
git add .
git commit -m "Add Love Garden Adventure"
git push origin main

# Enable GitHub Pages in repository settings
# Your game will be available at: https://username.github.io/repository-name
```

#### **2. Netlify**
1. Visit [netlify.com](https://netlify.com)
2. Drag and drop your game folder
3. Get instant URL like: `https://amazing-site-name.netlify.app`

#### **3. Vercel**
1. Visit [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy with one click

#### **4. Surge.sh**
```bash
# Install surge
npm install -g surge

# Deploy
cd boonie-snakie-carrot
surge

# Follow prompts to get: https://your-domain.surge.sh
```

### **Paid Hosting Options**
- **Shared Hosting**: Upload files via FTP to any web host
- **VPS/Cloud**: AWS S3, Google Cloud Storage, Azure Blob Storage
- **CDN**: Cloudflare, AWS CloudFront for global distribution

---

## 🎯 **HOW TO PLAY**

### **Game Objective**
Help Boonie the bunny collect heart-shaped carrots with assistance from Snakie the snake who creates bridges over water obstacles.

### **Characters**

#### 🐰 **Boonie (The Bunny)**
- **Controls**: Arrow Keys ⬅️⬆️⬇️➡️
- **Ability**: Collect heart carrots
- **Limitation**: Cannot enter water

#### 🐍 **Snakie (The Snake)**
- **Activation**: Press `SPACE` to enter bridge mode
- **Controls**: `WASD` keys (only when in bridge mode)
- **Ability**: Create bridges over water
- **Limitation**: Maximum 8 segments

### **Game Controls**

| Key | Action |
|-----|--------|
| ⬅️⬆️⬇️➡️ | Move Boonie |
| `SPACE` | Activate/Deactivate Snakie bridge mode |
| `W` `A` `S` `D` | Move Snakie (only in bridge mode) |
| `P` | Pause/Resume game |
| `R` | Reset level / Continue to next level / Restart game |
| `ESC` | Skip story/tutorial |
| `ENTER` | Advance story/tutorial |

### **Gameplay Progression**

1. **📖 Story Introduction** - Learn about Boonie's carrot accident
2. **🎓 Interactive Tutorial** - Master the cooperative mechanics
3. **🎮 Level 1**: Basic Cooperation (2/2 hearts required)
4. **🎮 Level 2**: Strategic Thinking (3/4 hearts required)  
5. **🎮 Level 3**: Master Challenge (4/6 hearts required - strategic choice!)
6. **🏆 Game Complete** - Celebration + restart option

### **Strategy Tips**
- 🧠 Plan Snakie's path carefully - only 8 segments available!
- 🤝 Coordinate both characters for efficient heart collection
- 💡 Not all hearts are required in Level 3 - choose your battles!
- 🔄 Use `R` to reset if you get stuck

---

## 🖥️ **SYSTEM REQUIREMENTS**

### **Minimum Requirements**
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript**: Enabled
- **Screen**: 400x300 minimum resolution
- **Input**: Keyboard (mouse optional)

### **Recommended**
- **Browser**: Latest version of Chrome, Firefox, or Safari
- **Screen**: 800x600 or larger
- **Connection**: Local hosting or stable internet for online play

### **Mobile Support**
- ⚠️ Currently keyboard-only (mobile touch controls planned for future update)
- Works on tablets with external keyboards

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **Game Won't Load**
```bash
# Check if server is running
lsof -i :8000

# Kill existing server and restart
lsof -ti :8000 | xargs kill -9 2>/dev/null
python3 -m http.server 8000
```

#### **Blank Screen**
- Check browser console (F12) for errors
- Ensure all files are in correct folders
- Try refreshing the page (Ctrl+F5 / Cmd+Shift+R)

#### **Controls Not Working**
- Click on the game area to ensure focus
- Check if another application is capturing keyboard input
- Try refreshing the page

#### **UI Elements Misaligned**
- Try zooming to 100% (Ctrl+0 / Cmd+0)
- Clear browser cache and refresh
- Check browser compatibility

### **Performance Issues**
- Close other browser tabs
- Disable browser extensions temporarily
- Try a different browser

### **Testing Your Setup**
Run in browser console:
```javascript
// Test if game is loaded
console.log('Game loaded:', typeof initializeGame !== 'undefined');

// Test canvas
console.log('Canvas found:', !!document.getElementById('gameCanvas'));

// Run comprehensive tests
window.testGameFixes?.runAllTests();
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Before Hosting**
- [ ] Test game locally on `localhost:8000`
- [ ] Verify all controls work
- [ ] Test story → tutorial → gameplay flow
- [ ] Check all 3 levels complete properly
- [ ] Test restart functionality
- [ ] Verify responsive design on different screen sizes

### **After Hosting**
- [ ] Test on different browsers
- [ ] Verify all assets load correctly
- [ ] Check loading performance
- [ ] Test on different devices
- [ ] Share with friends for feedback!

---

## 📜 **LICENSE & CREDITS**

### **License**
MIT License - Feel free to modify, distribute, and use for any purpose!

### **Credits**
- **Game Design**: Love Garden Adventure Team
- **Characters**: Boonie the Bunny 🐰 & Snakie the Snake 🐍
- **Technology**: HTML5 Canvas, Vanilla JavaScript
- **Inspiration**: Cooperative puzzle games and friendship! 💕

---

## 🔗 **QUICK LINKS**

- **🎮 Play Now**: `http://localhost:8000` (after starting server)
- **🐛 Bug Reports**: Check `DEBUG.md` for known issues
- **🧪 Testing**: Run `test-fixes.js` in browser console
- **📧 Support**: Check troubleshooting section above

---

## 🌟 **ENJOY THE GAME!**

*"In the magical garden where love blooms eternal, teamwork makes the dream work!"*

**Happy Gaming! 🐰🐍💕** 