import { JMath } from './jmath';

/**
 * Represents a class for storing an RGBA color value.
 */
export class Color {
    private red: number;
    private green: number;
    private blue: number;
    private alpha: number;
    /**
     * Initialize a new color.
     */
    constructor(red: number, green: number, blue: number, alpha: number = 100) {
        this.red = JMath.clamp(red, 0, 255);
        this.green = JMath.clamp(green, 0, 255);
        this.blue = JMath.clamp(blue, 0, 255);
        this.alpha = JMath.clamp(alpha, 0, 100);
    }
    /**
     * Return the more contrasting color, black or
     * white, depending on the current color.
     */
    getContrastingColor(): Color {
        if (this.red + this.green + this.blue > 255 * 1.5) {
            return new Color(0, 0, 0);
        } else {
            return new Color(255, 255, 255);
        }
    }
    toString(): string {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + '%)';
    }
}