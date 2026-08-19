export default function Glass({ beerLevel, foamLevel, challenge, pouring = false, overflow = false, compact = false }) {
  const clampedBeer = Math.min(100, Math.max(0, beerLevel));
  const clampedFoam = Math.min(22, Math.max(0, foamLevel));
  const fillHeight = Math.min(100, clampedBeer + clampedFoam);
  const beerHeight = clampedBeer;
  const foamHeight = clampedFoam;
  const beerY = 190 - beerHeight * 1.76;
  const foamY = Math.max(14, beerY - foamHeight * 1.76);
  const foamSvgHeight = Math.max(0, beerY - foamY);

  return (
    <div className={`glass-stage svg-glass-stage ${compact ? 'is-compact' : ''} ${pouring ? 'is-pouring' : ''}`}>
      <svg
        className={`tulip-glass ${overflow ? 'overflowing' : ''}`}
        viewBox="0 0 160 260"
        role="img"
        aria-label={`Glass filled to ${Math.round(fillHeight)} percent`}
      >
        <defs>
          <clipPath id="tulip-bowl">
            <path d="M48 14 C43 32 39 50 38 70 C36 105 45 139 61 166 C67 176 73 184 80 190 C87 184 93 176 99 166 C115 139 124 105 122 70 C121 50 117 32 112 14 C100 18 60 18 48 14 Z" />
          </clipPath>
          <linearGradient id="glass-shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="42%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="76%" stopColor="rgba(255,255,255,0.82)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>
          <linearGradient id="stem-shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.72)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.68)" />
          </linearGradient>
        </defs>

        <ellipse cx="80" cy="244" rx="52" ry="8" className="svg-glass-base" />
        <path d="M74 187 C72 202 72 218 75 236 C76 241 84 241 85 236 C88 218 88 202 86 187 Z" className="svg-glass-stem" />

        <g clipPath="url(#tulip-bowl)">
          <rect x="0" y="0" width="160" height="260" className="svg-bowl-bg" />
          <rect
            x="0"
            y={beerY}
            width="160"
            height={Math.max(0, 190 - beerY)}
            fill={challenge.beerColor}
            className="svg-beer-fill"
          />
          <rect
            x="0"
            y={foamY}
            width="160"
            height={foamSvgHeight}
            className="svg-foam-fill"
          />
          <ellipse cx="80" cy={beerY} rx="48" ry="5" fill={challenge.beerLight} opacity="0.92" />
          <g className="svg-bubbles">
            {Array.from({ length: 10 }).map((_, index) => (
              <circle
                key={index}
                cx={58 + index * 6}
                cy={168 - index * 12}
                r={1.8 + (index % 3) * 0.35}
                style={{ '--i': index }}
              />
            ))}
          </g>
        </g>

        <path d="M48 14 C43 32 39 50 38 70 C36 105 45 139 61 166 C67 176 73 184 80 190 C87 184 93 176 99 166 C115 139 124 105 122 70 C121 50 117 32 112 14 C100 18 60 18 48 14 Z" className="svg-bowl-outline" />
        <ellipse cx="80" cy="15" rx="32" ry="4" className="svg-rim" />
        <text x="80" y="88" textAnchor="middle" className="svg-glass-logo">VELDRA</text>
        <path d="M112 36 C123 82 117 130 95 164" className="svg-highlight" />
        {overflow && <ellipse cx="80" cy="12" rx="39" ry="7" className="svg-overflow" />}
      </svg>
    </div>
  );
}
