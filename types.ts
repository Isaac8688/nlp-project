
export interface RubricScores {
  content: number;
  organization: number;
  grammar: number;
  vocabulary: number;
}

export interface NlpMetrics {
  wordCount: number;
  sentenceCount: number;
  readabilityScore: string;
  lexicalDiversity: number;
  sentenceComplexity: number;
}

export interface FeedbackItem {
  category: string;
  type: 'positive' | 'improvement';
  text: string;
}

export interface EssayResult {
  overallScore: number;
  rubricScores: RubricScores;
  metrics: NlpMetrics;
  feedback: FeedbackItem[];
  summary: string;
}

export enum EducationLevel {
  MIDDLE_SCHOOL = 'Middle School',
  HIGH_SCHOOL = 'High School',
  UNDERGRADUATE = 'Undergraduate',
  GRADUATE = 'Graduate/Professional'
}
