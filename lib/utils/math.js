/**
 * Performs a linear mapping from range `<a1, a2>` to range `<b1, b2>`
 * for the given value.
 *
 * @param {number} x - The value to be mapped.
 * @param {number} a1 - Minimum value for range A.
 * @param {number} a2 - Maximum value for range A.
 * @param {number} b1 - Minimum value for range B.
 * @param {number} b2 - Maximum value for range B.
 * @return {number} The mapped value.
 */
export function mapLinear(x, a1, a2, b1, b2) {
  return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
