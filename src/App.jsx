import { useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import { CHALLENGES, getRandomChallenge } from './lib/scoring.js';

export default function App() {
  const [screen, setScreen] = useState('start');
  const [challenge, setChallenge] = useState(() => getRandomChallenge());
  const [result, setResult] = useState(null);
  const appStyle = useMemo(
    () => ({
      '--beer': challenge.beerColor,
      '--accent': challenge.accentColor,
    }),
    [challenge],
  );

  function startGame() {
    setChallenge(challenge);
    setResult(null);
    setScreen('game');
  }

  function startSelectedGame(selectedChallenge) {
    setChallenge(selectedChallenge);
    setResult(null);
    setScreen('game');
  }

  function finishGame(nextResult) {
    setResult(nextResult);
    setScreen('result');
  }

  return (
    <main style={appStyle} className="min-h-screen overflow-hidden bg-cream text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        {screen === 'start' && (
          <StartScreen
            challenges={CHALLENGES}
            selectedChallenge={challenge}
            onSelectChallenge={setChallenge}
            onStart={() => startSelectedGame(challenge)}
          />
        )}
        {screen === 'game' && <GameScreen challenge={challenge} onFinish={finishGame} />}
        {screen === 'result' && result && (
          <ResultScreen
            result={result}
            challenge={challenge}
            onPlayAgain={startGame}
            onChangeLevel={() => setScreen('start')}
            onLeaderboard={() => setScreen('leaderboard')}
          />
        )}
        {screen === 'leaderboard' && result && (
          <Leaderboard
            result={result}
            challenge={challenge}
            onPlayAgain={startGame}
            onBack={() => setScreen('result')}
          />
        )}
      </div>
    </main>
  );
}
