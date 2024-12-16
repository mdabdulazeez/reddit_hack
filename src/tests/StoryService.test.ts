import { expect, test, beforeEach } from 'vitest';
import { StoryService } from '../services/StoryService';
import { RedisClient } from '../utils/redis';

let redis: RedisClient;
let storyService: StoryService;

beforeEach(() => {
  redis = new RedisClient();
  storyService = new StoryService(redis);
});

test('creates a new story', async () => {
  const story = await storyService.createStory('test-post-id');
  expect(story.id).toBe('test-post-id');
  expect(story.content).toHaveLength(0);
  expect(story.contributors.size).toBe(0);
});

test('adds a word to story', async () => {
  await storyService.createStory('test-post-id');
  const updated = await storyService.addWord('test-post-id', 'Hello', 'user1');
  
  expect(updated.content).toContain('Hello');
  expect(updated.contributors.has('user1')).toBe(true);
});