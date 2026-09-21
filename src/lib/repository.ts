import { Achievement, AchievementRepository } from '../types';
import achievementsData from '../data/achievements.json';

export class LocalAchievementRepository implements AchievementRepository {
  async getAchievements(): Promise<Achievement[]> {
    // Simulate async fetch for future Supabase compatibility
    return achievementsData as Achievement[];
  }
}

// Singleton instance for easy usage
export const achievementRepo = new LocalAchievementRepository();
