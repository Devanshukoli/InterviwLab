import { ResumeProfile } from './resume-agent';
import { JobRequirement } from './jd-agent';

export interface GapAnalysis {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  seniorityGap: {
    required: number;
    actual: number;
    isSufficient: boolean;
  };
  keyRisks: string[];
  strengths: string[];
}

/**
 * GapAgent correlates applicant resumes with target job descriptions
 */
export interface GapAgent {
  /**
   * Compares a Candidate's Resume Profile with the Job Requirements
   */
  evaluateGaps(resume: ResumeProfile, jd: JobRequirement): Promise<GapAnalysis>;
}
