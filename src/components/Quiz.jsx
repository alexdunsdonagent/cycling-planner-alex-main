import React, { useRef } from 'react';
import QuizStep from './QuizStep';

// Quiz — top-level quiz orchestrator
// Props:
//   STEPS           — array of step definition objects
//   step            — current step number (1-indexed)
//   setStep         — setState for step
//   cur             — current draft answers
//   setCur          — setState for cur
//   ans             — saved/committed answers
//   setAns          — setState for ans
//   multi           — multi-select answers (legacy)
//   setMulti        — setState for multi
//   multiCombo      — multi2 selections {priorities: [...]}
//   setMultiCombo   — setState for multiCombo
//   i18n            — translations
//   nextError       — boolean
//   setNextError    — setState for nextError
//   canGo           — function: returns boolean
//   go              — function: commits current step and advances
//   onRunScore      — function: called when all steps complete with final answers
//   qPanelRef       — ref forwarded to the inner panel for scroll-into-view
export default function Quiz({
  STEPS,
  step,
  setStep,
  cur,
  setCur,
  ans,
  setAns,
  multi,
  setMulti,
  multiCombo,
  setMultiCombo,
  i18n,
  nextError,
  setNextError,
  canGo,
  go,
  onRunScore,
  qPanelRef,
}) {
  const Q = STEPS[step - 1];

  function setV(id, val) {
    setCur(p => ({ ...p, [id]: val }));
    // Scroll to next unanswered sub-question in a combo step
    if (Q && Q.type === 'combo') {
      setTimeout(() => {
        if (!qPanelRef.current) return;
        const subs = Q.subs.filter(s => s.type !== 'multi2');
        const currentIdx = subs.findIndex(s => s.id === id);
        const nextSub = subs[currentIdx + 1];
        if (nextSub) {
          const el = qPanelRef.current.querySelector(`[data-sub="${nextSub.id}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }

  function handleBack() {
    setStep(step - 1);
    setCur({});
    setMulti([]);
    setMultiCombo({});
    setNextError(false);
  }

  return (
    <QuizStep
      step={step}
      Q={Q}
      cur={cur}
      ans={ans}
      multiCombo={multiCombo}
      i18n={i18n}
      nextError={nextError}
      canGo={canGo()}
      onSetV={setV}
      onSetMultiCombo={setMultiCombo}
      onGo={go}
      onBack={step > 1 ? handleBack : null}
      onSetNextError={setNextError}
      stepImages={[
        'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=500&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
      ]}
    />
  );
}
