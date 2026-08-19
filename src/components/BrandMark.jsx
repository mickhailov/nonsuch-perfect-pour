export default function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-label="Veldra brand mark">
      <div className="relative h-10 w-10 rounded-full border border-gold/50 bg-parchment shadow-soft">
        <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold italic">
          V
        </span>
        <span className="absolute left-1/2 top-1/2 h-7 w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold" />
      </div>
      {!compact && (
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Veldra</p>
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-charcoal/70">Perfect Pour</p>
        </div>
      )}
    </div>
  );
}
