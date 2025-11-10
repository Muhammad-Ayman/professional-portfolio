export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  twitter?: string;
  stats: {
    years: string;
    proposals: string;
    clients: string;
    successRate: string;
  };
  bio: {
    short: string;
    full: string;
  };
  mission: string;
  philosophy: string[];
  sectors: string[];
  regions: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  sector: string;
  contractValue: string;
  outcome: string;
  description: string;
  keyAchievements: string[];
  image: string;
  featured: boolean;
}

export interface Insight {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
}

export interface ContentData {
  profile: Profile;
  caseStudies: CaseStudy[];
  insights: Insight[];
}

