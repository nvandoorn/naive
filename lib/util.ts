/**
 * Get the last item in t
 */
export const last = <T>(t: T[]): T => t[t.length - 1]

/**
 * Generate a random key with a seed
 */
export const getKey = (seed: string) =>
  seed + Date.now() + Math.floor(Math.random() * 1000)

export const now = () => Date.now() / 1000
