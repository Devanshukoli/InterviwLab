export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  apiKeys?: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };
  appearance?: 'light' | 'dark' | 'system';
  notifications?: {
    emailSummaries: boolean;
    practiceReminders: boolean;
    productUpdates: boolean;
  };
}

export interface SavedResume {
  id: string;
  title: string;
  text: string;
  skills: string[];
  experienceYears?: number;
  uploadedAt: string;
  updatedAt?: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'text';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
}

export interface GeneratedQuestion {
  id: string;
  questionText: string;
  type: 'technical' | 'behavioral' | 'situational' | 'background';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedConcepts: string[];
}

export interface Evaluation {
  id: string;
  questionId: string;
  score: number;
  clarityRating: 'poor' | 'fair' | 'good' | 'excellent';
  feedback: string;
  missingPoints: string[];
  suggestedAnswer: string;
  evaluatedAt: string;
}

export interface InterviewOptions {
  experienceLevel: 'junior' | 'mid' | 'senior';
  interviewType: 'technical' | 'behavioral' | 'mixed';
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId: string;
  resumeTitle?: string;
  jobDescriptionId?: string | null;
  jobTitle?: string;
  status: 'draft' | 'in_progress' | 'completed';
  options: InterviewOptions;
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  evaluations: Record<string, Evaluation>;
  coachingReport?: {
    overallScore: number;
    domainStrengths: string[];
    domainWeaknesses: string[];
    recommendedTopics: { topic: string; priority: 'low' | 'medium' | 'high' }[];
    summary: string;
  };
  createdAt: string;
}

export interface ProgressMetric {
  id: string;
  topic: string;
  confidenceScore: number;
  sessionCount: number;
  lastPracticedAt: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'session_completed' | 'resume_uploaded' | 'session_started';
  description: string;
}

