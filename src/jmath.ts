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
   * Expand a normalized number `x` to an array `arr` with linear interpolation between elements.
   */
  static expand2(x: number, arr: number[]) {
    if (x <= 0) {
      return arr[0];
    } else if (x >= 1) {
      return arr[arr.length - 1];
    }
    const N = arr.length - 1, // number of buckets
      s = 1 / N, // size of each bucket
      n = Math.floor(x / s), // bucket number
      a = s * n, // bucket min index
      b = s * (n + 1), // bucket max index
      A = arr[n], // bucket min value
      B = arr[n + 1]; //bucket max value
    return JMath.translate(x, a, b, A, B);
  };

  /**
   * Translate a number `x` from one coordinate system `[a, b]` to another `[c, d]`
   */
  static translate(x: number, a: number, b: number, c: number, d: number) {
    return JMath.expand(JMath.normalize(x, a, b), c, d);
  }

  /**
   * Translate a number `x` from one coordinate system `[a, b]` to an array `arr` with linear interpolation between elements.
   */
  static translate2(x: number, a: number, b: number, arr: number[]) {
    return JMath.expand2(JMath.normalize(x, a, b), arr);
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
  static approx(a: number, b: number, epsilon: number = 1e-6) {
    return a - b < epsilon && b - a < epsilon;
  }

  /**
   * Round the number `x` to `d` decimal places.
   */
  static round(x: number, d: number = 0) {
    return Math.round(x * 10 ** d) / (10 ** d);
  }
}