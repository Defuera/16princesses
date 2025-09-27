import { QuizQuestion, QuizAnswer, QuizResult, QuizScores } from '../types/quiz';
import { Princess } from '../types/princess';
import { euclideanDistance, findClosestPoint, Coordinates } from '../utils/distance';
import { loadQuizQuestions } from './quizData';
import { getAllPrincesses } from './princessData';

/**
 * Calculate quiz scores based on user answers
 * Implements the scoring algorithm from 16_Princesses_Test_Guide.markdown
 * 
 * @param userAnswers - Map of questionId to selectedValue
 * @returns Calculated scores for both axes
 */
export function calculateQuizScores(userAnswers: Map<number, number>): QuizScores {
  const questions = loadQuizQuestions();
  const xScores: number[] = [];
  const yScores: number[] = [];
  
  // Process each answer according to the scoring algorithm
  questions.forEach(question => {
    const selectedValue = userAnswers.get(question.id);
    
    if (selectedValue === undefined) {
      console.warn(`No answer found for question ${question.id}`);
      return;
    }
    
    let processedValue = selectedValue;
    
    // Apply reverse scoring if needed (invert: 0→100, 33→66, 66→33, 100→0)
    if (question.reverse) {
      processedValue = 100 - selectedValue;
    }
    
    // Add score to appropriate axis
    if (question.axis === 'X') {
      xScores.push(processedValue);
    } else if (question.axis === 'Y') {
      yScores.push(processedValue);
    }
  });
  
  // Calculate final percentages (average of all scores for each axis)
  const xPercent = xScores.length > 0 ? xScores.reduce((a, b) => a + b, 0) / xScores.length : 0;
  const yPercent = yScores.length > 0 ? yScores.reduce((a, b) => a + b, 0) / yScores.length : 0;
  
  return {
    xScores,
    yScores,
    xPercent: Math.round(xPercent * 10) / 10, // Round to 1 decimal place
    yPercent: Math.round(yPercent * 10) / 10, // Round to 1 decimal place
  };
}

/**
 * Find the closest princess to the user's calculated coordinates
 * Uses Euclidean distance as specified in the guide
 * 
 * @param xPercent - User's X-axis score (0-100, Damsel→Heroine)
 * @param yPercent - User's Y-axis score (0-100, Sweet→Fierce)
 * @returns Closest princess and distance
 */
export function findClosestPrincess(xPercent: number, yPercent: number): { princess: Princess; distance: number } {
  const princesses = getAllPrincesses();
  const userCoords: Coordinates = { x: xPercent, y: yPercent };
  
  // Convert princesses to coordinate format for distance calculation
  const princessCoords = princesses.map(princess => ({
    x: princess.feminismPercentage,
    y: princess.bitchinessPercentage,
    princess: princess
  }));
  
  // Find closest using Euclidean distance
  const closest = findClosestPoint(userCoords, princessCoords);
  
  if (!closest) {
    throw new Error('No princesses available for matching');
  }
  
  return {
    princess: closest.point.princess,
    distance: Math.round(closest.distance * 10) / 10 // Round to 1 decimal place
  };
}

/**
 * Generate complete quiz result from user answers
 * Main scoring function that combines all scoring logic
 * 
 * @param userAnswers - Map of questionId to selectedValue
 * @returns Complete quiz result with matched princess
 */
export function generateQuizResult(userAnswers: Map<number, number>): QuizResult {
  const questions = loadQuizQuestions();
  const scores = calculateQuizScores(userAnswers);
  const { princess, distance } = findClosestPrincess(scores.xPercent, scores.yPercent);
  
  return {
    xScore: scores.xPercent,
    yScore: scores.yPercent,
    matchedPrincess: princess,
    matchingDistance: distance,
    totalQuestions: questions.length,
    answeredQuestions: userAnswers.size,
  };
}

/**
 * Validate that all questions have been answered
 * @param userAnswers - User's answers
 * @returns true if all questions answered, false otherwise
 */
export function isQuizComplete(userAnswers: Map<number, number>): boolean {
  const questions = loadQuizQuestions();
  return userAnswers.size === questions.length;
}

/**
 * Get completion percentage
 * @param userAnswers - User's answers
 * @returns Percentage complete (0-100)
 */
export function getCompletionPercentage(userAnswers: Map<number, number>): number {
  const questions = loadQuizQuestions();
  return Math.round((userAnswers.size / questions.length) * 100);
}

/**
 * Generate personality message based on quiz result
 * Format: "You're X% Heroine, Y% Fierce—like [Princess] with a twist of [fun trait]!"
 * 
 * @param result - Quiz result with scores and matched princess
 * @returns Formatted personality message
 */
export function generatePersonalityMessage(result: QuizResult): string {
  const { xScore, yScore, matchedPrincess } = result;
  
  // Generate trait descriptions based on scores
  const heroineLevel = getHeroineDescription(xScore);
  const fierceLevel = getFierceDescription(yScore);
  
  // Get fun trait based on princess and scores
  const funTrait = getFunTrait(matchedPrincess, xScore, yScore);
  
  return `You're ${xScore}% Heroine, ${yScore}% Fierce—like ${matchedPrincess.name} with a twist of ${funTrait}!`;
}

/**
 * Get heroine level description based on X score
 */
function getHeroineDescription(xScore: number): string {
  if (xScore >= 80) return 'Total Heroine';
  if (xScore >= 60) return 'Strong Heroine';
  if (xScore >= 40) return 'Emerging Heroine';
  if (xScore >= 20) return 'Reluctant Heroine';
  return 'Classic Damsel';
}

/**
 * Get fierce level description based on Y score
 */
function getFierceDescription(yScore: number): string {
  if (yScore >= 80) return 'Ultra Fierce';
  if (yScore >= 60) return 'Quite Fierce';
  if (yScore >= 40) return 'Mildly Fierce';
  if (yScore >= 20) return 'Gentle Fierce';
  return 'Pure Sweetness';
}

/**
 * Generate fun personality trait based on princess and scores
 */
function getFunTrait(princess: Princess, xScore: number, yScore: number): string {
  const traits = [
    'rebellious streak',
    'hidden depths', 
    'royal attitude',
    'adventurous spirit',
    'fierce independence',
    'gentle wisdom',
    'magical charm',
    'warrior heart',
    'diplomatic grace',
    'wild freedom',
    'mysterious allure',
    'unstoppable determination'
  ];
  
  // Generate somewhat consistent trait based on princess name and scores
  const hash = princess.name.length + Math.floor(xScore / 10) + Math.floor(yScore / 10);
  return traits[hash % traits.length];
}

/**
 * Export scoring statistics for debugging/analysis
 */
export function getQuizScoringStats(userAnswers: Map<number, number>) {
  const questions = loadQuizQuestions();
  const scores = calculateQuizScores(userAnswers);
  const xQuestions = questions.filter(q => q.axis === 'X');
  const yQuestions = questions.filter(q => q.axis === 'Y');
  const reverseQuestions = questions.filter(q => q.reverse);
  
  return {
    totalQuestions: questions.length,
    answeredQuestions: userAnswers.size,
    xAxisQuestions: xQuestions.length,
    yAxisQuestions: yQuestions.length,
    reverseQuestions: reverseQuestions.length,
    xScores: scores.xScores,
    yScores: scores.yScores,
    xAverage: scores.xPercent,
    yAverage: scores.yPercent,
    completionPercentage: getCompletionPercentage(userAnswers),
    isComplete: isQuizComplete(userAnswers)
  };
}
