import { Devvit } from '@devvit/public-api';
import { PuzzleManager } from './components/puzzleManager.js';
import { Story } from './types.js';
import { RedisClient } from './redis.js';

const KEY_PREFIX = 'storyforge_story_';

export async function createStoryForgePost(
  context: Devvit.Context,
  subredditName: string,
  redis: RedisClient
): Promise<void> {
  const post = await context.reddit.submitPost({
    title: 'StoryForge: Collaborative Story',
    subredditName: subredditName,
    kind: 'image',
    url: 'https://placeholder.com/150.png',
    videoPosterUrl: 'https://placeholder.com/150.png'
  });

  await createInitialStory(post.id, redis);
  await new PuzzleManager(redis).createPuzzle(post.id);
}

async function createInitialStory(postId: string, redis: RedisClient): Promise<void> {
  const story: Story = {
    id: postId,
    content: [],
    contributors: new Set(),
    createdAt: Date.now(),
    lastUpdated: Date.now()
  };

  await redis.set(
    `${KEY_PREFIX}${postId}`,
    JSON.stringify(story)
  );
}