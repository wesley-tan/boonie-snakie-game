/**
 * Heart Carrot - Collectible items that can only be collected by the bunny
 */
class HeartCarrot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        
        // Animation properties
        this.bob = Math.random() * Math.PI * 2; // Random start phase
        this.bobSpeed = 0.08;
        this.bobHeight = 3;
        this.sparkleTime = 0;
        this.collectionAnimation = 0;
        
        // Visual properties
        this.glowIntensity = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        if (this.collected) {
            this.updateCollectionAnimation(deltaTime);
            return;
        }
        
        // Update floating animation
        this.bob += this.bobSpeed;
        
        // Update sparkle animation
        this.sparkleTime += deltaTime * 0.01;
        
        // Update glow pulse
        this.pulsePhase += deltaTime * 0.003;
        this.glowIntensity = Math.sin(this.pulsePhase) * 0.3 + 0.7;
    }
    
    updateCollectionAnimation(deltaTime) {
        this.collectionAnimation += deltaTime * 0.01;
    }
    
    render(ctx) {
        if (this.collected && this.collectionAnimation > 1) return; // Fully faded
        
        const bobOffset = Math.sin(this.bob) * this.bobHeight;
        const drawX = this.x;
        const drawY = this.y + bobOffset;
        
        if (this.collected) {
            this.renderCollectionEffect(ctx, drawX, drawY);
        } else {
            this.renderHeart(ctx, drawX, drawY);
            this.renderSparkles(ctx, drawX, drawY);
            this.renderGlow(ctx, drawX, drawY);
        }
    }
    
    renderHeart(ctx, x, y) {
        // Heart body
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        
        // Left heart bump
        ctx.arc(x + 5, y + 6, 4, 0, Math.PI * 2);
        // Right heart bump  
        ctx.arc(x + 11, y + 6, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart point
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 6);
        ctx.lineTo(x + 8, y + 15);
        ctx.lineTo(x + 15, y + 6);
        ctx.closePath();
        ctx.fill();
        
        // Heart highlight
        ctx.fillStyle = '#ff9999';
        ctx.beginPath();
        ctx.arc(x + 4, y + 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderSparkles(ctx, x, y) {
        ctx.fillStyle = '#fff';
        
        // Generate sparkles based on time
        for (let i = 0; i < 4; i++) {
            const angle = (this.sparkleTime + i * Math.PI / 2) % (Math.PI * 2);
            const distance = 12 + Math.sin(this.sparkleTime * 2 + i) * 3;
            const sparkleX = x + 8 + Math.cos(angle) * distance;
            const sparkleY = y + 8 + Math.sin(angle) * distance;
            
            // Sparkle intensity based on position in cycle
            const intensity = (Math.sin(this.sparkleTime * 3 + i) + 1) / 2;
            
            ctx.save();
            ctx.globalAlpha = intensity * 0.8;
            
            // Draw sparkle
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw sparkle rays
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sparkleX - 2, sparkleY);
            ctx.lineTo(sparkleX + 2, sparkleY);
            ctx.moveTo(sparkleX, sparkleY - 2);
            ctx.lineTo(sparkleX, sparkleY + 2);
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    renderGlow(ctx, x, y) {
        // Soft glow effect around heart
        const gradient = ctx.createRadialGradient(
            x + 8, y + 8, 0,
            x + 8, y + 8, 15
        );
        
        const glowColor = `rgba(255, 107, 107, ${this.glowIntensity * 0.3})`;
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'rgba(255, 107, 107, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderCollectionEffect(ctx, x, y) {
        const progress = Math.min(this.collectionAnimation, 1);
        const scale = 1 + progress * 2; // Grow during collection
        const alpha = 1 - progress; // Fade out
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Scale from center
        ctx.translate(x + this.width/2, y + this.height/2);
        ctx.scale(scale, scale);
        ctx.translate(-this.width/2, -this.height/2);
        
        // Render heart
        this.renderHeart(ctx, 0, 0);
        
        // Add collection sparkle burst
        if (progress < 0.5) {
            this.renderCollectionBurst(ctx, 0, 0, progress);
        }
        
        ctx.restore();
    }
    
    renderCollectionBurst(ctx, x, y, progress) {
        const burstRadius = progress * 30;
        const burstIntensity = 1 - progress * 2; // Fade out quickly
        
        ctx.save();
        ctx.globalAlpha = burstIntensity;
        
        // Draw radiating sparkles
        ctx.fillStyle = '#ffdd44';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sparkleX = x + 8 + Math.cos(angle) * burstRadius;
            const sparkleY = y + 8 + Math.sin(angle) * burstRadius;
            
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Trigger collection (called when bunny touches it)
    collect() {
        if (!this.collected) {
            this.collected = true;
            this.collectionAnimation = 0;
        }
    }
    
    // Check if fully collected and can be removed
    isFullyCollected() {
        return this.collected && this.collectionAnimation > 1;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartCarrot;
} 