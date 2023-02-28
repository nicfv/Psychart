/**
 * Contains special mathematics functions.
 */
export class JMath {
  /**
   * Clamp the number `x` between `min` and `max`, returns a number `[min, max]`
   */
  public static clamp(x: number, min: number, max: number) {
    return (x < min) ? min : (x > max) ? max : x;
  }

  /**
   * Normalize a number `x` from the coordinate system `[min, max]`
   */
  public static normalize(x: number, min: number, max: number): number {
    return (x - min) / (max - min);
  }

  /**
   * Expand a normalized number `x` to the coordinate system `[min, max]`
   */
  public static expand(x: number, min: number, max: number): number {
    return x * (max - min) + min;
  }

  /**
   * Translate a number `x` from one coordinate system `[a, b]` to another `[c, d]`
   */
  public static translate(x: number, a: number, b: number, c: number, d: number) {
    return JMath.expand(JMath.normalize(x, a, b), c, d);
  }

  /**
   * Convert from Celsius to Fahrenheit
   */
  public static CtoF(C: number): number {
    return (9 / 5) * C + 32;
  }

  /**
   * Convert from Fahrenheit to Celsius
   */
  public static FtoC(F: number): number {
    return (5 / 9) * (F - 32);
  }

  /**
   * Determine if the value is numeric or not.
   */
  public static isNumber(x: any): boolean {
    return typeof x === 'number';
  }

  /**
   * Check if two numbers `a` and `b` are approximately equal eith a maximum absolute error of `epsilon`.
   */
  public static approx(a: number, b: number, epsilon = 1e-6): boolean {
    return a - b < epsilon && b - a < epsilon;
  }

  /**
   * Round the number `x` to `d` decimal places.
   */
  public static round(x: number, d = 0): number {
    return Math.round(x * 10 ** d) / (10 ** d);
  }
}
