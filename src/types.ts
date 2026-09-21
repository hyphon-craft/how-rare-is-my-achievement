export type Category = 'Running & Fitness' | 'Outdoors & Adventure' | 'Travel & Exploration' | 'Skills & Learning' | 'Life Experiences';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: Category;
  completionRate: number; // 0-1
  difficulty: number; // 1-10
  commitment: number; // 1-10
  adventure: number; // 1-10
  pathId?: string;
  pathOrder?: number;
}

export interface Recommendation extends Achievement {
  reason: string;
}

export interface AchievementScore extends Achievement {
  rarityScore: number;
  score: number;
}

export interface ResultsProfile {
  overallScore: number;
  tier: Tier;
  totalSelected: number;
  rarestAchievement: AchievementScore;
  hardestAchievement: AchievementScore;
  topAchievements: AchievementScore[];
  recommendedNext: Recommendation[];
  categoryDistribution: Record<Category, number>;
  summary: string;
  averages: {
    difficulty: number;
    commitment: number;
    adventure: number;
  };
}

export type Tier = 'Emerging' | 'Notable' | 'Uncommon' | 'Remarkable' | 'Exceptional';

export interface AchievementRepository {
  getAchievements(): Promise<Achievement[]>;
}
