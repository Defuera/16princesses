export interface QuizOption {
  text: string;
  value: number; // 0-100 scoring value
}

export interface QuizQuestion {
  id: number;
  text: string;
  axis: 'X' | 'Y'; // X = Damsel→Heroine, Y = Sweet→Fierce
  type: 'multiple' | 'forced'; // multiple = 4 options, forced = 2-3 options
  reverse: boolean; // if true, invert scoring (0→100, 33→66, 66→33, 100→0)
  options: QuizOption[];
}

export interface QuizAnswer {
  questionId: number;
  selectedValue: number; // The value from the selected option
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: Map<number, number>; // questionId → selectedValue
  isComplete: boolean;
  isStarted: boolean;
}

export interface QuizResult {
  xScore: number; // 0-100, Damsel→Heroine (agency/independence)
  yScore: number; // 0-100, Sweet→Fierce (assertiveness/attitude)  
  matchedPrincess: any; // Will use existing Princess type
  matchingDistance: number; // Euclidean distance to closest princess
  totalQuestions: number;
  answeredQuestions: number;
}

export interface QuizScores {
  xScores: number[]; // All X-axis question scores
  yScores: number[]; // All Y-axis question scores
  xPercent: number; // Final X-axis percentage
  yPercent: number; // Final Y-axis percentage
}

export interface ShuffledQuestion extends QuizQuestion {
  shuffledOptions?: QuizOption[]; // For multiple-choice questions only
}

export interface QuizProgress {
  currentQuestion: number;
  totalQuestions: number;
  progressPercentage: number;
  canGoBack: boolean;
  canGoForward: boolean;
}
