import Glass from './Glass.jsx';
import { formatSeconds } from '../lib/scoring.js';

export default function ResultScreen({ result, challenge, onPlayAgain, onChangeLevel, onLeaderboard }) {
  async function shareResult() {
    const text = `I scored ${result.score} in Nonsuch Perfect Pour. Can you beat me? https://mickhailov.github.io/nonsuch-perfect-pour/`;
    if (navigator.share) {
      await navigator.share({ title: 'Nonsuch Perfect Pour', text });
      return;
    }
    await navigator.clipboard?.writeText(text);
  }

  return (
    <section className="grid flex-1 content-center gap-6 py-4">
      <div className="mx-auto grid w-full max-w-3xl gap-6 rounded-[2rem] border border-gold/25 bg-parchment p-5 text-center shadow-soft sm:p-8">
        <div className="flex items-center justify-center gap-3">
          {challenge.image && (
            <img className="selected-beer-thumb" src={challenge.image} alt={`${challenge.beerName} can`} />
          )}
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">{challenge.name}</p>
        </div>

        <div className="grid gap-2">
          <p className="font-display text-7xl font-semibold leading-none sm:text-8xl">{result.score}</p>
          <p className="text-sm uppercase tracking-[0.22em] text-charcoal/55">out of 100</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{result.rating}</h1>
        </div>

        <div className="mx-auto max-w-xs">
          <Glass
            beerLevel={result.beerLevel}
            foamLevel={result.foamLevel}
            challenge={challenge}
            overflow={result.overflow}
            compact
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-left sm:grid-cols-4">
          <Metric label="Beer" value={`${Math.round(result.beerLevel)}%`} />
          <Metric label="Foam" value={`${Math.round(result.foamLevel)}%`} />
          <Metric label="Can Left" value={`${Math.round(result.canLeft ?? 0)}%`} />
          <Metric label="Time" value={formatSeconds(result.elapsedSeconds)} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="btn-secondary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn-secondary" onClick={onChangeLevel}>
            Change Level
          </button>
          <button className="btn-primary" onClick={onLeaderboard}>
            Submit to Leaderboard
          </button>
          <button className="btn-secondary" onClick={shareResult}>
            Share Result
          </button>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white/45 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-charcoal/55">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
