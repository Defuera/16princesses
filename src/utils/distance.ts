/**
 * Calculate Euclidean distance between two points in 2D space
 * Used to find the closest princess to user's calculated coordinates
 * 
 * @param x1 - First point X coordinate (0-100)
 * @param y1 - First point Y coordinate (0-100)  
 * @param x2 - Second point X coordinate (0-100)
 * @param y2 - Second point Y coordinate (0-100)
 * @returns Distance between the two points
 */
export function euclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calculate Euclidean distance using coordinate objects
 * Convenience function for working with coordinate objects
 */
export interface Coordinates {
  x: number;
  y: number;
}

export function euclideanDistanceFromCoords(
  point1: Coordinates,
  point2: Coordinates
): number {
  return euclideanDistance(point1.x, point1.y, point2.x, point2.y);
}

/**
 * Find the closest point from an array of points
 * Returns both the closest point and its distance
 * 
 * @param targetPoint - The point to find closest match for
 * @param points - Array of points to search through
 * @returns Object with closest point and distance, or null if no points
 */
export function findClosestPoint<T extends Coordinates>(
  targetPoint: Coordinates,
  points: T[]
): { point: T; distance: number } | null {
  if (points.length === 0) return null;
  
  let closest = points[0];
  let minDistance = euclideanDistanceFromCoords(targetPoint, closest);
  
  for (let i = 1; i < points.length; i++) {
    const distance = euclideanDistanceFromCoords(targetPoint, points[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closest = points[i];
    }
  }
  
  return {
    point: closest,
    distance: minDistance
  };
}

/**
 * Calculate Manhattan distance (city block distance)
 * Alternative distance metric, less commonly used but available
 */
export function manhattanDistance(
  x1: number,
  y1: number,  
  x2: number,
  y2: number
): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
