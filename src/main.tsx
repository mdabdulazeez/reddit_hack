import { Devvit } from '@devvit/public-api';
import { AchievementSystem } from './components/achievementSystem.js';
import { PuzzleManager } from './components/puzzleManager.js';
import { VotingSystem } from './components/votingSystem.js';
import { createStoryForgePost } from './createPost.js';
import { RedisClient } from './redis.js';

const redis = new RedisClient();
const achievementSystem = new AchievementSystem(redis);
const puzzleManager = new PuzzleManager(redis);
const votingSystem = new VotingSystem(redis);

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addMenuItem({
  label: 'Create StoryForge Story',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const subreddit = await context.reddit.getCurrentSubreddit();
    if (!subreddit?.name) return;
    await createStoryForgePost(context, subreddit.name, redis);
  },
});

Devvit.addCustomPostType({
  name: 'StoryForge Story',
  render: async (context) => {
    if (!context.postId) return null;
    const story = await getStory(context.postId);
    if (!story) return null;

    return (
      <vstack padding="medium" gap="medium">
        <text size="large">StoryForge Story</text>
        <text>{story.content.join(' ')}</text>
        <text size="small">Contributors: {story.contributors.size}</text>
      </vstack>
    );
  },
});

async function getStory(postId: string) {
  const data = await redis.get(`storyforge_story_${postId}`);
  return data ? JSON.parse(data) : null;
}

export default Devvit;