import { GeneratedQuestion } from './question-agent';

export interface AnswerEvaluation {
  score: number; // 0 to 100
  clarityRating: 'poor' | 'fair' | 'good' | 'excellent';
  feedback: string;
  missingPoints: string[];
  suggestedAnswer: string;
}

/**
 * EvaluationAgent grades student responses against questions
 */
export interface EvaluationAgent {
  /**
   * Evaluates a candidate's answer to a generated interview question
   */
  evaluateAnswer(
    question: GeneratedQuestion,
    candidateAnswer: string
  ): Promise<AnswerEvaluation>;
}
