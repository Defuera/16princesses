/**
 * Fisher-Yates shuffle algorithm for randomizing array order
 * Used to shuffle multiple-choice options to prevent bias
 * 
 * @param array - Array to shuffle (creates a new array, doesn't mutate original)
 * @returns New shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid mutation
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Shuffle array in place (mutates original array)
 * Use when you want to modify the original array
 */
export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Create a seeded shuffle for consistent testing
 * Uses a simple LCG (Linear Congruential Generator) for reproducible randomness
 */
export function shuffleSeeded<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  
  // Simple LCG parameters
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = (a * currentSeed + c) % m;
    const j = Math.floor((currentSeed / m) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}
