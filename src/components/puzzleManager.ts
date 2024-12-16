import { Puzzle } from '../types';
import { RedisClient } from '../redis';

export class PuzzleManager {
  private readonly KEY_PREFIX = 'storyforge_puzzle_';
  private readonly WORD_BANK = ['ABLE', 'SMILE', 'DREAM', 'HAPPY', 'BRAVE', 'PEACE'];
  
  constructor(private redis: RedisClient) {}

  async createPuzzle(postId: string): Promise<Puzzle> {
    const puzzle = this.generatePuzzle(postId);
    await this.savePuzzle(puzzle);
    return puzzle;
  }

  async checkAnswer(postId: string, answer: string): Promise<boolean> {
    const puzzle = await this.getPuzzle(postId);
    if (!puzzle) return false;
    return puzzle.answer.toLowerCase() === answer.toLowerCase();
  }

  async getPuzzle(postId: string): Promise<Puzzle | null> {
    const data = await this.redis.get(`${this.KEY_PREFIX}${postId}`);
    return data ? JSON.parse(data) : null;
  }

  private generatePuzzle(postId: string): Puzzle {
    const word = this.WORD_BANK[Math.floor(Math.random() * this.WORD_BANK.length)];
    return {
      id: postId,
      type: 'unscramble',
      question: `Unscramble: ${this.scrambleWord(word)}`,
      answer: word,
      createdAt: Date.now()
    };
  }

  private scrambleWord(word: string): string {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  private async savePuzzle(puzzle: Puzzle): Promise<void> {
    await this.redis.set(
      `${this.KEY_PREFIX}${puzzle.id}`,
      JSON.stringify(puzzle)
    );
  }
}