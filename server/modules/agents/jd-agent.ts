export interface JobRequirement {
  title: string;
  company: string;
  experienceRequiredYears: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  roleType: 'remote' | 'hybrid' | 'onsite' | 'unspecified';
}

/**
 * JdAgent parses and analyzes Job Descriptions
 */
export interface JdAgent {
  /**
   * Extracts essential skills, responsibilities, and qualifications from JDs
   */
  parseJobDescription(jdText: string): Promise<JobRequirement>;
  
  /**
   * Generates a semantic profile outlining candidate success factors
   */
  getSuccessCriteria(requirement: JobRequirement): Promise<string[]>;
}
