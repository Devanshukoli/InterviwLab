export interface ResumeProfile {
  candidateName?: string;
  skills: string[];
  experienceYears: number;
  education: {
    degree: string;
    field: string;
    institution: string;
  }[];
  history: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
}

/**
 * ResumeAgent processes and analyzes applicant resumes
 */
export interface ResumeAgent {
  /**
   * Parses raw resume text or files and extracts structured profile details
   */
  parseAndExtract(resumeText: string): Promise<ResumeProfile>;
  
  /**
   * Classifies the industry, level of seniority, and core tech stacks
   */
  classifyExperience(profile: ResumeProfile): Promise<{
    seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'architect';
    primaryRole: string;
    coreDomain: string[];
  }>;
}
