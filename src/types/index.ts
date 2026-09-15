export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  languages: string[];
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  graduationYear: number;
}

export interface LinkedInPost {
  content: string;
  hashtags: string[];
  mediaType?: 'image' | 'video' | 'document';
  engagementTip: string;
  bestTimeToPost?: string;
}

export interface EngagementMetrics {
  profileViews: number;
  postImpressions: number;
  engagementRate: number;
  connections: number;
  followerGrowthRate: number;
}

export interface CareerRecommendation {
  title: string;
  reasoning: string;
  requiredSkills: string[];
  companies: string[];
  salary_range: string;
}

export interface ConnectionStrategy {
  targetAudience: string;
  approachStrategy: string;
  messageTemplates: string[];
  networkingTips: string[];
}

export interface AnalysisResult {
  timestamp: string;
  analysis: string;
  suggestions: string[];
  score?: number;
}
