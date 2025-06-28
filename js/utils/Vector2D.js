/**
 * Vector2D - 2D vector mathematics utility
 */
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    // Basic operations
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }
    
    subtract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }
    
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    
    // Distance calculations
    distance(vector) {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    // Normalization
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / mag, this.y / mag);
    }
    
    // Utility methods
    clone() {
        return new Vector2D(this.x, this.y);
    }
    
    equals(vector) {
        return Math.abs(this.x - vector.x) < 0.001 && Math.abs(this.y - vector.y) < 0.001;
    }
    
    // Static helper methods
    static zero() {
        return new Vector2D(0, 0);
    }
    
    static from(obj) {
        return new Vector2D(obj.x || 0, obj.y || 0);
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Vector2D;
} 