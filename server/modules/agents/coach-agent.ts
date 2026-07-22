import { AnswerEvaluation } from './evaluation-agent';
import { GeneratedQuestion } from './question-agent';

export interface CoachingReport {
  overallScore: number;
  domainStrengths: string[];
  domainWeaknesses: string[];
  recommendedTopicsToStudy: {
    topic: string;
    priority: 'low' | 'medium' | 'high';
    resourceSuggestions: string[];
  }[];
  coachingSummary: string;
}

/**
 * CoachAgent provides aggregated coaching recommendations and progression guidance
 */
export interface CoachAgent {
  /**
   * Generates a comprehensive summary report based on all evaluated answers in a session
   */
  generateCoachingReport(
    evaluations: { question: GeneratedQuestion; answer: string; evaluation: AnswerEvaluation }[]
  ): Promise<CoachingReport>;
}
