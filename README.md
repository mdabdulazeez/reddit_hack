StoryForge
StoryForge is a collaborative storytelling game that allows users to collectively craft dynamic narratives through word contributions, puzzle challenges, voting, and achievements. Designed for Reddit's ecosystem, StoryForge creates an engaging and interactive experience through a custom post type powered by the @devvit/public-api.

Features
Collaborative Storytelling: Users contribute words to build a continuous story
Puzzles: Interactive challenges to unlock achievements and drive the story forward
Voting System: Players vote on critical story decisions or paths
Achievements: Unlock milestones like "First Word" or "Puzzle Master"
Redis Integration: Persistent storage for story states, voting progress, and user achievements
Seamless Reddit API Integration: Runs as a custom post type within Reddit's ecosystem
Project Structure

StoryForge/
├── src/
│   ├── components/
│   │   ├── achievementSystem.ts  # Achievement management
│   │   ├── puzzleManager.ts      # Puzzle logic and storage
│   │   └── votingSystem.ts       # Voting logic and storage
│   ├── createPost.txs            # serves a specific purpose related to creating a new post in the application
│   ├── main.tsx                  # Main Devvit configuration and render logic
│   └── redis.ts                  # Redis test utilities
├── webroot/
│   ├── assets/                   # UI assets
│   ├── page.html                 # Main WebView HTML
│   ├── script.js                 # WebView JavaScript
│   └── style.css                 # WebView CSS
├── package-lock.json             # locks down the exact versions of all dependencies and their dependencies 
├── package.json                  # Project metadata and dependencies
└── tsconfig.json                 # TypeScript configuration

Game Flow
Initialization: The app initializes the story state and user information via Redis and Reddit
Collaborative Storytelling: Users add words to the story via the WebView, which updates the state in Redis
Puzzles and Challenges: Users can solve puzzles to unlock achievements and progress the story
Voting: Players vote on story decisions, dynamically influencing the narrative
Achievements: Awarded for specific actions (e.g., first contribution, solving puzzles)
