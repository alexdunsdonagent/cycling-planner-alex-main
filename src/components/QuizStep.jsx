import React from 'react';
import QuizCard from './QuizCard';

// QuizStep — renders a single quiz step with its sub-questions
// Props:
//   step       — step number (1-indexed)
//   Q          — step definition object {id, label, q, sell, hint, type, subs}
//   cur        — current answers object {ability, terrain, ...}
//   ans        — saved answers object
//   multiCombo — multi2 selections {priorities: [...v]}
//   i18n       — translations
//   nextError  — boolean
//   canGo()    — function
//   onSetV(id, val)    — function
//   onSetMultiCombo(fn) — function
//   onGo()      — function
//   onBack()    — function (or null)
//   onSetNextError(bool) — function
export default function QuizStep({
  step,
  Q,
  cur,
  ans,
  multiCombo,
  i18n,
  nextError,
  canGo,
  onSetV,
  onSetMultiCombo,
  onGo,
  onBack,
  onSetNextError,
  onSubProgress,
  stepImages,
}) {
  const images = stepImages || [
    'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=500&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
  ];

  function subProgress() {
    if (!Q || Q.type !== 'combo') return null;
    const required = Q.subs.filter(
      s => s.type !== 'multi2' && s.id !== 'continent' && s.id !== 'hours' && s.id !== 'month' && s.label !== 'SKIP' && s.id !== 'priorities'
    );
    const total = required.length;
    const done = required.filter(s => !!cur[s.id]).length;
    return { done, total };
  }

  const progress = onSubProgress ? onSubProgress() : subProgress();

  const sellText =
    Q.id === 'profile' ? i18n.q1sell
    : Q.id === 'logistics' ? i18n.q2sell
    : Q.sell;

  const hintText = Q.hint;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Main panel */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: '24px 48px 32px 64px',
          minHeight: 0,
        }}
      >
        <div style={{ maxWidth: '900px', width: '100%' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#e8b84b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'DM Mono','Courier New',monospace",
              fontSize: '11px',
              fontWeight: '600',
              color: '#0a0a08',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(232,184,75,0.3)',
            }}>
              {step}
            </div>
            <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '11px', letterSpacing: '3px', color: '#e8b84b', textTransform: 'uppercase' }}>
              {Q.label.split('-')[1]?.trim() || Q.label}
            </div>
          </div>

          {/* Question */}
          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 'clamp(22px,2.8vw,36px)',
            fontWeight: '700',
            color: '#f5f2ec',
            lineHeight: 1.1,
            letterSpacing: '-0.3px',
            marginBottom: '10px',
          }}>
            {Q.q}
          </h2>

          {/* Sell text */}
          {sellText && (
            <div style={{
              padding: '9px 14px',
              borderLeft: '3px solid #e8b84b',
              background: 'rgba(232,184,75,0.05)',
              borderRadius: '0 6px 6px 0',
              marginBottom: '10px',
            }}>
              <span style={{ fontSize: '15px', color: '#c8a83a', lineHeight: 1.5, fontStyle: 'italic' }}>
                {sellText}
              </span>
            </div>
          )}

          {/* Hint */}
          <p style={{
            fontFamily: "'DM Mono','Courier New',monospace",
            fontSize: '12px',
            color: '#7a7a74',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}>
            {hintText}
          </p>

          {/* Sub-question progress bar */}
          {progress && progress.total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1, height: '2px', background: '#1a1a18', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(progress.done / progress.total) * 100}%`, height: '100%', background: '#e8b84b', borderRadius: '2px', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '10px', color: '#7a7a74', whiteSpace: 'nowrap' }}>
                {progress.done}/{progress.total} answered
              </span>
            </div>
          )}

          {/* Sub-questions */}
          {Q.type === 'combo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {Q.subs.map(sub => {
                if (sub.label === 'SKIP') return null;
                const isSelected = !!cur[sub.id];

                return (
                  <div
                    key={sub.id}
                    data-sub={sub.id}
                    style={{
                      background: '#111110',
                      border: isSelected ? '1px solid rgba(232,184,75,0.3)' : '1px solid #2e2e2b',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Sub-label */}
                    <div style={{
                      fontFamily: "'DM Mono','Courier New',monospace",
                      fontSize: '11px',
                      letterSpacing: '3px',
                      color: '#C9A96E',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      {sub.label}
                      {isSelected && <span style={{ fontSize: '10px', color: '#4aaa40', letterSpacing: '0' }}> ✓</span>}
                    </div>

                    {/* choice2 */}
                    {sub.type === 'choice2' && (
                      <div
                        role="radiogroup"
                        aria-label={sub.label}
                        style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '8px' }}
                      >
                        {sub.opts.map(o => (
                          <QuizCard
                            key={o.v}
                            type="choice2"
                            option={o}
                            selected={cur[sub.id] === o.v}
                            onSelect={val => onSetV(sub.id, val)}
                          />
                        ))}
                      </div>
                    )}

                    {/* pills */}
                    {sub.type === 'pills' && (
                      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                        {sub.opts.map(o => (
                          <QuizCard
                            key={o.v}
                            type="pills"
                            option={o}
                            selected={cur[sub.id] === o.v}
                            onSelect={val => onSetV(sub.id, val)}
                          />
                        ))}
                      </div>
                    )}

                    {/* multi2 */}
                    {sub.type === 'multi2' && (
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
                          {sub.opts.map(o => (
                            <QuizCard
                              key={o.v}
                              type="multi2"
                              option={o}
                              selected={false}
                              multiCombo={multiCombo[sub.id] || []}
                              subId={sub.id}
                              max={sub.max}
                              onSelect={val => {
                                // val is the new array
                                onSetMultiCombo(prev => ({ ...prev, [sub.id]: val }));
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '11px', color: '#7a7a74' }}>
                          {(multiCombo[sub.id] || []).length}/{sub.max} selected · optional
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            {nextError && !canGo && (
              <div style={{
                fontFamily: "'DM Mono','Courier New',monospace",
                fontSize: '11px',
                color: '#c0392b',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>&#9888;</span> Please complete all selections above
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Next / Find button */}
              <button
                className="btn-gold"
                onClick={() => {
                  if (!canGo) { onSetNextError(true); return; }
                  onSetNextError(false);
                  onGo();
                }}
                style={{
                  background: 'linear-gradient(180deg,#F0C654 0%,#E8B84B 55%,#D4A23E 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#0a0a08',
                  padding: '12px 36px',
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: canGo ? '0 4px 20px rgba(232,184,75,0.3)' : 'none',
                  opacity: canGo ? 1 : 0.45,
                  transition: 'opacity 0.15s',
                }}
                onMouseOver={e => { if (canGo) e.currentTarget.style.opacity = '0.88'; }}
                onMouseOut={e => e.currentTarget.style.opacity = canGo ? '1' : '0.45'}
              >
                {step === 3 ? i18n.findBtn : i18n.nextBtn}
              </button>

              {/* Back button */}
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    background: 'transparent',
                    border: '1px solid #2e2e2b',
                    borderRadius: '6px',
                    color: '#7a7a74',
                    cursor: 'pointer',
                    fontFamily: "'DM Mono','Courier New',monospace",
                    fontSize: '11px',
                    letterSpacing: '2px',
                    padding: '15px 20px',
                    transition: 'all 0.15s',
                  }}
                >
                  {i18n.backBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          borderLeft: '1px solid #1a1a18',
          background: '#070706',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 28px',
          overflowY: 'auto',
        }}
      >
        <img
          src={images[step - 1] || images[0]}
          alt="Cycling"
          style={{
            width: '100%',
            height: '160px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '20px',
            opacity: 0.8,
          }}
        />
        <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '11px', letterSpacing: '2px', color: '#7a7a74', marginBottom: '12px', textTransform: 'uppercase' }}>
          Why this matters
        </div>
        <p style={{
          fontSize: '19px',
          color: '#777',
          lineHeight: 1.8,
          marginBottom: '20px',
          fontFamily: 'Georgia,serif',
        }}>
          {step === 1
            ? 'Your riding level and terrain preference eliminate 60-70% of destinations immediately. Be honest - wrong answers mean wrong destinations.'
            : 'Season is the hardest filter. We permanently remove destinations that are out of season, overrun or too hot.'}
        </p>
        <div style={{ padding: '12px 14px', background: '#141413', border: '1px solid #2e2e2b', borderRadius: '6px' }}>
          <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '11px', color: '#e8b84b', letterSpacing: '2px', marginBottom: '6px' }}>
            SCORING ENGINE
          </div>
          <div style={{ fontFamily: "'DM Mono','Courier New',monospace", fontSize: '11px', color: '#666660', lineHeight: 1.7 }}>
            {step === 1 ? '100s of cycling trips filtered by ability, terrain and style' : 'Month and region narrows to exact in-season matches'}
          </div>
        </div>
      </div>
    </div>
  );
}
