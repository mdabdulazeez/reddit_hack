let currentStory = null;
let currentPuzzle = null;
let currentVote = null;

// Initialize the application
async function init() {
    await Promise.all([
        fetchStory(),
        fetchPuzzle(),
        fetchVoting()
    ]);
    setupEventListeners();
}

// Story Management
async function fetchStory() {
    const response = await window.reddit.getMessage('getStory');
    currentStory = response.story;
    updateStoryDisplay();
}

async function submitWord() {
    const input = document.getElementById('new-word');
    const word = input.value.trim();
    
    if (word) {
        await window.reddit.sendMessage('addWord', { word });
        input.value = '';
        await fetchStory();
    }
}

function updateStoryDisplay() {
    const container = document.getElementById('story-content');
    container.textContent = currentStory.content.join(' ');
}

// Puzzle Management
async function fetchPuzzle() {
    const response = await window.reddit.getMessage('getPuzzle');
    currentPuzzle = response.puzzle;
    updatePuzzleDisplay();
}

async function submitPuzzleAnswer() {
    const input = document.getElementById('puzzle-answer');
    const answer = input.value.trim();
    
    if (answer) {
        const response = await window.reddit.sendMessage('checkPuzzle', { answer });
        if (response.correct) {
            alert('Correct answer! You earned the Puzzle Master achievement!');
        }
        input.value = '';
        await fetchPuzzle();
    }
}

function updatePuzzleDisplay() {
    const container = document.getElementById('puzzle-content');
    if (currentPuzzle) {
        container.textContent = currentPuzzle.question;
    }
}

// Voting Management
async function fetchVoting() {
    const response = await window.reddit.getMessage('getVoting');
    currentVote = response.vote;
    updateVotingDisplay();
}

async function submitVote(option) {
    await window.reddit.sendMessage('submitVote', { option });
    await fetchVoting();
}

function updateVotingDisplay() {
    const container = document.getElementById('voting-options');
    if (currentVote && currentVote.isActive) {
        container.innerHTML = currentVote.options
            .map(option => `
                <div class="voting-option">
                    <input type="radio" name="vote" value="${option}" 
                           onclick="submitVote('${option}')">
                    <label>${option}</label>
                </div>
            `)
            .join('');
    } else {
        container.innerHTML = '<p>No active voting session</p>';
    }
}

function setupEventListeners() {
    document.getElementById('new-word').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitWord();
    });
    
    document.getElementById('puzzle-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitPuzzleAnswer();
    });
}

// Start the application
init();