export const PERFECT_BEER_RANGE = [82, 88];
export const PERFECT_FOAM_RANGE = [8, 14];
export const MAX_GAME_SECONDS = 18;

const baseUrl = import.meta.env.BASE_URL || '/';

export const CHALLENGES = [
  {
    id: 'hazy-ipa',
    name: 'Hazy IPA Pour',
    beerName: 'Hazy IPA',
    difficulty: 'Easy',
    speedLabel: 'Very Slow Pour',
    image: baseUrl + 'assets/hazy-ipa-can.webp',
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
    image: baseUrl + 'assets/raspberry-sour-can.webp',
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
    image: baseUrl + 'assets/baltic-porter-can.webp',
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
  const totalPoured = beerLevel + foamLevel;

  if (totalPoured > 98) {
    return {
      score: 0,
      rating: 'Overflow Fail',
      overflow: true,
      beerAccuracy: 0,
      foamAccuracy: 0,
      fillAccuracy: 0,
      timeBonus: 0,
    };
  }

  const beerAccuracy = rangeAccuracy(beerLevel, beerTargetRange, 20);
  const foamAccuracy = rangeAccuracy(foamLevel, PERFECT_FOAM_RANGE, 10);
  const fillAccuracy = Math.min(1, totalPoured / 100);
  const timeBonus = Math.max(0, 1 - elapsedSeconds / (MAX_GAME_SECONDS * 0.7));

  const score = (beerAccuracy * 0.25 + foamAccuracy * 0.25 + fillAccuracy * 0.4 + timeBonus * 0.1) * 100;
  const roundedScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: roundedScore,
    rating: getRating(roundedScore),
    overflow: false,
    beerAccuracy,
    foamAccuracy,
    fillAccuracy,
    timeBonus,
  };
}

export function formatSeconds(seconds) {
  return `${seconds.toFixed(1)}s`;
}
