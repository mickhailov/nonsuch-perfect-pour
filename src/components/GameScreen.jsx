import { useCallback, useEffect, useRef, useState } from 'react';
import Glass from './Glass.jsx';
import { calculateScore, formatSeconds, MAX_GAME_SECONDS, OVERFLOW_THRESHOLD } from '../lib/scoring.js';

const INITIAL_STATE = {
  beerLevel: 0,
  foamLevel: 0,
  elapsedSeconds: 0,
};

function getCanLeft({ beerLevel, foamLevel }) {
  return Math.max(0, 100 - Math.min(100, beerLevel + foamLevel));
}

function getGlassWidthFactor(level) {
  if (level < 10) return 0.62;
  if (level < 26) return 0.78;
  if (level < 54) return 1.42;
  if (level < 78) return 1.22;
  return 0.92;
}

export default function GameScreen({ challenge, onFinish }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [isPouring, setIsPouring] = useState(false);
  const isPouringRef = useRef(false);
  const stateRef = useRef(INITIAL_STATE);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(null);
  const finishedRef = useRef(false);

  const overflow = state.beerLevel + state.foamLevel > OVERFLOW_THRESHOLD;
  const pourPercent = Math.min(100, state.beerLevel + state.foamLevel);
  const canLeft = getCanLeft(state);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    isPouringRef.current = false;
    setIsPouring(false);

    const current = stateRef.current;
    onFinish({
      ...current,
      canLeft: getCanLeft(current),
      ...calculateScore(current, challenge),
    });
  }, [onFinish, challenge]);

  useEffect(() => {
    function tick(timestamp) {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const delta = Math.min(0.05, (timestamp - lastFrameRef.current) / 1000);
      lastFrameRef.current = timestamp;

      setState((previous) => {
        const next = { ...previous, elapsedSeconds: previous.elapsedSeconds + delta };

        if (isPouringRef.current) {
          const speedCurve = 0.82 + Math.min(0.52, previous.beerLevel / 155);
          const foamCurve = previous.beerLevel < 60 ? 0.82 : 1.18;
          const widthFactor = getGlassWidthFactor(previous.beerLevel);
          const beerIncrement = (challenge.pourRate * speedCurve * delta) / widthFactor;
          const foamIncrement = challenge.pourRate * challenge.foamRate * foamCurve * 0.2 * delta;
          const remainingCan = getCanLeft(previous);
          const totalIncrement = beerIncrement + foamIncrement;
          const canScale = totalIncrement > remainingCan && totalIncrement > 0 ? remainingCan / totalIncrement : 1;

          next.beerLevel = previous.beerLevel + beerIncrement * canScale;
          next.foamLevel = previous.foamLevel + foamIncrement * canScale;
        }

        stateRef.current = next;
        return next;
      });

      if (stateRef.current.elapsedSeconds >= MAX_GAME_SECONDS || getCanLeft(stateRef.current) <= 0) {
        finish();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [challenge, finish]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code !== 'Space' || event.repeat) return;
      event.preventDefault();
      if (finishedRef.current) return;
      isPouringRef.current = true;
      setIsPouring(true);
    }

    function handleKeyUp(event) {
      if (event.code !== 'Space') return;
      event.preventDefault();
      if (!isPouringRef.current) return;
      finish();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [finish]);

  function startPour(event) {
    event.preventDefault();
    if (finishedRef.current) return;
    isPouringRef.current = true;
    setIsPouring(true);
  }

  function stopPour(event) {
    event.preventDefault();
    finish();
  }

  return (
    <section className="grid min-h-screen-minus gap-4 pb-4 pt-2">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">{challenge.name}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-5xl">Perfect Pour</h1>
          </div>
        </div>
        <div className="rounded-full border border-ink/10 bg-parchment px-4 py-2 text-right shadow-soft">
          <p className="text-xs uppercase tracking-[0.16em] text-charcoal/55">Timer</p>
          <p className="font-semibold tabular-nums">{formatSeconds(state.elapsedSeconds)}</p>
        </div>
      </header>

      <div className="grid place-items-center">
        <div className="game-pour-stage">
          <Glass beerLevel={state.beerLevel} foamLevel={state.foamLevel} challenge={challenge} pouring={isPouring} overflow={overflow} />
        </div>
      </div>

      <div className="grid gap-4 self-end">
        <div className="rounded-full border border-ink/10 bg-parchment p-1 shadow-soft">
          <div className="h-3 rounded-full bg-black/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--beer),#f3d98a)] transition-[width] duration-75"
              style={{ width: `${pourPercent}%` }}
            />
          </div>
        </div>

        <button
          className={`pour-button ${isPouring ? 'is-active' : ''}`}
          onPointerDown={startPour}
          onPointerUp={stopPour}
          onPointerCancel={stopPour}
          onPointerLeave={(event) => {
            if (isPouringRef.current) stopPour(event);
          }}
          onMouseDown={startPour}
          onMouseUp={stopPour}
          onTouchStart={startPour}
          onTouchEnd={stopPour}
          onTouchCancel={stopPour}
        >
          <span className="pour-can-art">
            <img src={challenge.image} alt="" draggable={false} />
          </span>
          <span className="pour-button-copy">
            <strong>{isPouring ? 'Release to Stop' : 'Hold Can to Pour'}</strong>
            <small>{Math.round(canLeft)}% left</small>
          </span>
        </button>
      </div>
    </section>
  );
}
