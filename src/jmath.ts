/**
 * Contains special mathematics functions.
 */
export class JMath {
  /**
   * Clamp the number `x` between `min` and `max`, returns a number `[min, max]`
   */
  static clamp(x: number, min: number, max: number) {
    return (x < min) ? min : (x > max) ? max : x;
  }

  /**
   * Normalize a number `x` from the coordinate system `[min, max]`
   */
  static normalize(x: number, min: number, max: number): number {
    return (x - min) / (max - min);
  }

  /**
   * Expand a normalized number `x` to the coordinate system `[min, max]`
   */
  static expand(x: number, min: number, max: number): number {
    return x * (max - min) + min;
  }

  /**
   * Translate a number `x` from one coordinate system `[a, b]` to another `[c, d]`
   */
  static translate(x: number, a: number, b: number, c: number, d: number) {
    return JMath.expand(JMath.normalize(x, a, b), c, d);
  }

  /**
   * Convert from Celsius to Fahrenheit
   */
  static CtoF(C: number): number {
    return (9 / 5) * C + 32;
  }

  /**
   * Convert from Fahrenheit to Celsius
   */
  static FtoC(F: number): number {
    return (5 / 9) * (F - 32);
  }

  /**
   * Determine if the value is numeric or not.
   */
  static isNumber(x: any): boolean {
    return typeof x === 'number';
  }

  /**
   * Check if two numbers `a` and `b` are approximately equal eith a maximum absolute error of `epsilon`.
   */
  static approx(a: number, b: number, epsilon = 1e-6): boolean {
    return a - b < epsilon && b - a < epsilon;
  }

  /**
   * Round the number `x` to `d` decimal places.
   */
  static round(x: number, d = 0): number {
    return Math.round(x * 10 ** d) / (10 ** d);
  }
}
