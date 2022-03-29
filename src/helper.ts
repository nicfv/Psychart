// Normalize a number `x` from the coordinate system [a, b]
export const normalize = (x: number, a: number, b: number) => (x - a) / (b - a);

// Expand a normalized number `x` to the coordinate system [a, b]
export const expand = (x: number, a: number, b: number) => x * (b - a) + a;

// Expand a normalized number `x` to an array `arr` with linear interpolation between elements.
export const expand2 = (x: number, arr: number[]) => {
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
  return translate(x, a, b, A, B);
};

// Translate a number `x` from one coordinate system [a, b] to another [c, d]
export const translate = (x: number, a: number, b: number, c: number, d: number) => expand(normalize(x, a, b), c, d);

// Translate a number `x` from one coordinate system [a, b] to an array `arr` with linear interpolation between elements.
export const translate2 = (x: number, a: number, b: number, arr: number[]) => expand2(normalize(x, a, b), arr);

// Convert from Celsius to Fahrenheit
export const CtoF = (C: number) => (9 / 5) * C + 32;

// Convert from Fahrenheit to Celsius
export const FtoC = (F: number) => (5 / 9) * (F - 32);
