import { useState, useEffect, useCallback } from 'react';
import { SLIDES, FloatingEmojis } from './glowLoveSlides.jsx';
import { BRAND } from '../../data/glowCampaign.js';
import '../../styles/glow-love.css';

const SLIDE_MS = 7500;

/* Live campaign wrap-up — "Glow Love" style story (gradient bg + emojis). */
export default function GlowLoveWrap({ onBack }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;
  const next = useCallback(() => setIndex((i) => Math.min(count - 1, i + 1)), [count]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const isLast = index === count - 1;
  const slide = SLIDES[index];
  const Body = slide.Body;

  useEffect(() => {
    if (paused || isLast) return undefined;
    const id = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, isLast, next]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape' && onBack) onBack('Dashboard');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onBack]);

  return (
    <div className="gl">
      <article
        className={`gl-stage gl-grad--${slide.grad} ${slide.dark ? 'gl-stage--dark' : ''}`}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onMouseLeave={() => setPaused(false)}
      >
        <FloatingEmojis />

        <div className="gl-chrome">
          <div className="gl-dots">{SLIDES.map((s, i) => <span key={s.key} className={i === index ? 'on' : i < index ? 'done' : ''} />)}</div>
          <span className="gl-brand">{BRAND} · Wrapped</span>
          {onBack && <button type="button" className="gl-close" onClick={() => onBack('Dashboard')} aria-label="Close">✕</button>}
        </div>

        <div className="gl-body" key={slide.key}><Body onCta={() => onBack && onBack('Dashboard')} /></div>

        {!isLast && (
          <>
            <button type="button" className="gl-tap gl-tap--prev" onClick={prev} aria-label="Previous" tabIndex={-1} />
            <button type="button" className="gl-tap gl-tap--next" onClick={next} aria-label="Next" tabIndex={-1} />
            <button type="button" className="gl-arrow gl-arrow--prev" onClick={prev} disabled={index === 0} aria-label="Previous slide">‹</button>
            <button type="button" className="gl-arrow gl-arrow--next" onClick={next} aria-label="Next slide">›</button>
          </>
        )}
      </article>
    </div>
  );
}
