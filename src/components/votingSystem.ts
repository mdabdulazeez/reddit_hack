import { Vote } from '../types';
import { RedisClient } from '../redis';

export class VotingSystem {
  private readonly KEY_PREFIX = 'storyforge_vote_';
  private readonly VOTE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  constructor(private redis: RedisClient) {}

  async createVote(postId: string, options: string[]): Promise<Vote> {
    const vote: Vote = {
      id: postId,
      options,
      votes: {},
      startTime: Date.now(),
      endTime: Date.now() + this.VOTE_DURATION,
      isActive: true
    };

    await this.saveVote(vote);
    return vote;
  }

  async submitVote(postId: string, option: string, userId: string): Promise<Vote> {
    const vote = await this.getVote(postId);
    if (!this.isValidVote(vote, option)) {
      throw new Error('Invalid vote or voting closed');
    }

    vote.votes[userId] = vote.options.indexOf(option);
    await this.saveVote(vote);
    return vote;
  }

  async getVote(postId: string): Promise<Vote | null> {
    const data = await this.redis.get(`${this.KEY_PREFIX}${postId}`);
    return data ? JSON.parse(data) : null;
  }

  private isValidVote(vote: Vote | null, option: string): boolean {
    if (!vote || !vote.isActive) return false;
    if (!vote.options.includes(option)) return false;
    if (Date.now() > vote.endTime) {
      vote.isActive = false;
      this.saveVote(vote);
      return false;
    }
    return true;
  }

  private async saveVote(vote: Vote): Promise<void> {
    await this.redis.set(
      `${this.KEY_PREFIX}${vote.id}`,
      JSON.stringify(vote)
    );
  }
}