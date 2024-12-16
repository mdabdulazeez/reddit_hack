export interface Story {
  id: string;
  content: string[];
  contributors: Set<string>;
  createdAt: number;
  lastUpdated: number;
}

export interface Puzzle {
  id: string;
  type: 'unscramble' | 'wordchain';
  question: string;
  answer: string;
  createdAt: number;
}

export interface Vote {
  id: string;
  options: string[];
  votes: Record<string, number>;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

export interface Achievement {
  id: 'first_word' | 'puzzle_master' | 'voting_champion';
  name: string;
  description: string;
  earnedAt: number;
}

export interface UserState {
  userId: string;
  achievements: Achievement[];
  contributedStories: Set<string>;
  solvedPuzzles: Set<string>;
  participatedVotes: Set<string>;
}