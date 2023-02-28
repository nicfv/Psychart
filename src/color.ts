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
    constructor(red: number, green: number, blue: number, alpha = 100) {
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
        if (this.red + this.green * 1.5 + this.blue * 0.5 > 255 * 1.5) {
            return new Color(0, 0, 0);
        } else {
            return new Color(255, 255, 255);
        }
    }
    /**
     * Return a string representation of this color.
     */
    toString(): string {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + '%)';
    }
    /**
     * Compute a gradient where `x` is in the range `[0, 1]` and `colors` is an array of colors.
     */
    static gradient(x: number, colors: Color[]): Color {
        if (colors.length === 0) {
            throw new Error('Must input at least 1 color to create a gradient.');
        } else if (colors.length === 1) {
            return colors[0];
        } else if (x <= 0) {
            return colors[0];
        } else if (x >= 1) {
            return colors[colors.length - 1];
        }
        const N = colors.length - 1, // number of buckets
            s = 1 / N, // size of each bucket
            n = Math.floor(x / s), // bucket number
            a = s * n, // bucket min value
            b = s * (n + 1), // bucket max value
            A = colors[n], // bucket min color
            B = colors[n + 1]; //bucket max color
        return new Color(
            JMath.translate(x, a, b, A.red, B.red),
            JMath.translate(x, a, b, A.green, B.green),
            JMath.translate(x, a, b, A.blue, B.blue),
            JMath.translate(x, a, b, A.alpha, B.alpha));
    }
}
