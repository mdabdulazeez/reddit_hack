import { Achievement, UserState } from '../types.js';
import { RedisClient } from '../redis.js';

export class AchievementSystem {
  private readonly KEY_PREFIX = 'storyforge_user_';
  
  constructor(private redis: RedisClient) {}

  async getUserState(userId: string): Promise<UserState> {
    const data = await this.redis.get(`${this.KEY_PREFIX}${userId}`);
    return data ? JSON.parse(data) : this.createInitialUserState(userId);
  }

  async awardAchievement(userId: string, achievementId: Achievement['id']): Promise<void> {
    const state = await this.getUserState(userId);
    if (state.achievements.some(a => a.id === achievementId)) return;

    state.achievements.push({
      id: achievementId,
      name: this.getAchievementName(achievementId),
      description: this.getAchievementDescription(achievementId),
      earnedAt: Date.now()
    });

    await this.saveUserState(state);
  }

  private async createInitialUserState(userId: string): Promise<UserState> {
    const state: UserState = {
      userId,
      achievements: [],
      contributedStories: new Set(),
      solvedPuzzles: new Set(),
      participatedVotes: new Set()
    };
    await this.saveUserState(state);
    return state;
  }

  private async saveUserState(state: UserState): Promise<void> {
    await this.redis.set(
      `${this.KEY_PREFIX}${state.userId}`,
      JSON.stringify(state)
    );
  }

  private getAchievementName(id: Achievement['id']): string {
    const names = {
      first_word: 'First Word',
      puzzle_master: 'Puzzle Master',
      voting_champion: 'Voting Champion'
    };
    return names[id];
  }

  private getAchievementDescription(id: Achievement['id']): string {
    const descriptions = {
      first_word: 'Contributed your first word to a story',
      puzzle_master: 'Successfully solved a puzzle',
      voting_champion: 'Participated in story direction voting'
    };
    return descriptions[id];
  }
}