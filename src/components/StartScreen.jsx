import { useState, useEffect } from 'react';
import BrandMark from './BrandMark.jsx';
import { getLeaderboard } from '../lib/leaderboard.js';
import { formatSeconds } from '../lib/scoring.js';

export default function StartScreen({ challenges, selectedChallenge, onSelectChallenge, onStart }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLeaderboard({
      difficulty: selectedChallenge.difficulty,
    }).then(data => {
      setScores(data.slice(0, 5));
      setLoading(false);
    });
  }, [selectedChallenge.difficulty]);

  return (
    <section className="grid flex-1 content-between gap-7 pb-4 pt-3 text-center">
      <div className="flex items-center justify-center pt-8">
        <div className="flex items-center justify-center gap-6">
          <div className="relative h-32 w-32 rounded-full border-2 border-gold/50 bg-parchment shadow-soft">
            <span className="absolute inset-0 flex items-center justify-center font-display text-8xl font-semibold italic">
              N
            </span>
            <span className="absolute left-1/2 top-1/2 h-24 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold" />
          </div>
          <div className="text-left">
            <p className="text-2xl font-semibold uppercase tracking-[0.28em] text-gold">Nonsuch</p>
            <p className="text-lg uppercase tracking-[0.22em] text-charcoal/70">Perfect Pour</p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <div className="level-button-card">
          <div className="level-slider-header">
            <span>Challenge Level</span>
            <strong>{selectedChallenge.difficulty}</strong>
          </div>

          <div className="challenge-button-grid" aria-label="Challenge level choices">
            {challenges.map((challenge) => {
              const isSelected = challenge.id === selectedChallenge.id;
              return (
              <button
                className={`challenge-bottle-button ${isSelected ? 'is-selected' : ''}`}
                key={`level-${challenge.id}`}
                onClick={() => onSelectChallenge(challenge)}
                type="button"
              >
                <span className="level-bottle-wrap">
                  <img src={challenge.image} alt={`${challenge.beerName} can`} />
                </span>
                <span className="level-copy">
                  <strong>{challenge.difficulty}</strong>
                  <small>{challenge.beerName}</small>
                  <em>{challenge.speedLabel}</em>
                </span>
              </button>
              );
            })}
          </div>
        </div>

        <button className="btn-primary mx-auto w-full max-w-sm" onClick={onStart}>
          Start Pour
        </button>

        <section className="home-scoreboard" aria-label={`${selectedChallenge.difficulty} scoreboard`}>
          <div className="home-scoreboard-header">
            <span>Scoreboard</span>
            <strong>{selectedChallenge.difficulty}</strong>
          </div>
          {loading ? (
            <p className="empty-scoreboard">Loading...</p>
          ) : scores.length > 0 ? (
            <ol className="home-score-list">
              {scores.map((score, index) => (
                <li key={score.id}>
                  <span className="score-rank">{index + 1}</span>
                  <span className="score-player">
                    <strong>{score.name}</strong>
                    <small>{formatSeconds(score.elapsedSeconds)}</small>
                  </span>
                  <span className="score-value">{score.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-scoreboard">No {selectedChallenge.difficulty.toLowerCase()} scores yet.</p>
          )}
        </section>
      </div>

      <footer className="mx-auto grid max-w-sm gap-2 text-sm leading-relaxed text-charcoal/65">
        <p>Proudly pouring in Winnipeg, Manitoba</p>
        <p>For promotional entertainment only. No alcohol purchase required.</p>
        <p className="text-xs text-charcoal/45">v0.3.2</p>
      </footer>
    </section>
  );
}
