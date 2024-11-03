/**
 * Generates a random number between min and max (inclusive)
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random number between min and max
 * @throws Error if min is greater than max
 */
export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value")
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}
