export const PERFECT_BEER_RANGE = [82, 88];
export const PERFECT_FOAM_RANGE = [8, 14];
export const MAX_GAME_SECONDS = 18;

export const CHALLENGES = [
  {
    id: 'hazy-ipa',
    name: 'Hazy IPA Pour',
    beerName: 'Hazy IPA',
    difficulty: 'Easy',
    speedLabel: 'Very Slow Pour',
    image: '/assets/hazy-ipa-can.webp',
    beerColor: '#d98b18',
    beerLight: '#f2b84d',
    beerDark: '#9d4f08',
    accentColor: '#315f42',
    pourRate: 16,
    foamRate: 0.32,
    beerTargetRange: [80, 90],
  },
  {
    id: 'raspberry-sour',
    name: 'Raspberry Sour Round',
    beerName: 'Raspberry Sour',
    difficulty: 'Medium',
    speedLabel: 'Moderate Pour',
    image: '/assets/raspberry-sour-can.webp',
    beerColor: '#b8263d',
    beerLight: '#dc5a67',
    beerDark: '#76111f',
    accentColor: '#111111',
    pourRate: 26,
    foamRate: 0.48,
    beerTargetRange: [82, 88],
  },
  {
    id: 'baltic-porter',
    name: 'Baltic Porter Trial',
    beerName: 'Baltic Porter',
    difficulty: 'Hard',
    speedLabel: 'Very Fast Pour',
    image: '/assets/baltic-porter-can.webp',
    beerColor: '#6f3717',
    beerLight: '#9d5b2a',
    beerDark: '#2b1207',
    accentColor: '#35302c',
    pourRate: 68,
    foamRate: 0.95,
    beerTargetRange: [83, 86],
  },
];

export function getRandomChallenge() {
  return CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
}

function rangeAccuracy(value, [min, max], tolerance) {
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min - value : value - max;
  return Math.max(0, 1 - distance / tolerance);
}

export function getRating(score) {
  if (score >= 95) return 'Nonsuch Perfect';
  if (score >= 80) return 'Taproom Ready';
  if (score >= 60) return 'Almost There';
  return 'Foamy Disaster';
}

export function calculateScore({ beerLevel, foamLevel, elapsedSeconds }, challenge = {}) {
  const beerTargetRange = challenge.beerTargetRange || PERFECT_BEER_RANGE;
  const canPoured = Math.min(100, beerLevel + foamLevel);
  const overflow = beerLevel + foamLevel > 100 || beerLevel > 96;

  const beerAccuracy = rangeAccuracy(beerLevel, beerTargetRange, 24);
  const foamAccuracy = rangeAccuracy(foamLevel, PERFECT_FOAM_RANGE, 12);
  const canAccuracy = canPoured < 72 ? 0 : Math.min(1, (canPoured - 72) / 25);
  const timeBonus = Math.max(0, 1 - elapsedSeconds / (MAX_GAME_SECONDS * 0.7));

  let score = beerAccuracy * 28 + foamAccuracy * 16 + canAccuracy * 40 + timeBonus * 16;
  if (overflow) score -= 45 + Math.min(30, beerLevel + foamLevel - 100);

  const roundedScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: roundedScore,
    rating: overflow ? 'Overflow!' : getRating(roundedScore),
    overflow,
    beerAccuracy,
    foamAccuracy,
    timeBonus,
  };
}

export function formatSeconds(seconds) {
  return `${seconds.toFixed(1)}s`;
}
