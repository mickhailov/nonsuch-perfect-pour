const STORAGE_KEY = 'veldra-perfect-pour-leaderboard';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyFj59ZDPFjCgcS1amfRxVk68dl_xF6zs_9lBS7urAqAY2DaxMY2gXq_1RXwyXy1tod/exec';

function readLocalScores() {
  try {
    const scores = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(scores) ? scores : [];
  } catch {
    return [];
  }
}

export async function getLeaderboard(filter = {}) {
  const { difficulty } = filter;

  // Try to fetch from Google Sheet (source of truth)
  try {
    const response = await fetch(SHEET_URL);
    if (response.ok) {
      let scores = await response.json();

      return scores
        .filter((score) => {
          if (difficulty) return score.difficulty === difficulty;
          return true;
        })
        .sort((a, b) => b.score - a.score || a.elapsedSeconds - b.elapsedSeconds)
        .slice(0, 10);
    }
  } catch {
    // Fall back to local scores only if sheet fetch fails
  }

  const scores = readLocalScores();
  return scores
    .filter((score) => {
      if (difficulty) return score.difficulty === difficulty;
      return true;
    })
    .sort((a, b) => b.score - a.score || a.elapsedSeconds - b.elapsedSeconds)
    .slice(0, 10);
}

export async function saveScore(entry) {
  const newScore = {
    id: crypto.randomUUID?.() || `${Date.now()}`,
    name: entry.name.trim().slice(0, 18) || 'Taproom Guest',
    score: entry.score,
    rating: entry.rating,
    challengeId: entry.challengeId,
    challengeName: entry.challengeName,
    difficulty: entry.difficulty,
    beerLevel: entry.beerLevel,
    foamLevel: entry.foamLevel,
    elapsedSeconds: entry.elapsedSeconds,
    createdAt: new Date().toISOString(),
  };

  // Save to local storage
  const localScores = [...readLocalScores(), newScore];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localScores));

  // Post to Google Sheet (fire and forget)
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newScore.name,
        score: newScore.score,
        difficulty: newScore.difficulty,
        beerLevel: newScore.beerLevel,
        foamLevel: newScore.foamLevel,
        elapsedSeconds: newScore.elapsedSeconds,
      }),
    });
    console.log('Score submitted to sheet');
  } catch (error) {
    console.log('Sheet post error (local save still works):', error.message);
  }

  return getLeaderboard({ challengeId: entry.challengeId, difficulty: entry.difficulty });
}
