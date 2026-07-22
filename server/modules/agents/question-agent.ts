import { ResumeProfile } from './resume-agent';
import { JobRequirement } from './jd-agent';
import { GapAnalysis } from './gap-agent';

export interface GeneratedQuestion {
  id: string;
  questionText: string;
  type: 'technical' | 'behavioral' | 'situational' | 'background';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedConcepts: string[];
}

/**
 * QuestionAgent synthesizes tailor-made interview questions
 */
export interface QuestionAgent {
  /**
   * Generates a tailored list of questions based on resume, jd, and gap metrics
   */
  generateQuestions(
    resume: ResumeProfile,
    jd: JobRequirement,
    gaps: GapAnalysis,
    count: number
  ): Promise<GeneratedQuestion[]>;
}
