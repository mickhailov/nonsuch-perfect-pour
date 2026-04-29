import { useMemo, useState, useEffect } from 'react';
import { getLeaderboard, saveScore } from '../lib/leaderboard.js';
import { formatSeconds } from '../lib/scoring.js';

export default function Leaderboard({ result, challenge, onPlayAgain, onBack }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    getLeaderboard({ difficulty: challenge.difficulty }).then(setScores);
  }, [challenge.difficulty]);

  const previewScores = useMemo(() => {
    if (submitted) return scores;
    return [
      ...scores,
      {
        id: 'preview',
        name: name.trim() || 'Your Name',
        score: result.score,
        rating: result.rating,
        challengeId: challenge.id,
        challengeName: challenge.name,
        difficulty: challenge.difficulty,
        elapsedSeconds: result.elapsedSeconds,
      },
    ]
      .sort((a, b) => b.score - a.score || a.elapsedSeconds - b.elapsedSeconds)
      .slice(0, 10);
  }, [challenge, name, result, scores, submitted]);

  async function submitScore(event) {
    event.preventDefault();
    const updatedScores = await saveScore({
      name,
      score: result.score,
      rating: result.rating,
      challengeId: challenge.id,
      challengeName: challenge.name,
      difficulty: challenge.difficulty,
      beerLevel: result.beerLevel,
      foamLevel: result.foamLevel,
      elapsedSeconds: result.elapsedSeconds,
    });
    setScores(updatedScores);
    setSubmitted(true);

    setTimeout(() => onBack(), 1500);
  }

  return (
    <section className="grid flex-1 content-center gap-5 py-4">
      <div className="mx-auto grid w-full max-w-3xl gap-5">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            125 Pacific Ave. Taproom Challenge
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold">Leaderboard</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/60">
            {challenge.difficulty} · {challenge.beerName}
          </p>
        </header>

        <form
          className="grid gap-3 rounded-2xl border border-ink/10 bg-parchment p-4 shadow-soft sm:grid-cols-[1fr_auto]"
          onSubmit={submitScore}
        >
          <label className="grid gap-2 text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-charcoal/60">Player Name</span>
            <input
              className="h-14 rounded-lg border border-ink/15 bg-white px-4 text-lg outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Taproom Guest"
              maxLength={18}
              disabled={submitted}
            />
          </label>
          <button className="btn-primary self-end" disabled={submitted}>
            {submitted ? 'Submitted' : 'Submit Score'}
          </button>
        </form>

        <ol className="grid gap-2">
          {previewScores.map((entry, index) => (
            <li
              className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl border p-3 shadow-soft ${
                entry.id === 'preview' ? 'border-gold bg-white' : 'border-ink/10 bg-parchment'
              }`}
              key={entry.id}
            >
              <span className="font-display text-2xl font-semibold text-gold">{index + 1}</span>
              <span className="min-w-0">
                <strong className="block truncate text-lg">{entry.name}</strong>
                <small className="block truncate text-charcoal/60">
                  {entry.challengeName} · {formatSeconds(entry.elapsedSeconds)}
                </small>
              </span>
              <span className="text-2xl font-semibold tabular-nums">{entry.score}</span>
            </li>
          ))}
        </ol>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="btn-secondary" onClick={onBack}>
            Back to Result
          </button>
          <button className="btn-primary" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </section>
  );
}
